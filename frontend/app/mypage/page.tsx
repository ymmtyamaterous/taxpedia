"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { myBadgesApi, myProgressApi } from "@/lib/api-client";
import { Badge, UserProgress } from "@/lib/auth-types";

export default function MyPage() {
  const router = useRouter();
  const { token, isLoading, user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
      return;
    }

    if (!token) {
      return;
    }

    Promise.all([myProgressApi(token), myBadgesApi(token)])
      .then(([progressData, badgeData]) => {
        setProgress(progressData);
        setBadges(badgeData.items);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "データ取得に失敗しました");
      });
  }, [token, isLoading, router]);

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">マイページ</h1>
        <p className="tp-lead">{user ? `${user.displayName} さんの学習状況` : "学習状況"}</p>

        {error && <p className="tp-error">{error}</p>}

        <div className="tp-grid">
          <section className="tp-card">
            <h2>学習統計</h2>
            <ul>
              <li>修了コース: {progress?.completedCourses ?? 0}</li>
              <li>連続学習日数: {progress?.streakDays ?? 0}日</li>
              <li>獲得バッジ: {progress?.earnedBadges ?? 0}</li>
            </ul>
          </section>
          <section className="tp-card">
            <h2>獲得バッジ</h2>
            <ul>
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <li key={badge.id}>
                    {badge.icon} {badge.name}
                  </li>
                ))
              ) : (
                <li>バッジはまだありません</li>
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
