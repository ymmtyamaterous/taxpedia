# Taxpedia 機能仕様書

> 作成日: 2026-03-10  
> 参照元: `docs/user/draft.md`, `docs/user/lp.html`

---

## 1. サービス概要

| 項目 | 内容 |
|------|------|
| サービス名 | Taxpedia |
| コンセプト | 税金について幅広く学習できる Web サービス |
| ターゲットユーザー | 学生・若者・社会人（初心者） |
| 利用形態 | ゲスト（登録なし）でも学習可能。アカウント登録で学習進捗を管理 |
| 料金 | 全コンテンツ完全無料 |

---

## 2. 画面一覧

| No | 画面名 | 概要 | 認証要否 |
|----|--------|------|----------|
| P-01 | ランディングページ（LP） | サービス紹介・ヒーローカルーセル | 不要 |
| P-02 | コース一覧ページ | 全コースをレベル別に一覧表示 | 不要 |
| P-03 | コース詳細ページ | コースの概要・レッスン一覧・進捗表示 | 不要（進捗表示は要認証） |
| P-04 | レッスンページ | 座学コンテンツの閲覧 | 不要 |
| P-05 | クイズページ | レッスン末尾の理解度確認クイズ | 不要（結果保存は要認証） |
| P-06 | マイページ | 学習進捗・獲得バッジ・学習履歴 | 要認証 |
| P-07 | ログインページ | メールアドレス + パスワードでログイン | 不要 |
| P-08 | 会員登録ページ | メールアドレス + パスワードで登録 | 不要 |
| P-09 | プロフィール設定ページ | 表示名・パスワード変更・退会 | 要認証 |

---

## 3. 機能詳細

### 3.1 座学機能（レッスン閲覧）

- **コース**：複数のレッスンをまとめた学習単位。難易度レベル（入門 / 中級 / 上級）を持つ。
- **レッスン**：1 本あたりの目安学習時間は 5〜10 分。テキスト + 図解形式。
- 登録なし（ゲスト）でも全コース・全レッスンを閲覧可能。
- レッスン閲覧中に「学習中」ステータスをアカウント保持ユーザーへ記録する。

**初期コース（カリキュラム例）**

| レベル | コース名 |
|--------|---------|
| 入門 | そもそも税金って何？ |
| 入門 | 給与明細の読み方 |
| 入門 | ふるさと納税ってお得なの？ |
| 中級 | 確定申告の手順と書類 |
| 中級 | 副業の税金・経費のポイント |
| 上級 | iDeCo・NISA で賢く節税 |

---

### 3.2 クイズ機能

- 各レッスンの末尾で **4択クイズ** を複数問出題する。
- 解答後に正誤フィードバックと解説文を表示する。
- ゲストもクイズに挑戦可能（結果はセッション内のみ保持、保存は不可）。
- アカウント保持ユーザーはクイズ結果を保存し、正答率・連続正解数をマイページに表示する。

---

### 3.3 アカウント機能

#### 3.3.1 会員登録 / ログイン

- メールアドレス + パスワードで登録（クレジットカード不要）。
- JWT 認証（アクセストークン）を使用する。
- パスワードは bcrypt でハッシュ化して保存する。

#### 3.3.2 学習進捗管理（アカウント限定）

| 機能 | 詳細 |
|------|------|
| 進捗自動保存 | レッスン閲覧開始・完了を自動記録 |
| 進捗再開 | 任意のデバイスから続きを再開可能 |
| 修了バッジ | コース修了時にバッジを付与 |
| 連続学習日数 | 毎日学習するとストリーク（連続日数）をカウント |
| 学習統計 | 修了コース数・獲得バッジ数・連続学習日数 |

#### 3.3.3 ゲストとの機能比較

| 機能 | ゲスト | アカウント登録済み |
|------|--------|--------------------|
| 全コース閲覧 | ✅ | ✅ |
| クイズ挑戦 | ✅ | ✅ |
| 学習進捗の保存 | ❌ | ✅ |
| 続きから再開 | ❌ | ✅ |
| 修了バッジ取得 | ❌ | ✅ |
| 学習履歴・統計 | ❌ | ✅ |

---

## 4. デザイン仕様

`docs/user/lp.html` の UI・デザインを基準とする。

### カラーパレット

| 変数名 | カラーコード | 用途 |
|--------|-------------|------|
| `--green-dark` | `#1a6640` | テキスト強調・ホバー時 |
| `--green-main` | `#2d9e60` | メインアクション・ボタン |
| `--green-light` | `#50c87a` | グラデーション装飾 |
| `--green-pale` | `#d4f5e2` | 背景・ホバー時背景 |
| `--green-bg` | `#f0faf4` | ページ背景 |
| `--yellow` | `#ffd94a` | アクセント・CTA |
| `--orange` | `#ff8c42` | 補助アクセント |
| `--ink` | `#1a2e20` | 本文テキスト |
| `--gray` | `#6b7c72` | サブテキスト |

### フォント

- 見出し: `Nunito` / `Fredoka One`
- 本文: `Noto Sans JP`

### レイアウト・共通ルール

- ヘッダーは固定表示（背景ぼかし + 丸みのある浮遊カード風）
- セクションごとにスクロールリビール（フェードイン）アニメーション
- ブレークポイント: 900px 以下でモバイルレイアウトに切り替え
- モーダル背景は半透明（TailwindCSS: `bg-black/50`）

---

