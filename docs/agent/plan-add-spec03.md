# 実装計画書：add-spec03 対応

作成日: 2026-03-21  
参照仕様: `docs/user/add-spec03.md`

---

## 概要

`add-spec03.md` に記載されたバグ修正・追加仕様・懸念事項を実装するための計画書です。  
全体で **7 タスク**（バグ修正 1 件 + 追加仕様 6 件）を扱います。

---

## タスク一覧

| # | 種別 | 内容 | 優先度 | 影響範囲 |
|---|------|------|--------|----------|
| B-1 | バグ修正 | 答え合わせボタンと選択肢のパディング | 高 | フロントのみ |
| F-1 | 追加仕様 | レッスンページにメモ機能 | 中 | フロント・バック・DB |
| F-2 | 追加仕様 | 生成AIコンテンツ注意書きバナー | 低 | フロントのみ |
| F-3 | 追加仕様 | 学習済みのUIフィードバック | 中 | フロント・バック |
| F-4 | 追加仕様 | クイズ終了後の導線追加 | 高 | フロントのみ |
| F-5 | 追加仕様 | レッスンコンテンツのMarkdown対応 | 中 | フロント・DB |
| F-6 | 追加仕様 | 用語辞典機能 | 低 | フロント・バック・DB |

---

## 詳細設計

---

### B-1：答え合わせボタンと選択肢のパディング修正

**問題箇所**  
`frontend/app/globals.css` の `.tp-choice-list` に `margin-bottom` がなく、直後に配置される「答え合わせ」ボタンと隙間がない。

**修正方針**  
`globals.css` の `.tp-choice-list` に `margin-bottom: 1rem` を追加する。

**変更ファイル**
- `frontend/app/globals.css`

---

### F-1：レッスンページにメモ機能

**概要**  
ログイン済みユーザーがレッスンごとにメモを保存・取得できる機能を追加する。

#### DB変更

マイグレーションファイルを新規作成して以下のテーブルを追加する。

