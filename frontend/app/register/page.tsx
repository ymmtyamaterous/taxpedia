"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await register(email, password, displayName);
      router.push("/mypage");
    } catch (e) {
      setError(e instanceof Error ? e.message : "登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-auth">
        <h1 className="tp-title">無料会員登録</h1>
        <form className="tp-form" onSubmit={onSubmit}>
          <label>
            表示名
            <input
              type="text"
              placeholder="Tax Learner"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </label>
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
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </form>
        <p>
          すでにアカウントをお持ちですか？ <Link href="/login">ログインへ</Link>
        </p>
      </main>
    </div>
  );
}