## 5. システムアーキテクチャ

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js (TypeScript) + TailwindCSS |
| バックエンド | Go + Air（ホットリロード） |
| データベース | PostgreSQL |
| API 仕様 | OpenAPI (backend/openapi.yaml) |
| インフラ | Docker Compose (devcontainer) |

---

## 6. データベース設計

### テーブル一覧

#### `users`
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID / SERIAL | PK |
| email | VARCHAR(255) | メールアドレス（UNIQUE） |
| password_hash | VARCHAR(255) | bcrypt ハッシュ |
| display_name | VARCHAR(100) | 表示名 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

#### `courses`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| title | VARCHAR(255) | コース名 |
| description | TEXT | 概要 |
| level | ENUM(beginner / intermediate / advanced) | 難易度 |
| order_index | INT | 表示順 |
| created_at | TIMESTAMP | 作成日時 |

#### `lessons`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| course_id | INT | FK: courses |
| title | VARCHAR(255) | レッスン名 |
| content | TEXT | 本文（Markdown 等） |
| estimated_minutes | INT | 目安学習時間（分） |
| order_index | INT | コース内の順序 |
| created_at | TIMESTAMP | 作成日時 |

#### `quiz_questions`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| lesson_id | INT | FK: lessons |
| question_text | TEXT | 問題文 |
| explanation | TEXT | 解説文 |
| order_index | INT | 問題の順序 |

#### `quiz_choices`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| question_id | INT | FK: quiz_questions |
| choice_label | CHAR(1) | A / B / C / D |
| choice_text | TEXT | 選択肢テキスト |
| is_correct | BOOLEAN | 正解フラグ |

#### `user_lesson_progress`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| user_id | INT / UUID | FK: users |
| lesson_id | INT | FK: lessons |
| status | ENUM(in_progress / completed) | 進捗ステータス |
| completed_at | TIMESTAMP | 完了日時（NULL可） |
| updated_at | TIMESTAMP | 更新日時 |

#### `user_quiz_results`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| user_id | INT / UUID | FK: users |
| question_id | INT | FK: quiz_questions |
| selected_choice_id | INT | FK: quiz_choices |
| is_correct | BOOLEAN | 正誤 |
| answered_at | TIMESTAMP | 解答日時 |

#### `badges`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| course_id | INT | FK: courses（コース修了バッジ） |
| name | VARCHAR(100) | バッジ名 |
| icon | VARCHAR(10) | 絵文字アイコン |

#### `user_badges`
| カラム | 型 | 説明 |
|--------|----|------|
| id | SERIAL | PK |
| user_id | INT / UUID | FK: users |
| badge_id | INT | FK: badges |
| earned_at | TIMESTAMP | 取得日時 |

---

## 7. API 設計（概要）

詳細は `backend/openapi.yaml` で管理する。

### 認証

| メソッド | パス | 説明 |
|----------|------|------|
| POST | /api/auth/register | 会員登録 |
| POST | /api/auth/login | ログイン（JWT 発行） |
| POST | /api/auth/logout | ログアウト |
| GET | /api/auth/me | ログイン中ユーザー情報取得 |

### コース・レッスン

| メソッド | パス | 説明 |
|----------|------|------|
| GET | /api/courses | コース一覧取得 |
| GET | /api/courses/:id | コース詳細取得 |
| GET | /api/courses/:id/lessons | コース内レッスン一覧 |
| GET | /api/lessons/:id | レッスン詳細取得 |
| POST | /api/lessons/:id/start | レッスン開始（進捗記録） |
| POST | /api/lessons/:id/complete | レッスン完了（進捗記録） |

### クイズ

| メソッド | パス | 説明 |
|----------|------|------|
| GET | /api/lessons/:id/quiz | レッスンに紐づくクイズ問題取得 |
| POST | /api/quiz/submit | クイズ回答送信・正誤判定 |

### ユーザー・進捗

| メソッド | パス | 説明 |
|----------|------|------|
| GET | /api/users/me/progress | 全体の学習進捗取得 |
| GET | /api/users/me/badges | 獲得バッジ一覧取得 |
| GET | /api/users/me/streak | 連続学習日数取得 |
| PUT | /api/users/me | プロフィール更新 |
| PUT | /api/users/me/password | パスワード変更 |
| DELETE | /api/users/me | 退会 |

---

## 8. 環境変数

バックエンドは以下の環境変数で設定する。

| 変数名 | 説明 |
|--------|------|
| `HOST` | サーバーホスト（デフォルト: `0.0.0.0`） |
| `API_PORT` | API サーバーポート（デフォルト: `8080`） |
| `ALLOWED_ORIGINS` | CORS 許可オリジン |
| `DATABASE_URL` | PostgreSQL 接続 URL |
| `JWT_SECRET` | JWT 署名シークレット |

---

## 9. マイグレーション方針

- Go の CLI コマンドとしてマイグレーションを実装する。
- `go run ./cmd/migrate up` / `go run ./cmd/migrate down` のような形式とする。
- マイグレーションファイルはバージョン番号付きで `backend/migrations/` に配置する。

---

## 10. 非機能要件

| 項目 | 要件 |
|------|------|
| レスポンシブ対応 | SP（〜900px）・PC（900px〜）の 2 段階対応 |
| アクセシビリティ | セマンティック HTML を使用し、alt 属性等を適切に設定 |
| セキュリティ | JWT 認証・パスワード bcrypt ハッシュ化・CORS 設定 |
| テスト | 機能追加時にはユニットテストを必ず実施 |
| コード品質 | TypeScript は `any` 型の使用禁止。具体的な型を定義すること |
