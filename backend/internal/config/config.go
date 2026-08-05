package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

// Config はアプリケーション設定です。
type Config struct {
	Host           string
	APIPort        string
	AllowedOrigins string
	DatabaseURL    string
	JWTSecret      string
	UploadDir      string
	AdminEmail     string
	AdminPassword  string
}

func getEnv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}

// loadAirEnv は .air.toml と同じディレクトリにある .env を読み込みます。
// 既に設定されている環境変数は godotenv.Load の仕様により上書きしません。
func loadAirEnv() {
	workingDir, err := os.Getwd()
	if err != nil {
		return
	}

	for dir := workingDir; ; dir = filepath.Dir(dir) {
		airFile := filepath.Join(dir, ".air.toml")
		envFile := filepath.Join(dir, ".env")
		if _, airErr := os.Stat(airFile); airErr == nil {
			if _, envErr := os.Stat(envFile); envErr == nil {
				_ = godotenv.Load(envFile)
			}
			return
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			return
		}
	}
}

// Load は環境変数から設定を読み込みます。
func Load() Config {
	loadAirEnv()

	return Config{
		Host:           getEnv("HOST", "0.0.0.0"),
		APIPort:        getEnv("API_PORT", "8080"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      getEnv("JWT_SECRET", "development-secret"),
		UploadDir:      getEnv("UPLOAD_DIR", "./uploads"),
		AdminEmail:     getEnv("ADMIN_EMAIL", ""),
		AdminPassword:  getEnv("ADMIN_PASSWORD", ""),
	}
}

func (c Config) Addr() string {
	return fmt.Sprintf("%s:%s", c.Host, c.APIPort)
}
