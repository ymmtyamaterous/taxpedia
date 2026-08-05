package server

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) getCourses(w http.ResponseWriter, _ *http.Request) {
	rows, err := s.db.Query(`SELECT id, title, description, level, order_index FROM courses ORDER BY order_index, id`)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load courses")
		return
	}
	defer rows.Close()

	items := make([]Course, 0)
	for rows.Next() {
		var c Course
		if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.Level, &c.OrderIndex); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan courses")
			return
		}
		items = append(items, c)
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) courseRoute(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/courses/")
	if idStr == "" {
		writeErr(w, http.StatusBadRequest, "invalid course id")
		return
	}
	parts := strings.Split(idStr, "/")
	if len(parts) == 0 || parts[0] == "" {
		writeErr(w, http.StatusBadRequest, "invalid course id")
		return
	}

	id, err := strconv.Atoi(parts[0])
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}

	if len(parts) == 1 && r.Method == http.MethodGet {
		s.getCourseByID(w, id)
		return
	}

	if len(parts) == 2 && parts[1] == "lessons" && r.Method == http.MethodGet {
		s.getCourseLessons(w, id)
		return
	}

	writeErr(w, http.StatusNotFound, "not found")
}

func (s *Server) getCourseByID(w http.ResponseWriter, courseID int) {
	var c Course
	err := s.db.QueryRow(`SELECT id, title, description, level, order_index FROM courses WHERE id = $1`, courseID).Scan(
		&c.ID,
		&c.Title,
		&c.Description,
		&c.Level,
		&c.OrderIndex,
	)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "course not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load course")
		return
	}
	writeJSON(w, http.StatusOK, c)
}

func (s *Server) getCourseLessons(w http.ResponseWriter, courseID int) {
	rows, err := s.db.Query(
		`SELECT id, course_id, title, content, estimated_minutes, order_index FROM lessons WHERE course_id = $1 ORDER BY order_index, id`,
		courseID,
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load lessons")
		return
	}
	defer rows.Close()

	items := make([]Lesson, 0)
	for rows.Next() {
		var l Lesson
		if err := rows.Scan(&l.ID, &l.CourseID, &l.Title, &l.Content, &l.EstimatedMinute, &l.OrderIndex); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan lessons")
			return
		}
		items = append(items, l)
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) lessonRoute(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/lessons/")
	parts := strings.Split(path, "/")
	if len(parts) == 0 || parts[0] == "" {
		writeErr(w, http.StatusBadRequest, "invalid path")
		return
	}

	lessonID, err := strconv.Atoi(parts[0])
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid lesson id")
		return
	}

	if len(parts) == 1 && r.Method == http.MethodGet {
		s.getLessonByID(w, lessonID)
		return
	}

	if len(parts) == 2 {
		switch {
		case parts[1] == "start" && r.Method == http.MethodPost:
			claims, err := s.parseAuth(r)
			if err != nil {
				writeErr(w, http.StatusUnauthorized, "unauthorized")
				return
			}

			if err := s.upsertLessonProgress(claims.UserID, int64(lessonID), "in_progress", nil); err != nil {
				writeErr(w, http.StatusInternalServerError, "failed to save progress")
				return
			}

			writeJSON(w, http.StatusOK, map[string]any{"lessonId": lessonID, "status": "in_progress"})
			return
		case parts[1] == "complete" && r.Method == http.MethodPost:
			claims, err := s.parseAuth(r)
			if err != nil {
				writeErr(w, http.StatusUnauthorized, "unauthorized")
				return
			}

			now := time.Now()
			if err := s.upsertLessonProgress(claims.UserID, int64(lessonID), "completed", &now); err != nil {
				writeErr(w, http.StatusInternalServerError, "failed to save progress")
				return
			}

			writeJSON(w, http.StatusOK, map[string]any{"lessonId": lessonID, "status": "completed"})
			return
		case parts[1] == "quiz" && r.Method == http.MethodGet:
			s.getLessonQuiz(w, lessonID)
			return
		case parts[1] == "memo" && r.Method == http.MethodGet:
			s.getLessonMemo(w, r, lessonID)
			return
		case parts[1] == "memo" && r.Method == http.MethodPut:
			s.saveLessonMemo(w, r, lessonID)
			return
		}
	}

	writeErr(w, http.StatusNotFound, "not found")
}