```sql
-- 000006_add_lesson_memo.up.sql
CREATE TABLE IF NOT EXISTS user_lesson_memos (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  lesson_id  BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content    TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

#### バックエンド変更

| エンドポイント | メソッド | 認証 | 説明 |
|------------|---------|------|-----|
| `/api/lessons/{id}/memo` | GET | 必須 | メモ取得（未保存なら空文字を返す） |
| `/api/lessons/{id}/memo` | PUT | 必須 | メモ保存（upsert） |

**変更ファイル**
- `backend/migrations/000006_add_lesson_memo.up.sql`（新規）
- `backend/migrations/000006_add_lesson_memo.down.sql`（新規）
- `backend/internal/server/handlers.go`（lessonRoute に memo ルートを追加）
- `backend/internal/server/types.go`（`LessonMemo` 型を追加）
- `backend/openapi.yaml`（API定義を追加）

#### フロントエンド変更

`lesson-viewer.tsx` をクライアントコンポーネントに変更し、メモ入力エリアを追加する。

- メモ取得：コンポーネントマウント時にAPIを呼び出す
- メモ保存：「メモを保存」ボタンクリックで PUT APIを呼び出す
- 未ログイン時はメモ欄を非表示

**変更ファイル**
- `frontend/lib/auth-types.ts`（`LessonMemo` 型を追加）
- `frontend/lib/api-client.ts`（`getLessonMemoApi`・`saveLessonMemoApi` を追加）
- `frontend/app/lessons/[id]/lesson-viewer.tsx`（メモUIを追加）

---

### F-2：生成AIコンテンツ注意書きバナー

**概要**  
レッスンコンテンツが生成AIで作成されている旨の注意書きをレッスンページに表示する。

**実装方針**  
`lesson-viewer.tsx` または `lessons/[id]/page.tsx` のコンテンツ直前に注意書きバナーを配置する。  
バナーデザイン：黄色系の背景に ⚠️ アイコン + 固定文言。

**変更ファイル**
- `frontend/app/lessons/[id]/page.tsx`（注意書きバナーを追加）
- `frontend/app/globals.css`（`.tp-ai-notice` スタイルを追加）

---

### F-3：学習済みのUIフィードバック

**概要**  
コースのレッスン一覧ページで、ログイン済みユーザーに対して「学習済み（completed）」「学習中（in_progress）」のステータスを視覚的に表示する。

#### バックエンド変更

ログイン済みユーザー向けに、コースのレッスン一覧とあわせて進捗ステータスを返す新しいエンドポイントを追加する。

| エンドポイント | メソッド | 認証 | 説明 |
|------------|---------|------|-----|
| `/api/users/me/lesson-progress` | GET | 必須 | 全レッスンの進捗一覧を返す |

レスポンス例：
```json
{
  "items": [
    { "lessonId": 1, "status": "completed" },
    { "lessonId": 2, "status": "in_progress" }
  ]
}
```

**変更ファイル**
- `backend/internal/server/handlers.go`（`userLessonProgress` ハンドラを追加）
- `backend/internal/server/router.go`（ルートを追加）
- `backend/internal/server/types.go`（`LessonProgressItem` 型を追加）
- `backend/openapi.yaml`（API定義を追加）

#### フロントエンド変更

`courses/[id]/page.tsx` をクライアントコンポーネントに変更し、進捗APIから取得したステータスに応じてバッジを表示する。

- `completed`：緑色の「✓ 学習済み」バッジ
- `in_progress`：黄色の「学習中」バッジ
- なし：表示なし

**変更ファイル**
- `frontend/lib/auth-types.ts`（`LessonProgressItem` 型を追加）
- `frontend/lib/api-client.ts`（`getUserLessonProgressApi` を追加）
- `frontend/app/courses/[id]/page.tsx`（クライアントコンポーネント化 + ステータスバッジ表示）
- `frontend/app/globals.css`（進捗バッジ用スタイルを追加）

---

### F-4：クイズ終了後の導線追加

**概要**  
クイズ完了画面（`finished === true` の状態）に「レッスン一覧に戻る」ボタンを追加する。

**実装方針**  
- `quiz-client.tsx` に `lessonId` に紐づく `courseId` を Props または URL パラメータとして渡す
- クイズ完了画面に以下のボタンを追加する：
  - 「コース一覧へ」→ `/courses`
  - 「このコースのレッスン一覧へ」→ `/courses/{courseId}`

> `lessonId` → `courseId` の解決は、既存の `getLessonApi` で取得した `courseId` を利用する。  
> `quiz/[lessonId]/page.tsx` でレッスンAPIを呼び出し、`courseId` を Props 経由で `QuizClient` に渡す。

**変更ファイル**
- `frontend/app/quiz/[lessonId]/page.tsx`（`courseId` を取得して `QuizClient` に渡す）
- `frontend/app/quiz/[lessonId]/quiz-client.tsx`（Props に `courseId` を追加、完了画面に導線ボタンを追加）

---

### F-5：レッスンコンテンツのMarkdown対応

**概要**  
レッスンのコンテンツ表示を、現在の `<p>` タグ分割から Markdown レンダリングに変更する。  
これにより、見出し・リスト・強調・コードブロックなどのリッチな表現が可能になる。

**実装方針**

1. `react-markdown` および `remark-gfm` パッケージを追加する。
2. `lesson-viewer.tsx` で `<ReactMarkdown>` を使用してコンテンツをレンダリングする。
3. Markdown 用の CSS スタイルを `globals.css` に追加する（見出し・リスト・コードブロックのスタイリング）。
4. 既存 DB のコンテンツは Markdown 形式に変換するマイグレーションを実施する。

> 画像の埋め込みについては、Markdown の `![alt](url)` 形式で対応可能。  
> 画像ホスティングは既存の `UPLOAD_DIR` の仕組みを活用する（今回のスコープ外）。

**変更ファイル**
- `frontend/package.json`（`react-markdown`、`remark-gfm` を追加）
- `frontend/app/lessons/[id]/lesson-viewer.tsx`（ReactMarkdown を使用）
- `frontend/app/globals.css`（Markdown スタイルを追加 `.tp-markdown` クラス）
- `backend/migrations/000007_markdown_content.up.sql`（コンテンツをMarkdown形式に変換）
- `backend/migrations/000007_markdown_content.down.sql`

---

### F-6：用語辞典機能

**概要**  
税務用語を検索・一覧表示できる用語辞典ページを追加する。

#### DB変更

```sql
-- 000008_add_glossary.up.sql
CREATE TABLE IF NOT EXISTS glossary_terms (
  id          BIGSERIAL PRIMARY KEY,
  term        VARCHAR(100) NOT NULL UNIQUE,
  reading     VARCHAR(100) NOT NULL DEFAULT '',  -- 読み仮名（五十音順ソート用）
  definition  TEXT NOT NULL,
  category    VARCHAR(50) NOT NULL DEFAULT '',
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### バックエンド変更

| エンドポイント | メソッド | 認証 | 説明 |
|------------|---------|------|-----|
| `/api/glossary` | GET | 不要 | 用語一覧（クエリパラメータ `q` で検索） |
| `/api/glossary/{id}` | GET | 不要 | 用語詳細 |

**変更ファイル**
- `backend/migrations/000008_add_glossary.up.sql`（新規）
- `backend/migrations/000008_add_glossary.down.sql`（新規）
- `backend/internal/server/handlers.go`（`getGlossaryTerms`・`getGlossaryTermByID` を追加）
- `backend/internal/server/router.go`（ルートを追加）
- `backend/internal/server/types.go`（`GlossaryTerm` 型を追加）
- `backend/openapi.yaml`（API定義を追加）

#### フロントエンド変更

新規ページ `frontend/app/glossary/page.tsx` を追加する。

- 用語一覧をカード形式で表示
- テキスト検索欄（クライアントサイドフィルタリング）
- 五十音順または登録順のソート
- ヘッダーナビに「用語辞典」リンクを追加

**変更ファイル**
- `frontend/lib/auth-types.ts`（`GlossaryTerm` 型を追加）
- `frontend/lib/api-client.ts`（`getGlossaryApi`・`getGlossaryTermApi` を追加）
- `frontend/app/glossary/page.tsx`（新規 — 用語辞典ページ）
- `frontend/components/header.tsx`（ナビリンクに「用語辞典」を追加）
- `frontend/app/globals.css`（用語辞典ページ用スタイルを追加）

---

## 実装の順序（推奨）

優先度・依存関係を考慮した推奨実施順序：

```
B-1 → F-4 → F-2 → F-3 → F-1 → F-5 → F-6
```

| ステップ | タスク | 理由 |
|---------|--------|------|
| 1 | B-1 | 即時修正できるシンプルなバグ |
| 2 | F-4 | フロントのみの変更、影響が小さい |
| 3 | F-2 | フロントのみ、コンポーネント追加のみ |
| 4 | F-3 | バック + フロント、既存テーブルを流用 |
| 5 | F-1 | DB マイグレーションを伴う |
| 6 | F-5 | コンテンツ形式変更のため要注意 |
| 7 | F-6 | 新機能、スコープが大きい |

---

## テスト方針

各タスクにおいて以下を確認する：

- **B-1**：クイズ画面でボタンと選択肢の間に適切な余白があることを目視確認
- **F-1**：メモ保存・取得のAPIテストをバックエンドに追加、フロントで保存後にリロードしてもメモが残ることを確認
- **F-2**：レッスンページに注意書きバナーが表示されることを確認
- **F-3**：ログイン済みで学習済みレッスンに「✓ 学習済み」バッジが表示されることを確認
- **F-4**：クイズ完了後の画面に「コース一覧へ」ボタンが表示されること確認
- **F-5**：Markdown 形式のコンテンツが正常にレンダリングされることを確認
- **F-6**：用語辞典ページが表示され、検索が機能することを確認；APIテストをバックエンドに追加
