package server_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/ymmtyamaterous/taxpedia-api/internal/server"
)

// --- writeErr のテスト ---

func TestWriteErr_ContentType(t *testing.T) {
	w := httptest.NewRecorder()
	server.WriteErrExported(w, http.StatusBadRequest, "test error")

	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("Content-Type = %q, want application/json", ct)
	}
}

func TestWriteErr_StatusCode(t *testing.T) {
	w := httptest.NewRecorder()
	server.WriteErrExported(w, http.StatusInternalServerError, "internal")

	if w.Code != http.StatusInternalServerError {
		t.Errorf("status = %d, want %d", w.Code, http.StatusInternalServerError)
	}
}

func TestWriteErr_Body(t *testing.T) {
	w := httptest.NewRecorder()
	server.WriteErrExported(w, http.StatusBadRequest, "bad request")

	var resp map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse body: %v", err)
	}
	if resp["error"] != "bad request" {
		t.Errorf("error = %q, want %q", resp["error"], "bad request")
	}
}

// --- register ハンドラのテスト ---

func TestRegister_BadRequest(t *testing.T) {
	srv := server.NewTestServer(t)

	body := bytes.NewBufferString(`{"email":"","password":"","displayName":""}`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	srv.Handler().ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", w.Code, http.StatusBadRequest)
	}
}

func TestRegister_InvalidJSON(t *testing.T) {
	srv := server.NewTestServer(t)

	body := bytes.NewBufferString(`not json`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	srv.Handler().ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", w.Code, http.StatusBadRequest)
	}
	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Errorf("Content-Type = %q, want application/json", ct)
	}
}

func TestRegister_Success(t *testing.T) {
	srv := server.NewTestServer(t)

	body := bytes.NewBufferString(`{"email":"test@example.com","password":"password123","displayName":"Test User"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/register", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	srv.Handler().ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("status = %d, want %d", w.Code, http.StatusCreated)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse body: %v", err)
	}
	if _, ok := resp["token"]; !ok {
		t.Error("response missing token field")
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	srv := server.NewTestServer(t)

	body1 := bytes.NewBufferString(`{"email":"dup@example.com","password":"password123","displayName":"User1"}`)
	req1 := httptest.NewRequest(http.MethodPost, "/api/auth/register", body1)
	req1.Header.Set("Content-Type", "application/json")
	w1 := httptest.NewRecorder()
	srv.Handler().ServeHTTP(w1, req1)

	body2 := bytes.NewBufferString(`{"email":"dup@example.com","password":"password456","displayName":"User2"}`)
	req2 := httptest.NewRequest(http.MethodPost, "/api/auth/register", body2)
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()
	srv.Handler().ServeHTTP(w2, req2)

	if w2.Code != http.StatusConflict {
		t.Errorf("status = %d, want %d", w2.Code, http.StatusConflict)
	}
}

func TestAdminEndpoints_RequireAdministrator(t *testing.T) {
	srv := server.NewTestServer(t)

	registerBody := bytes.NewBufferString(`{"email":"member@example.com","password":"password123","displayName":"Member"}`)
	registerReq := httptest.NewRequest(http.MethodPost, "/api/auth/register", registerBody)
	registerW := httptest.NewRecorder()
	srv.Handler().ServeHTTP(registerW, registerReq)

	var memberResponse struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(registerW.Body.Bytes(), &memberResponse); err != nil {
		t.Fatalf("parse register response: %v", err)
	}

	memberReq := httptest.NewRequest(http.MethodGet, "/api/admin/courses", nil)
	memberReq.Header.Set("Authorization", "Bearer "+memberResponse.Token)
	memberW := httptest.NewRecorder()
	srv.Handler().ServeHTTP(memberW, memberReq)
	if memberW.Code != http.StatusForbidden {
		t.Errorf("member status = %d, want %d", memberW.Code, http.StatusForbidden)
	}

	if err := srv.EnsureAdmin("admin@example.com", "admin-password"); err != nil {
		t.Fatalf("EnsureAdmin: %v", err)
	}
	loginReq := httptest.NewRequest(http.MethodPost, "/api/auth/login", bytes.NewBufferString(`{"email":"admin@example.com","password":"admin-password"}`))
	loginW := httptest.NewRecorder()
	srv.Handler().ServeHTTP(loginW, loginReq)
	if loginW.Code != http.StatusOK {
		t.Fatalf("admin login status = %d, want %d", loginW.Code, http.StatusOK)
	}
	var adminResponse struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(loginW.Body.Bytes(), &adminResponse); err != nil {
		t.Fatalf("parse login response: %v", err)
	}

	adminReq := httptest.NewRequest(http.MethodGet, "/api/admin/courses", nil)
	adminReq.Header.Set("Authorization", "Bearer "+adminResponse.Token)
	adminW := httptest.NewRecorder()
	srv.Handler().ServeHTTP(adminW, adminReq)
	if adminW.Code != http.StatusOK {
		t.Errorf("admin status = %d, want %d", adminW.Code, http.StatusOK)
	}
}