func (s *Server) getLessonByID(w http.ResponseWriter, lessonID int) {
	var l Lesson
	err := s.db.QueryRow(
		`SELECT id, course_id, title, content, estimated_minutes, order_index FROM lessons WHERE id = $1`,
		lessonID,
	).Scan(&l.ID, &l.CourseID, &l.Title, &l.Content, &l.EstimatedMinute, &l.OrderIndex)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "lesson not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load lesson")
		return
	}

	writeJSON(w, http.StatusOK, l)
}

func (s *Server) getLessonQuiz(w http.ResponseWriter, lessonID int) {
	qRows, err := s.db.Query(
		`SELECT id, lesson_id, question_text, explanation FROM quiz_questions WHERE lesson_id = $1 ORDER BY order_index, id`,
		lessonID,
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load quiz")
		return
	}
	defer qRows.Close()

	items := make([]QuizQuestion, 0)
	questionIDs := make([]int, 0)
	questionIndexMap := make(map[int]int) // questionID → index in items
	for qRows.Next() {
		q := QuizQuestion{Choices: make([]QuizChoice, 0)}
		if err := qRows.Scan(&q.ID, &q.LessonID, &q.Question, &q.Explanation); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan quiz")
			return
		}
		questionIndexMap[q.ID] = len(items)
		items = append(items, q)
		questionIDs = append(questionIDs, q.ID)
	}

	if len(questionIDs) > 0 {
		cRows, err := s.db.Query(
			`SELECT id, question_id, choice_label, choice_text FROM quiz_choices WHERE question_id = ANY($1) ORDER BY id`,
			pq.Array(questionIDs),
		)
		if err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to load choices")
			return
		}
		defer cRows.Close()

		for cRows.Next() {
			var choice QuizChoice
			var qID int
			if err := cRows.Scan(&choice.ID, &qID, &choice.Label, &choice.Text); err != nil {
				writeErr(w, http.StatusInternalServerError, "failed to scan choices")
				return
			}
			if idx, ok := questionIndexMap[qID]; ok {
				items[idx].Choices = append(items[idx].Choices, choice)
			}
		}
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		DisplayName string `json:"displayName"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request")
		return
	}
	if req.Email == "" || req.Password == "" || req.DisplayName == "" {
		writeErr(w, http.StatusBadRequest, "email, password, displayName are required")
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to hash password")
		return
	}

	var user User
	err = s.db.QueryRow(
		`INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, role`,
		req.Email,
		string(hashed),
		req.DisplayName,
	).Scan(&user.ID, &user.Email, &user.DisplayName, &user.Role)
	if err != nil {
		if isUniqueViolation(err) {
			writeErr(w, http.StatusConflict, "email already exists")
			return
		}
		log.Printf("register: db error: %v", err)
		writeErr(w, http.StatusInternalServerError, "failed to create user")
		return
	}

	token, err := s.issueToken(int64(user.ID), user.Email, user.Role)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to issue token")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"token": token,
		"user":  user,
	})
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request")
		return
	}

	var user User
	var passwordHash string
	err := s.db.QueryRow(
		`SELECT id, email, display_name, role, password_hash FROM users WHERE email = $1`,
		req.Email,
	).Scan(&user.ID, &user.Email, &user.DisplayName, &user.Role, &passwordHash)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusUnauthorized, "invalid credentials")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load user")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	token, err := s.issueToken(int64(user.ID), user.Email, user.Role)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to issue token")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"token": token,
		"user":  user,
	})
}

func (s *Server) me(w http.ResponseWriter, r *http.Request) {
	claims, err := s.parseAuth(r)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var user User
	err = s.db.QueryRow(`SELECT id, email, display_name, role FROM users WHERE id = $1`, claims.UserID).Scan(
		&user.ID,
		&user.Email,
		&user.DisplayName,
		&user.Role,
	)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusUnauthorized, "user not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load user")
		return
	}

	writeJSON(w, http.StatusOK, user)
}

func (s *Server) submitQuiz(w http.ResponseWriter, r *http.Request) {
	var req struct {
		QuestionID       int `json:"questionId"`
		SelectedChoiceID int `json:"selectedChoiceId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request")
		return
	}
	if req.QuestionID == 0 || req.SelectedChoiceID == 0 {
		writeErr(w, http.StatusBadRequest, "questionId and selectedChoiceId are required")
		return
	}

	var correctChoiceID int
	var explanation string
	err := s.db.QueryRow(
		`SELECT qq.explanation, qc.id
FROM quiz_questions qq
JOIN quiz_choices qc ON qc.question_id = qq.id AND qc.is_correct = TRUE
WHERE qq.id = $1`,
		req.QuestionID,
	).Scan(&explanation, &correctChoiceID)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "question not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to submit quiz")
		return
	}

	isCorrect := req.SelectedChoiceID == correctChoiceID

	if claims, err := s.parseAuth(r); err == nil {
		_, _ = s.db.Exec(
			`INSERT INTO user_quiz_results (user_id, question_id, selected_choice_id, is_correct) VALUES ($1, $2, $3, $4)`,
			claims.UserID,
			req.QuestionID,
			req.SelectedChoiceID,
			isCorrect,
		)
	}

	writeJSON(w, http.StatusOK, map[string]any{"correct": isCorrect, "explanation": explanation})
}

