# 実装計画: add-spec02.md

作成日: 2026-03-12  
参照仕様: `docs/user/add-spec02.md`

---

## 概要

`add-spec02.md` に記載されたバグ1件・追加仕様1件を実装する計画です。

---

## 調査・分析結果

### バグ1: 無料会員登録時に500のエラーになる

`backend/internal/server/handlers.go` の `register` ハンドラのロジックは概ね正しいが、以下の原因が考えられる。

#### 根本原因の候補

| 優先度 | 原因 | 詳細 |
|--------|------|------|
| 高 | **マイグレーション未適用** | `users` テーブルが存在しない場合、INSERT が SQL エラーで失敗し、`isUniqueViolation` に合致しないため 500 が返る |
| 中 | **`writeErr` に Content-Type ヘッダーがない** | `router.go` の `writeErr` 関数が `Content-Type: application/json` を設定していないため、エラーレスポンスが仕様と不一致 |
| 低 | **環境変数 DATABASE_URL 未設定** | `main.go` では `db.Ping()` が通れば DB 接続済みのため、起動できていれば問題なし |

#### 修正方針

1. `writeErr` 関数に `Content-Type: application/json` ヘッダーを追加する
2. `register` ハンドラに詳細なエラーログを追加し、DB エラー内容を特定しやすくする
3. マイグレーション未適用が原因の場合、起動時に自動マイグレーションを実行する仕組みを追加するか、README にマイグレーション手順を明記する

---

### 追加仕様1: 学習内容やクイズを追加したい

現在の seed データは非常に少ない。

| 項目 | 現状 |
|------|------|
| コース数 | 6コース（seed済み） |
| レッスン数 | 3件（コース1・2・4のみ、コース3・5・6はレッスンなし） |
| クイズ問題数 | 1問のみ（レッスン1のみ） |
| クイズ選択肢 | 4件（問題1のみ） |

#### 追加内容の方針

- 全6コースに対してレッスンを追加（各コース2〜3件）
- 各レッスンに対してクイズ問題を追加（各レッスン2〜3問）
- 各クイズ問題に対して4択の選択肢を追加
- 新規マイグレーションファイル `000003_add_content` として実装

---

## タスク一覧

### 【バグ修正1】`writeErr` への Content-Type ヘッダー追加

#### 変更ファイル
- `backend/internal/server/router.go`

#### 実装内容
```go
func writeErr(w http.ResponseWriter, status int, msg string) {
    w.Header().Set("Content-Type", "application/json")  // ← 追加
    w.WriteHeader(status)
    ...
}
```

---

### 【バグ修正2】`register` ハンドラへの詳細エラーログ追加

DB INSERT 失敗時にエラー内容をサーバーログに出力し、デバッグを容易にする。

#### 変更ファイル
- `backend/internal/server/handlers.go`

#### 実装内容
```go
if err != nil {
    if isUniqueViolation(err) {
        writeErr(w, http.StatusConflict, "email already exists")
        return
    }
    log.Printf("register: db error: %v", err)  // ← 追加
    writeErr(w, http.StatusInternalServerError, "failed to create user")
    return
}
```

---

### 【バグ修正3】起動時に自動マイグレーションを実行する

`main.go` 起動時に `migrations/*.up.sql` を自動適用し、テーブル未作成による 500 エラーを防ぐ。
マイグレーションは冪等（`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`）になっているため自動適用可能。

#### 変更ファイル
- `backend/cmd/api/main.go`
- `backend/internal/server/router.go`（マイグレーション実行ロジックを分離する場合）

#### 実装内容
- `cmd/migrate` の `runMigration` ロジックを共通パッケージ（`internal/migrate`）に切り出す
- `main.go` の `db.Ping()` 後に `migrate.RunUp(db, "./migrations")` を呼び出す

---

### 【追加仕様1】学習コンテンツ・クイズの大幅追加（新規マイグレーション）

#### 変更ファイル（新規作成）
- `backend/migrations/000003_add_content.up.sql`
- `backend/migrations/000003_add_content.down.sql`

#### 追加コンテンツ計画

**コース1: そもそも税金って何？（入門）**

| レッスンID | タイトル | 想定学習時間 |
|-----------|----------|-------------|
| 1（既存） | 税金の役割を知ろう | 5分 |
| 4（新規） | 税金の種類を学ぼう | 5分 |
| 5（新規） | 直接税と間接税の違い | 5分 |

**コース2: 給与明細の読み方（入門）**

| レッスンID | タイトル | 想定学習時間 |
|-----------|----------|-------------|
| 2（既存） | 給与明細の基本項目 | 8分 |
| 6（新規） | 社会保険料の内訳 | 7分 |
| 7（新規） | 所得税の源泉徴収とは | 8分 |

**コース3: ふるさと納税ってお得なの？（入門）**

| レッスンID | タイトル | 想定学習時間 |
|-----------|----------|-------------|
| 8（新規） | ふるさと納税の仕組み | 7分 |
| 9（新規） | ワンストップ特例制度 | 6分 |

**コース4: 確定申告の手順と書類（中級）**

| レッスンID | タイトル | 想定学習時間 |
|-----------|----------|-------------|
| 3（既存） | 確定申告の準備 | 10分 |
| 10（新規） | 申告書の書き方と提出方法 | 10分 |
| 11（新規） | 医療費控除・住宅ローン控除 | 8分 |

**コース5: 副業の税金・経費のポイント（中級）**

| レッスンID | タイトル | 想定学習時間 |
|-----------|----------|-------------|
| 12（新規） | 副業収入の申告義務 | 8分 |
| 13（新規） | 経費として認められるもの | 7分 |

**コース6: iDeCo・NISAで賢く節税（上級）**

| レッスンID | タイトル | 想定学習時間 |
|-----------|----------|-------------|
| 14（新規） | iDeCoの節税メリット | 10分 |
| 15（新規） | NISAの種類と使い分け | 10分 |

**クイズ問題**  
各新規レッスンに2問ずつ（計24問）、各問4択を追加する。

#### down ファイルの方針
`000003_add_content.down.sql` では追加したレッスン・クイズを DELETE する。

---

## 実装順序

```
1. バグ修正1: writeErr に Content-Type ヘッダー追加（影響小・即効性あり）
2. バグ修正2: register ハンドラへの詳細ログ追加
3. バグ修正3: 起動時自動マイグレーション（テーブル未作成による500を恒久的に解消）
4. 追加仕様1: 000003_add_content マイグレーションファイルの作成
```

---

## ユニットテスト方針

| 対象 | テスト内容 |
|------|-----------|
| `writeErr` | Content-Type ヘッダーが `application/json` であることを確認 |
| `register` ハンドラ | 正常系（201 Created）・重複メール（409）・DBエラー（500）のレスポンス確認 |
| マイグレーション | `RunUp` が冪等に実行されることを確認 |

---

## 影響範囲

| ファイル | 変更種別 |
|---------|---------|
| `backend/internal/server/router.go` | 修正（writeErr に Content-Type 追加） |
| `backend/internal/server/handlers.go` | 修正（ログ追加） |
| `backend/cmd/api/main.go` | 修正（自動マイグレーション呼び出し） |
| `backend/internal/migrate/migrate.go` | 新規（マイグレーションロジック共通化） |
| `backend/migrations/000003_add_content.up.sql` | 新規（コンテンツ追加） |
| `backend/migrations/000003_add_content.down.sql` | 新規（ロールバック） |
