DELETE FROM user_badges WHERE badge_id IN (1, 2);
DELETE FROM badges WHERE id IN (1, 2);
DELETE FROM user_quiz_results WHERE question_id IN (1);
DELETE FROM quiz_choices WHERE id IN (1, 2, 3, 4);
DELETE FROM quiz_questions WHERE id IN (1);
DELETE FROM user_lesson_progress WHERE lesson_id IN (1, 2, 3);
DELETE FROM lessons WHERE id IN (1, 2, 3);
DELETE FROM courses WHERE id IN (1, 2, 3, 4, 5, 6);