func (s *Server) userProgress(w http.ResponseWriter, r *http.Request) {
	claims, err := s.parseAuth(r)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var completedCourses int
	err = s.db.QueryRow(
		`SELECT COUNT(DISTINCT l.course_id)
FROM user_lesson_progress ulp
JOIN lessons l ON l.id = ulp.lesson_id
WHERE ulp.user_id = $1 AND ulp.status = 'completed'`,
		claims.UserID,
	).Scan(&completedCourses)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load progress")
		return
	}

	var earnedBadges int
	err = s.db.QueryRow(`SELECT COUNT(*) FROM user_badges WHERE user_id = $1`, claims.UserID).Scan(&earnedBadges)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load badges")
		return
	}

	streakDays, err := s.calculateStreakDays(claims.UserID)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to calculate streak")
		return
	}

	writeJSON(w, http.StatusOK, map[string]int{
		"completedCourses": completedCourses,
		"streakDays":       streakDays,
		"earnedBadges":     earnedBadges,
	})
}

func (s *Server) userBadges(w http.ResponseWriter, r *http.Request) {
	claims, err := s.parseAuth(r)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	rows, err := s.db.Query(
		`SELECT b.id, b.name, b.icon
FROM user_badges ub
JOIN badges b ON b.id = ub.badge_id
WHERE ub.user_id = $1
ORDER BY ub.earned_at DESC`,
		claims.UserID,
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load badges")
		return
	}
	defer rows.Close()

	items := make([]Badge, 0)
	for rows.Next() {
		var b Badge
		if err := rows.Scan(&b.ID, &b.Name, &b.Icon); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan badges")
			return
		}
		items = append(items, b)
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) userLessonProgress(w http.ResponseWriter, r *http.Request) {
	claims, err := s.parseAuth(r)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	rows, err := s.db.Query(
		`SELECT lesson_id, status FROM user_lesson_progress WHERE user_id = $1`,
		claims.UserID,
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load lesson progress")
		return
	}
	defer rows.Close()

	items := make([]LessonProgressItem, 0)
	for rows.Next() {
		var item LessonProgressItem
		if err := rows.Scan(&item.LessonID, &item.Status); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan lesson progress")
			return
		}
		items = append(items, item)
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) getLessonMemo(w http.ResponseWriter, r *http.Request, lessonID int) {
	claims, err := s.parseAuth(r)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var content string
	err = s.db.QueryRow(
		`SELECT content FROM user_lesson_memos WHERE user_id = $1 AND lesson_id = $2`,
		claims.UserID,
		lessonID,
	).Scan(&content)
	if errors.Is(err, sql.ErrNoRows) {
		writeJSON(w, http.StatusOK, LessonMemo{LessonID: lessonID, Content: ""})
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load memo")
		return
	}

	writeJSON(w, http.StatusOK, LessonMemo{LessonID: lessonID, Content: content})
}

