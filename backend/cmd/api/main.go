package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ymmtyamaterous/taxpedia-api/internal/config"
	"github.com/ymmtyamaterous/taxpedia-api/internal/server"
)

func main() {
	cfg := config.Load()

	if err := os.MkdirAll(cfg.UploadDir, 0o755); err != nil {
		log.Fatalf("failed to create upload directory: %v", err)
	}

	srv := server.New(cfg.AllowedOrigins)

	log.Printf("Taxpedia API listening on %s", cfg.Addr())
	if err := http.ListenAndServe(cfg.Addr(), srv.Handler()); err != nil {
		log.Fatal(err)
	}
}
