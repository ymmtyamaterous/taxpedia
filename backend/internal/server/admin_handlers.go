package server

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
)

type courseInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Level       string `json:"level"`
	OrderIndex  int    `json:"orderIndex"`
}

type lessonInput struct {
	CourseID         int    `json:"courseId"`
	Title            string `json:"title"`
	Content          string `json:"content"`
	EstimatedMinutes int    `json:"estimatedMinutes"`
	OrderIndex       int    `json:"orderIndex"`
}

type glossaryInput struct {
	Term       string `json:"term"`
	Reading    string `json:"reading"`
	Definition string `json:"definition"`
	Category   string `json:"category"`
}

func (s *Server) adminCoursesRoute(w http.ResponseWriter, r *http.Request) {
	if _, err := s.requireAdmin(r); err != nil {
		writeErr(w, http.StatusForbidden, "administrator permission required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.adminGetCourses(w)
	case http.MethodPost:
		s.adminCreateCourse(w, r)
	default:
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Server) adminCourseRoute(w http.ResponseWriter, r *http.Request) {
	if _, err := s.requireAdmin(r); err != nil {
		writeErr(w, http.StatusForbidden, "administrator permission required")
		return
	}
	id, ok := adminRouteID(w, r.URL.Path, "/api/admin/courses/")
	if !ok {
		return
	}

	switch r.Method {
	case http.MethodPut:
		s.adminUpdateCourse(w, r, id)
	case http.MethodDelete:
		s.adminDeleteCourse(w, id)
	default:
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Server) adminGetCourses(w http.ResponseWriter) {
	rows, err := s.db.Query(`SELECT id, title, description, level, order_index FROM courses ORDER BY order_index, id`)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load courses")
		return
	}
	defer rows.Close()

	items := make([]Course, 0)
	for rows.Next() {
		var course Course
		if err := rows.Scan(&course.ID, &course.Title, &course.Description, &course.Level, &course.OrderIndex); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan courses")
			return
		}
		items = append(items, course)
	}
	if err := rows.Err(); err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load courses")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) adminCreateCourse(w http.ResponseWriter, r *http.Request) {
	var input courseInput
	if !decodeJSON(w, r, &input) {
		return
	}
	if !validCourseInput(input) {
		writeErr(w, http.StatusBadRequest, "title, description, and a valid level are required")
		return
	}
	var course Course
	err := s.db.QueryRow(
		`INSERT INTO courses (title, description, level, order_index) VALUES ($1, $2, $3, $4) RETURNING id, title, description, level, order_index`,
		input.Title, input.Description, input.Level, input.OrderIndex,
	).Scan(&course.ID, &course.Title, &course.Description, &course.Level, &course.OrderIndex)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to create course")
		return
	}
	writeJSON(w, http.StatusCreated, course)
}

func (s *Server) adminUpdateCourse(w http.ResponseWriter, r *http.Request, id int) {
	var input courseInput
	if !decodeJSON(w, r, &input) {
		return
	}
	if !validCourseInput(input) {
		writeErr(w, http.StatusBadRequest, "title, description, and a valid level are required")
		return
	}
	var course Course
	err := s.db.QueryRow(
		`UPDATE courses SET title = $1, description = $2, level = $3, order_index = $4 WHERE id = $5 RETURNING id, title, description, level, order_index`,
		input.Title, input.Description, input.Level, input.OrderIndex, id,
	).Scan(&course.ID, &course.Title, &course.Description, &course.Level, &course.OrderIndex)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "course not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to update course")
		return
	}
	writeJSON(w, http.StatusOK, course)
}

func (s *Server) adminDeleteCourse(w http.ResponseWriter, id int) {
	result, err := s.db.Exec(`DELETE FROM courses WHERE id = $1`, id)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to delete course")
		return
	}
	count, err := result.RowsAffected()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to delete course")
		return
	}
	if count == 0 {
		writeErr(w, http.StatusNotFound, "course not found")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) adminLessonsRoute(w http.ResponseWriter, r *http.Request) {
	if _, err := s.requireAdmin(r); err != nil {
		writeErr(w, http.StatusForbidden, "administrator permission required")
		return
	}
	if r.Method != http.MethodPost {
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	s.adminCreateLesson(w, r)
}

func (s *Server) adminLessonRoute(w http.ResponseWriter, r *http.Request) {
	if _, err := s.requireAdmin(r); err != nil {
		writeErr(w, http.StatusForbidden, "administrator permission required")
		return
	}
	id, ok := adminRouteID(w, r.URL.Path, "/api/admin/lessons/")
	if !ok {
		return
	}
	switch r.Method {
	case http.MethodPut:
		s.adminUpdateLesson(w, r, id)
	case http.MethodDelete:
		s.adminDeleteLesson(w, id)
	default:
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Server) adminCreateLesson(w http.ResponseWriter, r *http.Request) {
	var input lessonInput
	if !decodeJSON(w, r, &input) {
		return
	}
	if !validLessonInput(input) {
		writeErr(w, http.StatusBadRequest, "courseId, title, content, and estimatedMinutes are required")
		return
	}
	var lesson Lesson
	err := s.db.QueryRow(`INSERT INTO lessons (course_id, title, content, estimated_minutes, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id, course_id, title, content, estimated_minutes, order_index`, input.CourseID, input.Title, input.Content, input.EstimatedMinutes, input.OrderIndex).Scan(&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Content, &lesson.EstimatedMinute, &lesson.OrderIndex)
	if isForeignKeyViolation(err) {
		writeErr(w, http.StatusBadRequest, "course not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to create lesson")
		return
	}
	writeJSON(w, http.StatusCreated, lesson)
}

func (s *Server) adminUpdateLesson(w http.ResponseWriter, r *http.Request, id int) {
	var input lessonInput
	if !decodeJSON(w, r, &input) {
		return
	}
	if !validLessonInput(input) {
		writeErr(w, http.StatusBadRequest, "courseId, title, content, and estimatedMinutes are required")
		return
	}
	var lesson Lesson
	err := s.db.QueryRow(`UPDATE lessons SET course_id = $1, title = $2, content = $3, estimated_minutes = $4, order_index = $5 WHERE id = $6 RETURNING id, course_id, title, content, estimated_minutes, order_index`, input.CourseID, input.Title, input.Content, input.EstimatedMinutes, input.OrderIndex, id).Scan(&lesson.ID, &lesson.CourseID, &lesson.Title, &lesson.Content, &lesson.EstimatedMinute, &lesson.OrderIndex)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "lesson not found")
		return
	}
	if isForeignKeyViolation(err) {
		writeErr(w, http.StatusBadRequest, "course not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to update lesson")
		return
	}
	writeJSON(w, http.StatusOK, lesson)
}