func (s *Server) saveLessonMemo(w http.ResponseWriter, r *http.Request, lessonID int) {
	claims, err := s.parseAuth(r)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid request")
		return
	}

	_, err = s.db.Exec(
		`INSERT INTO user_lesson_memos (user_id, lesson_id, content, updated_at)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (user_id, lesson_id)
DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
		claims.UserID,
		lessonID,
		req.Content,
	)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to save memo")
		return
	}

	writeJSON(w, http.StatusOK, LessonMemo{LessonID: lessonID, Content: req.Content})
}

func (s *Server) getGlossaryTerms(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")

	var rows interface {
		Next() bool
		Scan(...any) error
		Close() error
	}
	var err error

	if q != "" {
		rows, err = s.db.Query(
			`SELECT id, term, reading, definition, category FROM glossary_terms
WHERE term ILIKE $1 OR reading ILIKE $1 OR definition ILIKE $1
ORDER BY reading, term`,
			"%"+q+"%",
		)
	} else {
		rows, err = s.db.Query(
			`SELECT id, term, reading, definition, category FROM glossary_terms ORDER BY reading, term`,
		)
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load glossary")
		return
	}
	defer rows.Close()

	items := make([]GlossaryTerm, 0)
	for rows.Next() {
		var t GlossaryTerm
		if err := rows.Scan(&t.ID, &t.Term, &t.Reading, &t.Definition, &t.Category); err != nil {
			writeErr(w, http.StatusInternalServerError, "failed to scan glossary")
			return
		}
		items = append(items, t)
	}

	writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (s *Server) glossaryRoute(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/glossary/")
	if idStr == "" {
		writeErr(w, http.StatusBadRequest, "invalid glossary id")
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}

	if r.Method != http.MethodGet {
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var t GlossaryTerm
	err = s.db.QueryRow(
		`SELECT id, term, reading, definition, category FROM glossary_terms WHERE id = $1`,
		id,
	).Scan(&t.ID, &t.Term, &t.Reading, &t.Definition, &t.Category)
	if errors.Is(err, sql.ErrNoRows) {
		writeErr(w, http.StatusNotFound, "term not found")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "failed to load term")
		return
	}

	writeJSON(w, http.StatusOK, t)
}

func isUniqueViolation(err error) bool {
	pqErr, ok := err.(*pq.Error)
	if !ok {
		return false
	}
	return pqErr.Code == "23505"
}

func (s *Server) upsertLessonProgress(userID int64, lessonID int64, status string, completedAt *time.Time) error {
	_, err := s.db.Exec(
		`INSERT INTO user_lesson_progress (user_id, lesson_id, status, completed_at, updated_at)
VALUES ($1, $2, $3, $4, NOW())
ON CONFLICT (user_id, lesson_id)
DO UPDATE SET
  status = EXCLUDED.status,
  completed_at = EXCLUDED.completed_at,
  updated_at = NOW()`,
		userID,
		lessonID,
		status,
		completedAt,
	)
	return err
}

func (s *Server) calculateStreakDays(userID int64) (int, error) {
	rows, err := s.db.Query(
		`SELECT day FROM (
  SELECT DATE(updated_at) AS day FROM user_lesson_progress WHERE user_id = $1
  UNION
  SELECT DATE(answered_at) AS day FROM user_quiz_results WHERE user_id = $1
) days ORDER BY day DESC`,
		userID,
	)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	days := make([]time.Time, 0)
	for rows.Next() {
		var day time.Time
		if err := rows.Scan(&day); err != nil {
			return 0, err
		}
		days = append(days, day)
	}

	if len(days) == 0 {
		return 0, nil
	}

	today := truncateToDate(time.Now())
	first := truncateToDate(days[0])
	if first.Before(today.AddDate(0, 0, -1)) {
		return 0, nil
	}

	streak := 1
	prev := first
	for i := 1; i < len(days); i++ {
		curr := truncateToDate(days[i])
		diff := int(prev.Sub(curr).Hours() / 24)
		if diff == 1 {
			streak++
			prev = curr
			continue
		}
		if diff == 0 {
			continue
		}
		break
	}

	return streak, nil
}

func truncateToDate(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
