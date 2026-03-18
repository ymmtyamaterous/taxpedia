-- 000005_fix_lesson1_quiz.up.sql
-- レッスン1（税金の役割を知ろう）のクイズをレッスン内容に合わせて修正

-- 既存のクイズ問題1（所得税の計算に関する問題）をレッスン内容に合わせて更新
UPDATE quiz_questions
SET question_text = '税金の主な役割として最も適切なものはどれですか？',
    explanation = '税金は道路・学校・病院など私たちの日常生活を支える社会インフラや公共サービスの財源です。「社会サービスへの会費」と考えると、税金の意義が理解しやすくなります。'
WHERE id = 1;

-- 既存の選択肢をレッスン内容に合わせて更新
UPDATE quiz_choices SET choice_text = '一部の富裕層に分配するため', is_correct = FALSE WHERE id = 1;
UPDATE quiz_choices SET choice_text = '道路・学校・医療など社会サービスを維持するため', is_correct = TRUE WHERE id = 2;
UPDATE quiz_choices SET choice_text = '大企業の経営を支援するため', is_correct = FALSE WHERE id = 3;
UPDATE quiz_choices SET choice_text = '政府の貯蓄として積み立てるため', is_correct = FALSE WHERE id = 4;

-- 新しいクイズ問題をレッスン1に追加（国税・地方税について）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (26, 1, '日本の税金のうち、都道府県や市区町村に納める税を何と言いますか？',
   '日本の税金は国に納める「国税」と都道府県・市区町村に納める「地方税」の2種類に分けられます。地方税は地域の道路整備・ゴミ収集・地元の学校運営などに使われます。',
   2)
ON CONFLICT (id) DO NOTHING;

-- 新しい問題の選択肢を追加
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (101, 26, 'A', '国税', FALSE),
  (102, 26, 'B', '直接税', FALSE),
  (103, 26, 'C', '地方税', TRUE),
  (104, 26, 'D', '消費税', FALSE)
ON CONFLICT (id) DO NOTHING;
