package config

import (
	"fmt"
	"os"
)

// Config はアプリケーション設定です。
type Config struct {
	Host           string
	APIPort        string
	AllowedOrigins string
	DatabaseURL    string
	JWTSecret      string
	UploadDir      string
}

func getEnv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}

// Load は環境変数から設定を読み込みます。
func Load() Config {
	return Config{
		Host:           getEnv("HOST", "0.0.0.0"),
		APIPort:        getEnv("API_PORT", "8080"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      getEnv("JWT_SECRET", "development-secret"),
		UploadDir:      getEnv("UPLOAD_DIR", "./uploads"),
	}
}

func (c Config) Addr() string {
	return fmt.Sprintf("%s:%s", c.Host, c.APIPort)
}
