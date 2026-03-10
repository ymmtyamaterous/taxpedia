package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"github.com/ymmtyamaterous/taxpedia-api/internal/config"
	"github.com/ymmtyamaterous/taxpedia-api/internal/server"
)

func main() {
	cfg := config.Load()

	if err := os.MkdirAll(cfg.UploadDir, 0o755); err != nil {
		log.Fatalf("failed to create upload directory: %v", err)
	}
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	srv := server.New(cfg.AllowedOrigins, db, cfg.JWTSecret)

	log.Printf("Taxpedia API listening on %s", cfg.Addr())
	if err := http.ListenAndServe(cfg.Addr(), srv.Handler()); err != nil {
		log.Fatal(err)
	}
}
