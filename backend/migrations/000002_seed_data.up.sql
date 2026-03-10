INSERT INTO courses (id, title, description, level, order_index)
VALUES
  (1, 'そもそも税金って何？', '税金の基本をゼロから理解', 'beginner', 1),
  (2, '給与明細の読み方', '控除・税額・手取りの見方', 'beginner', 2),
  (3, 'ふるさと納税ってお得なの？', '制度と注意点を学ぶ', 'beginner', 3),
  (4, '確定申告の手順と書類', '準備から提出までの流れ', 'intermediate', 4),
  (5, '副業の税金・経費のポイント', '副業で押さえる税務', 'intermediate', 5),
  (6, 'iDeCo・NISAで賢く節税', '制度活用で将来に備える', 'advanced', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (1, 1, '税金の役割を知ろう', '税金は、教育・医療・インフラなど社会を支えるための資金です。', 5, 1),
  (2, 2, '給与明細の基本項目', '支給・控除・差引支給額の見方を理解します。', 8, 1),
  (3, 4, '確定申告の準備', '必要書類を早めに準備することが重要です。', 10, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (1, 1, '所得税は何を基準に計算されますか？', '収入から各種控除を引いた課税所得に税率を適用して計算します。', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (1, 1, 'A', '総支給額', FALSE),
  (2, 1, 'B', '課税所得', TRUE),
  (3, 1, 'C', '手取り金額', FALSE),
  (4, 1, 'D', '会社が自由に決める', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO badges (id, course_id, name, icon)
VALUES
  (1, 1, '入門コース修了', '🌱'),
  (2, NULL, '7日連続学習', '🔥')
ON CONFLICT (id) DO NOTHING;
