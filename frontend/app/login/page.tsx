"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/mypage");
    } catch (e) {
      setError(e instanceof Error ? e.message : "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-auth">
        <h1 className="tp-title">ログイン</h1>
        <form className="tp-form" onSubmit={onSubmit}>
          <label>
            メールアドレス
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            パスワード
            <input
              type="password"
              placeholder="8文字以上"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="tp-error">{error}</p>}
          <button type="submit" className="tp-primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p>
          初めてですか？ <Link href="/register">無料登録へ</Link>
        </p>
      </main>
    </div>
  );
}
