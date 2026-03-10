package server

type Course struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Level       string `json:"level"`
}

type Lesson struct {
	ID              int    `json:"id"`
	CourseID        int    `json:"courseId"`
	Title           string `json:"title"`
	Content         string `json:"content"`
	EstimatedMinute int    `json:"estimatedMinutes"`
}

type QuizChoice struct {
	ID    int    `json:"id"`
	Label string `json:"label"`
	Text  string `json:"text"`
}

type QuizQuestion struct {
	ID          int          `json:"id"`
	LessonID    int          `json:"lessonId"`
	Question    string       `json:"question"`
	Explanation string       `json:"explanation"`
	Choices     []QuizChoice `json:"choices"`
	AnswerID    int          `json:"-"`
}

type Badge struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Icon string `json:"icon"`
}

type User struct {
	ID          int    `json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"displayName"`
}
