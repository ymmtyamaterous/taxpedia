-- 000003_add_content.down.sql
DELETE FROM quiz_choices WHERE id BETWEEN 5 AND 100;
DELETE FROM quiz_questions WHERE id BETWEEN 2 AND 25;
DELETE FROM lessons WHERE id BETWEEN 4 AND 15;
