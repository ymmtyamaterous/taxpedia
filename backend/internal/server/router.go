package server

import (
	"database/sql"
	"log"
	"net/http"
	"strings"
)

type Server struct {
	mux     *http.ServeMux
	handler http.Handler
	db      *sql.DB
	jwtKey  []byte
}

func New(allowedOrigins string, db *sql.DB, jwtSecret string) *Server {
	s := &Server{mux: http.NewServeMux(), db: db, jwtKey: []byte(jwtSecret)}
	s.routes()
	s.handler = withCORS(s.mux, allowedOrigins)
	return s
}

func (s *Server) Handler() http.Handler {
	return s.handler
}

func (s *Server) routes() {
	s.mux.HandleFunc("GET /api/health", s.health)

	s.mux.HandleFunc("GET /api/courses", s.getCourses)
	s.mux.HandleFunc("/api/courses/", s.courseRoute)
	s.mux.HandleFunc("/api/lessons/", s.lessonRoute)

	s.mux.HandleFunc("POST /api/auth/register", s.register)
	s.mux.HandleFunc("POST /api/auth/login", s.login)
	s.mux.HandleFunc("GET /api/auth/me", s.me)

	s.mux.HandleFunc("POST /api/quiz/submit", s.submitQuiz)
	s.mux.HandleFunc("GET /api/users/me/progress", s.userProgress)
	s.mux.HandleFunc("GET /api/users/me/badges", s.userBadges)
	s.mux.HandleFunc("GET /api/users/me/lesson-progress", s.userLessonProgress)
	s.mux.HandleFunc("GET /api/glossary", s.getGlossaryTerms)
	s.mux.HandleFunc("/api/glossary/", s.glossaryRoute)
	s.mux.HandleFunc("/api/admin/courses", s.adminCoursesRoute)
	s.mux.HandleFunc("/api/admin/courses/", s.adminCourseRoute)
	s.mux.HandleFunc("/api/admin/lessons", s.adminLessonsRoute)
	s.mux.HandleFunc("/api/admin/lessons/", s.adminLessonRoute)
	s.mux.HandleFunc("/api/admin/glossary", s.adminGlossaryRoute)
	s.mux.HandleFunc("/api/admin/glossary/", s.adminGlossaryTermRoute)
}

func withCORS(next http.Handler, allowedOrigins string) http.Handler {
	allowed := strings.Split(allowedOrigins, ",")
	allowedMap := make(map[string]struct{}, len(allowed))
	for _, v := range allowed {
		trimmed := strings.TrimSpace(v)
		if trimmed != "" {
			allowedMap[trimmed] = struct{}{}
		}
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if _, ok := allowedMap[origin]; ok {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err := w.Write([]byte(`{"error":"` + msg + `"}`))
	if err != nil {
		log.Printf("writeErr: %v", err)
	}
}
