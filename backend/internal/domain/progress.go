//go:build ignore

package domain

import "time"

// CalculateStreakDays は最終学習日と現在日から連続学習日数を返します。
func CalculateStreakDays(lastLearnedAt time.Time, now time.Time, currentStreak int) int {
	if currentStreak < 0 {
		return 0
	}

	last := truncateDate(lastLearnedAt)
	today := truncateDate(now)
	diff := int(today.Sub(last).Hours() / 24)

	switch diff {
	case 0:
		return currentStreak
	case 1:
		return currentStreak + 1
	default:
		return 1
	}
}

func truncateDate(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}
package domain




























}	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())	y, m, d := t.Date()func truncateDate(t time.Time) time.Time {}	}		return 1	default:		return currentStreak + 1	case 1:		return currentStreak	case 0:	switch diff {	diff := int(today.Sub(last).Hours() / 24)	today := truncateDate(now)	last := truncateDate(lastLearnedAt)	}		return 0	if currentStreak < 0 {func CalculateStreakDays(lastLearnedAt time.Time, now time.Time, currentStreak int) int {// CalculateStreakDays は最終学習日と現在日から連続学習日数を返します。import "time"package domain