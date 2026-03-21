package server

import (
	"database/sql"
	"net/http"
	"os"
	"testing"

	_ "github.com/lib/pq"
	"github.com/ymmtyamaterous/taxpedia-api/internal/migrate"
)

// WriteErrExported はテスト用に writeErr をエクスポートします。
func WriteErrExported(w http.ResponseWriter, status int, msg string) {
	writeErr(w, status, msg)
}

// NewTestServer はテスト用のサーバーを返します。
// 環境変数 DATABASE_URL を使用して PostgreSQL に接続します。
func NewTestServer(t *testing.T) *Server {
	t.Helper()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		t.Skip("DATABASE_URL is not set, skipping integration test")
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}
	if err := db.Ping(); err != nil {
		db.Close()
		t.Fatalf("failed to ping db: %v", err)
	}

	if err := migrate.RunUp(db, "../../migrations"); err != nil {
		db.Close()
		t.Fatalf("migrate: %v", err)
	}

	// テスト前後にユーザーデータをクリーンアップする
	_, _ = db.Exec(`DELETE FROM users WHERE email LIKE '%@example.com'`)
	t.Cleanup(func() {
		_, _ = db.Exec(`DELETE FROM users WHERE email LIKE '%@example.com'`)
		db.Close()
	})

	srv := New("http://localhost:3000", db, "test-secret")
	return srv
}
