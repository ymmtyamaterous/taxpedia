package server

import (
	"database/sql"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type authClaims struct {
	UserID int64  `json:"userId"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// EnsureAdmin creates an administrator account when the configured email does not exist.
// Existing accounts are promoted to administrator without changing their password.
func (s *Server) EnsureAdmin(email string, password string) error {
	var existingID int64
	err := s.db.QueryRow(`SELECT id FROM users WHERE email = $1`, email).Scan(&existingID)
	if err == nil {
		_, err = s.db.Exec(`UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = $1`, existingID)
		return err
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = s.db.Exec(
		`INSERT INTO users (email, password_hash, display_name, role) VALUES ($1, $2, $3, 'admin')`,
		email,
		string(hashed),
		"管理者",
	)
	return err
}

func (s *Server) issueToken(userID int64, email string, role string) (string, error) {
	claims := authClaims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtKey)
}

func (s *Server) requireAdmin(r *http.Request) (*authClaims, error) {
	claims, err := s.parseAuth(r)
	if err != nil {
		return nil, err
	}
	if claims.Role != "admin" {
		return nil, errors.New("admin permission required")
	}
	return claims, nil
}

func (s *Server) parseAuth(r *http.Request) (*authClaims, error) {
	auth := r.Header.Get("Authorization")
	if auth == "" {
		return nil, errors.New("missing authorization")
	}
	const prefix = "Bearer "
	if !strings.HasPrefix(auth, prefix) {
		return nil, errors.New("invalid authorization header")
	}
	raw := strings.TrimPrefix(auth, prefix)

	claims := &authClaims{}
	token, err := jwt.ParseWithClaims(raw, claims, func(t *jwt.Token) (any, error) {
		return s.jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