func (s *Server) adminDeleteLesson(w http.ResponseWriter, id int) {
	result, err := s.db.Exec(`DELETE FROM lessons WHERE id = $1`, id)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to delete lesson")
		return
	}
	count, err := result.RowsAffected()
	if err != nil || count == 0 {
		writeErr(w, http.StatusNotFound, "lesson not found")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) adminGlossaryRoute(w http.ResponseWriter, r *http.Request) {
	if _, err := s.requireAdmin(r); err != nil {
		writeErr(w, http.StatusForbidden, "administrator permission required")
		return
	}
	if r.Method != http.MethodPost {
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	s.adminCreateGlossaryTerm(w, r)
}

func (s *Server) adminGlossaryTermRoute(w http.ResponseWriter, r *http.Request) {
	if _, err := s.requireAdmin(r); err != nil {
		writeErr(w, http.StatusForbidden, "administrator permission required")
		return
	}
	id, ok := adminRouteID(w, r.URL.Path, "/api/admin/glossary/")
	if !ok {
		return
	}
	switch r.Method {
	case http.MethodPut:
		s.adminUpdateGlossaryTerm(w, r, id)
	case http.MethodDelete:
		s.adminDeleteGlossaryTerm(w, id)
	default:
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *Server) adminCreateGlossaryTerm(w http.ResponseWriter, r *http.Request) {
	var input glossaryInput
	if !decodeJSON(w, r, &input) {
		return
	}
	if !validGlossaryInput(input) {
		writeErr(w, http.StatusBadRequest, "term and definition are required")
		return
	}
	var term GlossaryTerm
	err := s.db.QueryRow(`INSERT INTO glossary_terms (term, reading, definition, category) VALUES ($1, $2, $3, $4) RETURNING id, term, reading, definition, category`, input.Term, input.Reading, input.Definition, input.Category).Scan(&term.ID, &term.Term, &term.Reading, &term.Definition, &term.Category)
	if isUniqueViolation(err) {
		writeErr(w, http.StatusConflict, "term already exists")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to create term")
		return
	}
	writeJSON(w, http.StatusCreated, term)
}

func (s *Server) adminUpdateGlossaryTerm(w http.ResponseWriter, r *http.Request, id int) {
	var input glossaryInput
	if !decodeJSON(w, r, &input) {
		return
	}
	if !validGlossaryInput(input) {
		writeErr(w, http.StatusBadRequest, "term and definition are required")
		return
	}
	var term GlossaryTerm
	err := s.db.QueryRow(`UPDATE glossary_terms SET term = $1, reading = $2, definition = $3, category = $4, updated_at = NOW() WHERE id = $5 RETURNING id, term, reading, definition, category`, input.Term, input.Reading, input.Definition, input.Category, id).Scan(&term.ID, &term.Term, &term.Reading, &term.Definition, &term.Category)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "term not found")
		return
	}
	if isUniqueViolation(err) {
		writeErr(w, http.StatusConflict, "term already exists")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to update term")
		return
	}
	writeJSON(w, http.StatusOK, term)
}

func (s *Server) adminDeleteGlossaryTerm(w http.ResponseWriter, id int) {
	result, err := s.db.Exec(`DELETE FROM glossary_terms WHERE id = $1`, id)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to delete term")
		return
	}
	count, err := result.RowsAffected()
	if err != nil || count == 0 {
		writeErr(w, http.StatusNotFound, "term not found")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func adminRouteID(w http.ResponseWriter, path string, prefix string) (int, bool) {
	idString := strings.TrimPrefix(path, prefix)
	if idString == "" || strings.Contains(idString, "/") {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return 0, false
	}
	id, err := strconv.Atoi(idString)
	if err != nil || id < 1 {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return 0, false
	}
	return id, true
}

func decodeJSON(w http.ResponseWriter, r *http.Request, target any) bool {
	if err := json.NewDecoder(r.Body).Decode(target); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request")
		return false
	}
	return true
}

func validCourseInput(input courseInput) bool {
	return strings.TrimSpace(input.Title) != "" && strings.TrimSpace(input.Description) != "" && (input.Level == "beginner" || input.Level == "intermediate" || input.Level == "advanced")
}

func validLessonInput(input lessonInput) bool {
	return input.CourseID > 0 && strings.TrimSpace(input.Title) != "" && strings.TrimSpace(input.Content) != "" && input.EstimatedMinutes > 0
}

func validGlossaryInput(input glossaryInput) bool {
	return strings.TrimSpace(input.Term) != "" && strings.TrimSpace(input.Definition) != ""
}

func isForeignKeyViolation(err error) bool {
	return err != nil && strings.Contains(err.Error(), "foreign key")
}
