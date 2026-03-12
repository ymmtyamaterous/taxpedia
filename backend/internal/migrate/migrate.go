package migrate

import (
	"database/sql"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// RunUp は指定ディレクトリの *.up.sql を昇順に適用します。
// 各ファイルは冪等（IF NOT EXISTS / ON CONFLICT DO NOTHING）であることを前提とします。
func RunUp(db *sql.DB, migrationsDir string) error {
	files, err := collectFiles(migrationsDir, ".up.sql", false)
	if err != nil {
		return fmt.Errorf("migrate: collect files: %w", err)
	}

	for _, file := range files {
		if err := execFile(db, file); err != nil {
			return fmt.Errorf("migrate: exec %s: %w", file, err)
		}
		log.Printf("migrate: applied %s", filepath.Base(file))
	}
	return nil
}

// RunDown は指定ディレクトリの *.down.sql を降順に適用します。
func RunDown(db *sql.DB, migrationsDir string) error {
	files, err := collectFiles(migrationsDir, ".down.sql", true)
	if err != nil {
		return fmt.Errorf("migrate: collect files: %w", err)
	}

	for _, file := range files {
		if err := execFile(db, file); err != nil {
			return fmt.Errorf("migrate: exec %s: %w", file, err)
		}
		log.Printf("migrate: rolled back %s", filepath.Base(file))
	}
	return nil
}

func collectFiles(dir string, suffix string, reverse bool) ([]string, error) {
	var files []string
	err := filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
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
	if err != nil {
		return nil, err
	}

	sort.Strings(files)
	if reverse {
		for i, j := 0, len(files)-1; i < j; i, j = i+1, j-1 {
			files[i], files[j] = files[j], files[i]
		}
	}
	return files, nil
}

func execFile(db *sql.DB, path string) error {
	sqlBytes, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	_, err = db.Exec(string(sqlBytes))
	return err
}
