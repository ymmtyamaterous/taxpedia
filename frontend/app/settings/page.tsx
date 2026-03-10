"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token, router]);

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-auth">
        <h1 className="tp-title">プロフィール設定</h1>

        <form className="tp-form">
          <label>
            表示名
            <input type="text" defaultValue={user?.displayName ?? ""} disabled />
          </label>
          <label>
            メールアドレス
            <input type="email" defaultValue={user?.email ?? ""} disabled />
          </label>
          <p>プロフィール更新APIは未実装のため表示のみです。</p>
        </form>

        <p className="tp-lead">パスワード変更・退会APIは次フェーズで接続します。</p>
      </main>
    </div>
  );
}
