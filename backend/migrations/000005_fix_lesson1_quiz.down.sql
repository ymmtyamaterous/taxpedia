-- 000005_fix_lesson1_quiz.down.sql
-- ロールバック: レッスン1のクイズを元の内容に戻す

-- クイズ問題1を元の内容に戻す
UPDATE quiz_questions
SET question_text = '所得税は何を基準に計算されますか？',
    explanation = '収入から各種控除を引いた課税所得に税率を適用して計算します。'
WHERE id = 1;

-- 選択肢を元の内容に戻す
UPDATE quiz_choices SET choice_text = '総支給額', is_correct = FALSE WHERE id = 1;
UPDATE quiz_choices SET choice_text = '課税所得', is_correct = TRUE WHERE id = 2;
UPDATE quiz_choices SET choice_text = '手取り金額', is_correct = FALSE WHERE id = 3;
UPDATE quiz_choices SET choice_text = '会社が自由に決める', is_correct = FALSE WHERE id = 4;

-- 追加した問題と選択肢を削除
DELETE FROM quiz_choices WHERE id IN (101, 102, 103, 104);
DELETE FROM quiz_questions WHERE id = 26;
