import Link from "next/link";

import { Header } from "@/components/header";

export default function RegisterPage() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-auth">
        <h1 className="tp-title">無料会員登録</h1>
        <form className="tp-form">
          <label>
            表示名
            <input type="text" placeholder="Tax Learner" required />
          </label>
          <label>
            メールアドレス
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label>
            パスワード
            <input type="password" placeholder="8文字以上" required minLength={8} />
          </label>
          <button type="submit" className="tp-primary-btn">
            登録する
          </button>
        </form>
        <p>
          すでにアカウントをお持ちですか？ <Link href="/login">ログインへ</Link>
        </p>
      </main>
    </div>
  );
}
