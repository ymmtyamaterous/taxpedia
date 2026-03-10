package server

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type authClaims struct {
	UserID int64  `json:"userId"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func (s *Server) issueToken(userID int64, email string) (string, error) {
	claims := authClaims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtKey)
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
