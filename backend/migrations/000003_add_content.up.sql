-- 000003_add_content.up.sql
-- コース1: そもそも税金って何？ 追加レッスン
INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (4, 1, '税金の種類を学ぼう',
   '税金には国に納める「国税」と地方自治体に納める「地方税」があります。代表的な国税は所得税・法人税・消費税などで、地方税には住民税・固定資産税などがあります。',
   5, 2),
  (5, 1, '直接税と間接税の違い',
   '直接税は税を負担する人が直接国・自治体に納める税（所得税・住民税など）です。間接税は消費税のように、税を負担する消費者とは別の事業者が代わりに納める税です。',
   5, 3)
ON CONFLICT (id) DO NOTHING;

-- コース2: 給与明細の読み方 追加レッスン
INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (6, 2, '社会保険料の内訳',
   '給与から引かれる社会保険料は「健康保険」「介護保険（40歳以上）」「厚生年金保険」「雇用保険」の4種類です。それぞれ労使折半で負担しますが、雇用保険のみ会社の負担率が高めに設定されています。',
   7, 2),
  (7, 2, '所得税の源泉徴収とは',
   '源泉徴収とは、会社が従業員の代わりに所得税を計算・納付する仕組みです。年末調整で過不足を精算し、納めすぎた税金は還付されます。',
   8, 3)
ON CONFLICT (id) DO NOTHING;

-- コース3: ふるさと納税ってお得なの？ レッスン
INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (8, 3, 'ふるさと納税の仕組み',
   'ふるさと納税は、応援したい自治体に寄付することで税金控除が受けられる制度です。寄付金額から自己負担2,000円を引いた全額が所得税・住民税から控除されます。さらに返礼品（特産品など）がもらえるのが魅力です。',
   7, 1),
  (9, 3, 'ワンストップ特例制度',
   'ワンストップ特例制度を使うと、確定申告不要でふるさと納税の控除が受けられます。ただし寄付先が5自治体以内・給与所得者であることが条件です。申請書を各自治体に翌年1月10日までに送付する必要があります。',
   6, 2)
ON CONFLICT (id) DO NOTHING;

-- コース4: 確定申告の手順と書類 追加レッスン
INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (10, 4, '申告書の書き方と提出方法',
   '確定申告書はe-Tax（オンライン）、税務署への郵送、窓口持参のいずれかで提出できます。e-Taxはマイナンバーカードとスマートフォンがあれば自宅から24時間手続き可能です。',
   10, 2),
  (11, 4, '医療費控除・住宅ローン控除',
   '年間の医療費が10万円（所得200万円以下の場合は所得の5%）を超えた場合は医療費控除が受けられます。住宅ローン控除は、ローン残高の0.7%が最長13年間税額から直接控除されます。',
   8, 3)
ON CONFLICT (id) DO NOTHING;

-- コース5: 副業の税金・経費のポイント レッスン
INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (12, 5, '副業収入の申告義務',
   '給与以外の所得（副業収入）が年間20万円を超える場合は確定申告が必要です。フリマアプリの売上・YouTube収益・クラウドソーシングなど幅広い収入が対象となります。',
   8, 1),
  (13, 5, '経費として認められるもの',
   '副業に直接関連する費用は経費として認められます。具体例として、パソコン・カメラなどの機材費、通信費、仕事用の書籍代、交通費などが挙げられます。プライベートと按分が必要なものは合理的な割合で計上します。',
   7, 2)
ON CONFLICT (id) DO NOTHING;

