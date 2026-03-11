# 実装計画: add-spec01.md

作成日: 2026-03-10  
参照仕様: `docs/user/add-spec01.md`

---

## 概要

`add-spec01.md` に記載された追加仕様2件・懸念事項1件を実装する計画です。

---

## タスク一覧

### 【追加仕様1】トップページを `lp.html` を忠実に再現する

`frontend/app/page.tsx` を `docs/user/lp.html` の内容に合わせてほぼフルリニューアルします。

#### 変更ファイル
- `frontend/app/page.tsx` — クライアントコンポーネントに変更し、カルーセル・スクロールリビール・クイズのインタラクションを実装
- `frontend/app/globals.css` — LP 専用の CSS 変数・スタイルを追加（既存 `.tp-*` クラスは維持）
- `frontend/app/layout.tsx` — Google Fonts（Nunito, Noto Sans JP, Fredoka One）をロード

#### 実装内容
| セクション | 内容 |
|---|---|
| ヘッダー | ロゴ・ナビ・ログイン/今すぐ学ぶボタン（pill 型・固定・blur） |
| ヒーローカルーセル | 4スライド（学習画面・クイズ体験・統計・ペルソナ）、矢印・ドット・自動再生・スワイプ対応 |
| マーキー | 税金キーワードが流れる緑背景の帯 |
| Features | 3カラムカード |
| How it works | 4ステップカード（破線コネクター） |
| Curriculum | 2カラム（トピックリスト + インタラクティブクイズカード） |
| Testimonials | 3カラム口コミカード |
| Account vs Guest | 比較カード + 進捗プレビュー |
| CTA | 濃い緑背景のフルwidth CTA |
| フッター | ロゴ・リンク・コピーライト |
| スクロールリビール | IntersectionObserver による fade-in アニメーション |

#### 注意点
- `"use client"` を付与してカルーセル等の状態管理を実装
- 既存ルーティング（`/courses`, `/login`, `/register` 等）へのリンクは維持
- レスポンシブ対応（max-width 900px）

---

### 【追加仕様2】新規登録パスワード確認フィールドの追加

`frontend/app/register/page.tsx` にパスワード確認フィールドを追加し、送信前に一致検証を行います。

#### 変更ファイル
- `frontend/app/register/page.tsx`

#### 実装内容
1. `passwordConfirm` state を追加
2. パスワード確認の `<label>` + `<input>` を「パスワード」フィールドの直下に追加
3. `onSubmit` でパスワードが一致しない場合は `setError` でエラーメッセージを表示し送信を中断

---

### 【追加仕様3】パスワード表示/非表示トグル（目のアイコン）

ログインページと登録ページ両方にパスワード表示切替ボタンを実装します。

#### 変更ファイル
- `frontend/app/register/page.tsx`
- `frontend/app/login/page.tsx`
- `frontend/components/password-input.tsx`（新規作成・共通コンポーネント）

#### 実装内容
1. `frontend/components/password-input.tsx` を新規作成
   - `showPassword` state で `type="password"` / `type="text"` を切り替え
   - 入力欄の右端に目のアイコン（SVG）ボタンを配置（EyeIcon / EyeOffIcon）
   - Props: `value`, `onChange`, `placeholder`, `minLength`, `required` 等
2. `register/page.tsx` の「パスワード」・「パスワード確認」フィールドを `PasswordInput` に置き換え
3. `login/page.tsx` の「パスワード」フィールドを `PasswordInput` に置き換え

---

### 【懸念事項1】`progress.go` の `//go:build ignore` 警告を解消する

`backend/internal/domain/progress.go` の先頭にある `//go:build ignore` タグを削除します。

#### 原因
`//go:build ignore` が付いているため `gopls` がビルド対象外と判断し、警告が発生している。

#### 変更ファイル
- `backend/internal/domain/progress.go`

#### 実装内容
1. `//go:build ignore` と直後の空行を削除
2. ファイル末尾に重複コードが存在する場合はそれも削除し、クリーンな状態にする
3. `go build ./...` または Air のホットリロードで問題なくビルドできることを確認

---

## 実装順序

```
1. 懸念事項1: progress.go のビルドタグ削除（影響範囲小、先に解消）
2. 追加仕様3: PasswordInput コンポーネント作成
3. 追加仕様2: register ページにパスワード確認フィールド追加
4. 追加仕様1: トップページ LP 再現（最大作業量）
```

---

## テスト方針

- `progress.go` 修正後: `go test ./backend/internal/domain/...` で既存テスト通過を確認
- フロントエンド: ブラウザでカルーセル動作・クイズ操作・レスポンシブを目視確認
- フォームバリデーション: パスワード不一致時・一致時それぞれの動作を確認
