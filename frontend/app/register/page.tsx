"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { PasswordInput } from "@/components/password-input";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setError("パスワードが一致していません");
      return;
    }
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
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="8文字以上"
              required
              minLength={8}
            />
          </label>
          <label>
            パスワード（確認）
            <PasswordInput
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="もう一度入力してください"
              required
              minLength={8}
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
