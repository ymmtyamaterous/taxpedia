package server

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

var courses = []Course{
	{ID: 1, Title: "そもそも税金って何？", Description: "税金の基本を学ぶ", Level: "beginner"},
	{ID: 2, Title: "給与明細の読み方", Description: "控除や税額の見方を理解", Level: "beginner"},
	{ID: 3, Title: "ふるさと納税ってお得なの？", Description: "制度を正しく使う", Level: "beginner"},
	{ID: 4, Title: "確定申告の手順と書類", Description: "申告の流れを把握", Level: "intermediate"},
	{ID: 5, Title: "副業の税金・経費のポイント", Description: "副業時の税務知識", Level: "intermediate"},
	{ID: 6, Title: "iDeCo・NISAで賢く節税", Description: "資産形成と節税", Level: "advanced"},
}

var lessons = []Lesson{
	{ID: 1, CourseID: 1, Title: "税金の役割", Content: "税金は社会を支える仕組みです。", EstimatedMinute: 5},
	{ID: 2, CourseID: 2, Title: "給与明細の見方", Content: "支給額・控除額・手取りを確認しましょう。", EstimatedMinute: 8},
	{ID: 3, CourseID: 4, Title: "確定申告の準備", Content: "必要書類を先に揃えます。", EstimatedMinute: 10},
}

var quizQuestions = []QuizQuestion{
	{
		ID:          1,
		LessonID:    1,
		Question:    "所得税は何を基準に計算されますか？",
		Explanation: "課税所得に税率を適用して計算します。",
		AnswerID:    2,
		Choices: []QuizChoice{
			{ID: 1, Label: "A", Text: "総支給額"},
			{ID: 2, Label: "B", Text: "課税所得"},
			{ID: 3, Label: "C", Text: "手取り金額"},
			{ID: 4, Label: "D", Text: "会社が決める"},
		},
	},
}

func (s *Server) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) getCourses(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{"items": courses})
}

func (s *Server) getCourseByID(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/courses/")
	if idStr == "" || strings.Contains(idStr, "/") {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}

	for _, c := range courses {
		if c.ID == id {
			writeJSON(w, http.StatusOK, c)
			return
		}
	}
	writeErr(w, http.StatusNotFound, "course not found")
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
			writeJSON(w, http.StatusOK, map[string]any{"lessonId": lessonID, "status": "in_progress"})
			return
		case parts[1] == "complete" && r.Method == http.MethodPost:
			writeJSON(w, http.StatusOK, map[string]any{"lessonId": lessonID, "status": "completed"})
			return
		case parts[1] == "quiz" && r.Method == http.MethodGet:
			s.getLessonQuiz(w, lessonID)
			return
		}
	}

	writeErr(w, http.StatusNotFound, "not found")
}

func (s *Server) getLessonByID(w http.ResponseWriter, lessonID int) {
	for _, l := range lessons {
		if l.ID == lessonID {
			writeJSON(w, http.StatusOK, l)
			return
		}
	}
	writeErr(w, http.StatusNotFound, "lesson not found")
}

func (s *Server) getLessonQuiz(w http.ResponseWriter, lessonID int) {
	items := make([]QuizQuestion, 0)
	for _, q := range quizQuestions {
		if q.LessonID == lessonID {
			items = append(items, q)
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

	writeJSON(w, http.StatusCreated, map[string]any{
		"token": "dev-token",
		"user":  User{ID: 1, Email: req.Email, DisplayName: req.DisplayName},
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

	writeJSON(w, http.StatusOK, map[string]any{
		"token": "dev-token",
		"user":  User{ID: 1, Email: req.Email, DisplayName: "ゲストユーザー"},
	})
}

func (s *Server) me(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, User{ID: 1, Email: "demo@taxpedia.local", DisplayName: "デモユーザー"})
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

	for _, q := range quizQuestions {
		if q.ID == req.QuestionID {
			writeJSON(w, http.StatusOK, map[string]any{
				"correct":     req.SelectedChoiceID == q.AnswerID,
				"explanation": q.Explanation,
			})
			return
		}
	}

	writeErr(w, http.StatusNotFound, "question not found")
}

func (s *Server) userProgress(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]int{
		"completedCourses": 2,
		"streakDays":       7,
		"earnedBadges":     3,
	})
}

func (s *Server) userBadges(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"items": []Badge{
			{ID: 1, Name: "入門コース修了", Icon: "🌱"},
			{ID: 2, Name: "7日連続学習", Icon: "🔥"},
		},
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
