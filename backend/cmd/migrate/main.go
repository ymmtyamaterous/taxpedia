package main

import (
	"database/sql"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	_ "github.com/lib/pq"
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
		if err := runMigration(db, ".up.sql", false); err != nil {
			log.Fatal(err)
		}
	case "down":
		if err := runMigration(db, ".down.sql", true); err != nil {
			log.Fatal(err)
		}
	default:
		log.Fatalf("unknown direction: %s", direction)
	}

	log.Printf("migration %s completed", direction)
}

func runMigration(db *sql.DB, suffix string, reverse bool) error {
	var files []string
	walkErr := filepath.WalkDir("./migrations", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		if strings.HasSuffix(path, suffix) {
			files = append(files, path)
		}
		return nil
	})
	if walkErr != nil {
		return walkErr
	}

	sort.Strings(files)
	if reverse {
		for i, j := 0, len(files)-1; i < j; i, j = i+1, j-1 {
			files[i], files[j] = files[j], files[i]
		}
	}

	for _, file := range files {
		sqlBytes, err := os.ReadFile(file)
		if err != nil {
			return err
		}

		stmt := strings.TrimSpace(string(sqlBytes))
		if stmt == "" {
			continue
		}

		if _, err := db.Exec(stmt); err != nil {
			return fmt.Errorf("failed %s: %w", file, err)
		}
		log.Printf("applied: %s", file)
	}

	return nil
}
