package main

import (
	"database/sql"
	"flag"
	"log"
	"os"

	_ "github.com/lib/pq"
	"github.com/ymmtyamaterous/taxpedia-api/internal/migrate"
)

func main() {
	flag.Parse()
	if flag.NArg() < 1 {
		log.Fatal("usage: go run ./cmd/migrate [up|down]")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	direction := flag.Arg(0)
	switch direction {
	case "up":
		if err := migrate.RunUp(db, "./migrations"); err != nil {
			log.Fatal(err)
		}
	case "down":
		if err := migrate.RunDown(db, "./migrations"); err != nil {
			log.Fatal(err)
		}
	default:
		log.Fatalf("unknown direction: %s", direction)
	}

	log.Printf("migration %s completed", direction)
}
