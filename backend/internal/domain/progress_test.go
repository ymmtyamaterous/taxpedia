package domain

import (
	"testing"
	"time"
)

func TestCalculateStreakDays(t *testing.T) {
	base := time.Date(2026, 3, 10, 12, 0, 0, 0, time.UTC)

	tests := []struct {
		name          string
		lastLearnedAt time.Time
		now           time.Time
		currentStreak int
		want          int
	}{
		{
			name:          "同日学習は据え置き",
			lastLearnedAt: base,
			now:           base.Add(2 * time.Hour),
			currentStreak: 3,
			want:          3,
		},
		{
			name:          "翌日学習は+1",
			lastLearnedAt: base,
			now:           base.Add(24 * time.Hour),
			currentStreak: 3,
			want:          4,
		},
		{
			name:          "日が空いたら1にリセット",
			lastLearnedAt: base,
			now:           base.Add(72 * time.Hour),
			currentStreak: 6,
			want:          1,
		},
		{
			name:          "不正なストリーク値は0",
			lastLearnedAt: base,
			now:           base,
			currentStreak: -1,
			want:          0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := CalculateStreakDays(tt.lastLearnedAt, tt.now, tt.currentStreak)
			if got != tt.want {
				t.Fatalf("got %d, want %d", got, tt.want)
			}
		})
	}
}
