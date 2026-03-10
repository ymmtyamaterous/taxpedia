import Link from "next/link";

import { Header } from "@/components/header";

export default function LoginPage() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-auth">
        <h1 className="tp-title">ログイン</h1>
        <form className="tp-form">
          <label>
            メールアドレス
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label>
            パスワード
            <input type="password" placeholder="8文字以上" required minLength={8} />
          </label>
          <button type="submit" className="tp-primary-btn">
            ログイン
          </button>
        </form>
        <p>
          初めてですか？ <Link href="/register">無料登録へ</Link>
        </p>
      </main>
    </div>
  );
}
