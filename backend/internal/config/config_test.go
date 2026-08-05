package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadReadsEnvNextToAirToml(t *testing.T) {
	originalValues := make(map[string]string)
	for _, key := range []string{"HOST", "API_PORT", "DATABASE_URL"} {
		value, exists := os.LookupEnv(key)
		if exists {
			originalValues[key] = value
		}
		if err := os.Unsetenv(key); err != nil {
			t.Fatal(err)
		}
	}
	t.Cleanup(func() {
		for _, key := range []string{"HOST", "API_PORT", "DATABASE_URL"} {
			if value, exists := originalValues[key]; exists {
				_ = os.Setenv(key, value)
			} else {
				_ = os.Unsetenv(key)
			}
		}
	})

	tempDir := t.TempDir()
	if err := os.WriteFile(filepath.Join(tempDir, ".air.toml"), []byte("root = \".\"\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(tempDir, ".env"), []byte("HOST=127.0.0.1\nAPI_PORT=9090\nDATABASE_URL=postgres://from-dotenv\n"), 0o600); err != nil {
		t.Fatal(err)
	}

	originalDir, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir(tempDir); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.Chdir(originalDir) })

	cfg := Load()
	if cfg.Host != "127.0.0.1" || cfg.APIPort != "9090" || cfg.DatabaseURL != "postgres://from-dotenv" {
		t.Fatalf("Load() = %+v, want values from .env", cfg)
	}
}