-- コース6: iDeCo・NISAで賢く節税 レッスン
INSERT INTO lessons (id, course_id, title, content, estimated_minutes, order_index)
VALUES
  (14, 6, 'iDeCoの節税メリット',
   'iDeCo（個人型確定拠出年金）は、掛金が全額所得控除・運用益が非課税・受取時も控除対象という三重の節税メリットがあります。ただし60歳まで原則引き出しできない点に注意が必要です。',
   10, 1),
  (15, 6, 'NISAの種類と使い分け',
   '新NISAは「つみたて投資枠（年120万円）」と「成長投資枠（年240万円）」の2つから構成されます。どちらの枠も運用益・配当が非課税です。長期・積立・分散投資を基本に、ライフプランに合わせて活用しましょう。',
   10, 2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン4（税金の種類）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (2, 4, '消費税は「直接税」と「間接税」のどちらに分類されますか？',
   '消費税は税を負担するのは消費者ですが、実際に納付するのは事業者です。このように負担者と納付者が異なる税を間接税と呼びます。',
   1),
  (3, 4, '住民税は国税・地方税どちらですか？',
   '住民税は都道府県と市区町村に納める地方税です。前年の所得をもとに計算され、翌年6月から徴収されます。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン5（直接税と間接税）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (4, 5, '所得税はどちらに分類されますか？',
   '所得税は税を負担する人（納税者）が直接国に納める直接税です。給与所得者は源泉徴収により会社が代わりに納付します。',
   1),
  (5, 5, '直接税に該当しないものはどれですか？',
   '消費税は間接税です。法人税・所得税・住民税はいずれも直接税に分類されます。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン6（社会保険料の内訳）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (6, 6, '介護保険料が給与から引かれ始める年齢は何歳からですか？',
   '介護保険料は40歳から徴収が始まります。40歳になった月の給与から健康保険料に上乗せされる形で引かれます。',
   1),
  (7, 6, '社会保険料のうち会社の負担割合が最も高いものはどれですか？',
   '雇用保険は労使で負担しますが、会社側の負担率が従業員より高く設定されています（一般の事業で従業員0.6%・会社0.95%）。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン7（源泉徴収）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (8, 7, '年末調整で納めすぎた所得税はどうなりますか？',
   '年末調整によって、1年間の正確な税額が計算されます。源泉徴収された税が多かった場合は差額が還付（戻ってくる）されます。',
   1),
  (9, 7, '源泉徴収を行うのは誰ですか？',
   '源泉徴収は会社（給与支払者）が従業員に代わって所得税を計算・徴収し、国に納付する仕組みです。従業員は自分で申告・納付する手間が省けます。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン8（ふるさと納税の仕組み）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (10, 8, 'ふるさと納税の自己負担額はいくらですか？',
   'ふるさと納税は、寄付金額から自己負担額2,000円を差し引いた全額が控除されます。ただし控除額には上限があり、年収や家族構成によって異なります。',
   1),
  (11, 8, 'ふるさと納税でもらえる返礼品の上限は寄付金額の何割ですか？',
   '総務省のルールにより、返礼品の価値は寄付金額の3割以下とされています。これにより過度な返礼品競争を防いでいます。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン9（ワンストップ特例）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (12, 9, 'ワンストップ特例制度が使えるのは寄付先が何自治体以内の場合ですか？',
   'ワンストップ特例制度は、寄付先が5自治体以内の場合に利用できます。6自治体以上に寄付した場合は確定申告が必要です。',
   1),
  (13, 9, 'ワンストップ特例の申請書の提出期限はいつですか？',
   '申請書は寄付をした翌年の1月10日（必着）までに各自治体に送付する必要があります。期限を過ぎると確定申告で控除を受けることになります。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン10（申告書の書き方）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (14, 10, 'e-Taxでの確定申告に必要なものはどれですか？',
   'e-Taxによる確定申告はマイナンバーカードとスマートフォン（またはICカードリーダー付きPC）があれば自宅から手続きが可能です。',
   1),
  (15, 10, '確定申告の提出期限は原則いつですか？',
   '確定申告の提出期限は原則として翌年の3月15日です。期限を過ぎると無申告加算税や延滞税が課される場合があります。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン11（医療費控除・住宅ローン控除）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (16, 11, '医療費控除が受けられる年間医療費の基準額は（所得200万円超の場合）いくらですか？',
   '所得200万円を超える場合、年間の医療費が10万円を超えた部分について医療費控除が受けられます。所得200万円以下の場合は所得の5%が基準額となります。',
   1),
  (17, 11, '新しい住宅ローン控除（2022年以降）の控除率は何%ですか？',
   '2022年以降の住宅ローン控除は、年末ローン残高の0.7%が所得税・住民税から直接控除されます（最長13年間）。以前の1%から引き下げられています。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン12（副業収入の申告義務）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (18, 12, '副業収入が年間いくらを超えると確定申告が必要ですか？',
   '給与所得以外の所得（副業収入）が年間20万円を超える場合は確定申告が必要です。20万円以下であっても住民税の申告は必要なケースがあります。',
   1),
  (19, 12, 'フリマアプリで不用品を売った収入は原則として何所得ですか？',
   '不用品販売は原則として「譲渡所得」に区分されます。生活用動産（30万円以下の家財）の売却は非課税ですが、金やブランド品などの売却益は課税対象になる場合があります。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン13（経費として認められるもの）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (20, 13, '副業で使用するパソコンを購入した場合、どのように処理しますか？',
   '10万円未満のパソコンは購入した年に全額経費計上できます。10万円以上の場合は減価償却により複数年にわたって経費計上します（一般的なパソコンは4年で償却）。',
   1),
  (21, 13, '自宅の家賃を副業の経費にする場合、どのように計算しますか？',
   '自宅を副業にも使用している場合、仕事に使用している面積や時間の割合で按分（あんぶん）した金額を経費にすることができます。合理的な計算根拠が必要です。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン14（iDeCoの節税メリット）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (22, 14, 'iDeCoの掛金はどのような税制優遇が受けられますか？',
   'iDeCoの掛金は全額「小規模企業共済等掛金控除」として所得控除の対象になります。課税所得から差し引かれるため、所得税・住民税の節税効果があります。',
   1),
  (23, 14, 'iDeCoのお金を引き出せるのは原則何歳からですか？',
   'iDeCoは老後の資産形成を目的とした制度のため、原則として60歳になるまで引き出しできません。途中解約も基本的には認められていません。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ問題: レッスン15（NISAの種類と使い分け）
INSERT INTO quiz_questions (id, lesson_id, question_text, explanation, order_index)
VALUES
  (24, 15, '新NISAのつみたて投資枠の年間投資上限額はいくらですか？',
   '新NISAのつみたて投資枠の年間投資上限額は120万円です。成長投資枠の240万円と合わせた年間上限額は360万円となります。',
   1),
  (25, 15, 'NISAで得た利益（運用益）はどのような扱いになりますか？',
   'NISA口座内で得た運用益（売却益・配当金・分配金）はすべて非課税です。通常の証券口座では約20%の税金がかかるため、長期投資において大きな節税効果があります。',
   2)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題2（消費税は直接税か間接税か）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (5,  2, 'A', '直接税', FALSE),
  (6,  2, 'B', '間接税', TRUE),
  (7,  2, 'C', '国税ではないので分類なし', FALSE),
  (8,  2, 'D', '目的税', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題3（住民税は国税・地方税）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (9,  3, 'A', '国税', FALSE),
  (10, 3, 'B', '地方税', TRUE),
  (11, 3, 'C', '直接税', FALSE),
  (12, 3, 'D', '間接税', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題4（所得税は直接税か間接税か）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (13, 4, 'A', '間接税', FALSE),
  (14, 4, 'B', '直接税', TRUE),
  (15, 4, 'C', '目的税', FALSE),
  (16, 4, 'D', '地方税', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題5（直接税に該当しないもの）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (17, 5, 'A', '法人税', FALSE),
  (18, 5, 'B', '所得税', FALSE),
  (19, 5, 'C', '消費税', TRUE),
  (20, 5, 'D', '住民税', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題6（介護保険料の徴収開始年齢）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (21, 6, 'A', '20歳', FALSE),
  (22, 6, 'B', '30歳', FALSE),
  (23, 6, 'C', '40歳', TRUE),
  (24, 6, 'D', '65歳', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題7（会社負担が最も高い社会保険料）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (25, 7, 'A', '健康保険', FALSE),
  (26, 7, 'B', '厚生年金保険', FALSE),
  (27, 7, 'C', '雇用保険', TRUE),
  (28, 7, 'D', '介護保険', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題8（年末調整で税が多かった場合）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (29, 8, 'A', '翌年に追加で納税が必要', FALSE),
  (30, 8, 'B', '差額が還付される', TRUE),
  (31, 8, 'C', '特に何も起きない', FALSE),
  (32, 8, 'D', '来年の源泉徴収から差し引かれる', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題9（源泉徴収を行うのは）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (33, 9, 'A', '従業員本人', FALSE),
  (34, 9, 'B', '税務署', FALSE),
  (35, 9, 'C', '会社（給与支払者）', TRUE),
  (36, 9, 'D', '社会保険労務士', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題10（ふるさと納税の自己負担額）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (37, 10, 'A', '0円（全額控除）', FALSE),
  (38, 10, 'B', '1,000円', FALSE),
  (39, 10, 'C', '2,000円', TRUE),
  (40, 10, 'D', '5,000円', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題11（返礼品の上限割合）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (41, 11, 'A', '1割', FALSE),
  (42, 11, 'B', '3割', TRUE),
  (43, 11, 'C', '5割', FALSE),
  (44, 11, 'D', '制限なし', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題12（ワンストップ特例の自治体数）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (45, 12, 'A', '3自治体以内', FALSE),
  (46, 12, 'B', '5自治体以内', TRUE),
  (47, 12, 'C', '10自治体以内', FALSE),
  (48, 12, 'D', '制限なし', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題13（ワンストップ特例の申請期限）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (49, 13, 'A', '寄付した年の12月31日', FALSE),
  (50, 13, 'B', '翌年1月10日', TRUE),
  (51, 13, 'C', '翌年3月15日', FALSE),
  (52, 13, 'D', '翌年5月31日', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題14（e-Taxに必要なもの）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (53, 14, 'A', '印鑑証明書と住民票', FALSE),
  (54, 14, 'B', 'マイナンバーカードとスマートフォン', TRUE),
  (55, 14, 'C', '源泉徴収票のみ', FALSE),
  (56, 14, 'D', '税理士への依頼が必須', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題15（確定申告の提出期限）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (57, 15, 'A', '1月31日', FALSE),
  (58, 15, 'B', '2月28日', FALSE),
  (59, 15, 'C', '3月15日', TRUE),
  (60, 15, 'D', '4月30日', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題16（医療費控除の基準額）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (61, 16, 'A', '5万円', FALSE),
  (62, 16, 'B', '10万円', TRUE),
  (63, 16, 'C', '20万円', FALSE),
  (64, 16, 'D', '30万円', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題17（住宅ローン控除の控除率）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (65, 17, 'A', '0.5%', FALSE),
  (66, 17, 'B', '0.7%', TRUE),
  (67, 17, 'C', '1.0%', FALSE),
  (68, 17, 'D', '1.5%', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題18（副業の申告基準額）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (69, 18, 'A', '10万円', FALSE),
  (70, 18, 'B', '20万円', TRUE),
  (71, 18, 'C', '30万円', FALSE),
  (72, 18, 'D', '50万円', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題19（フリマアプリの所得区分）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (73, 19, 'A', '給与所得', FALSE),
  (74, 19, 'B', '事業所得', FALSE),
  (75, 19, 'C', '譲渡所得', TRUE),
  (76, 19, 'D', '雑所得', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題20（パソコン購入の経費処理）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (77, 20, 'A', '10万円未満なら全額その年に経費計上できる', TRUE),
  (78, 20, 'B', '金額にかかわらず全額その年に経費計上できる', FALSE),
  (79, 20, 'C', '経費にはならない', FALSE),
  (80, 20, 'D', '5万円未満のみ経費計上できる', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題21（家賃の経費計上方法）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (81, 21, 'A', '全額経費にできる', FALSE),
  (82, 21, 'B', '経費にできない', FALSE),
  (83, 21, 'C', '仕事使用割合で按分した金額を経費にできる', TRUE),
  (84, 21, 'D', '家賃の半額を経費にできる', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題22（iDeCoの掛金の税制優遇）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (85, 22, 'A', '掛金の一部が税額控除される', FALSE),
  (86, 22, 'B', '掛金の全額が所得控除される', TRUE),
  (87, 22, 'C', '掛金に対して国から補助金が出る', FALSE),
  (88, 22, 'D', '税制優遇はない', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題23（iDeCoの引き出し可能年齢）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (89, 23, 'A', '50歳', FALSE),
  (90, 23, 'B', '55歳', FALSE),
  (91, 23, 'C', '60歳', TRUE),
  (92, 23, 'D', '65歳', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題24（NISAつみたて投資枠の年間上限）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (93, 24, 'A', '40万円', FALSE),
  (94, 24, 'B', '80万円', FALSE),
  (95, 24, 'C', '120万円', TRUE),
  (96, 24, 'D', '240万円', FALSE)
ON CONFLICT (id) DO NOTHING;

-- クイズ選択肢: 問題25（NISAの運用益の扱い）
INSERT INTO quiz_choices (id, question_id, choice_label, choice_text, is_correct)
VALUES
  (97,  25, 'A', '通常の証券口座と同じく約20%課税される', FALSE),
  (98,  25, 'B', '非課税（税金がかからない）', TRUE),
  (99,  25, 'C', '10%の軽減税率が適用される', FALSE),
  (100, 25, 'D', '損益通算の対象になる', FALSE)
ON CONFLICT (id) DO NOTHING;
