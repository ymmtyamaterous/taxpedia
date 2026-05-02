"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Header } from "@/components/header";
import { LevelBadge } from "@/components/level-badge";
import { getCoursesApi } from "@/lib/api-client";
import type { Course } from "@/lib/auth-types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCoursesApi()
      .then(({ items }) => setCourses(items))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "コースの取得に失敗しました");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">コース一覧</h1>
        <p className="tp-lead">レベル別に税金の基礎から学べます。</p>

        {isLoading && <p className="tp-lead">読み込み中...</p>}
        {error && <p className="tp-error">{error}</p>}

        {!isLoading && !error && (
          <div className="tp-grid">
            {courses.map((course) => (
              <article key={course.id} className="tp-card">
                <div className="tp-card-head">
                  <h2>{course.title}</h2>
                  <LevelBadge level={course.level} />
                </div>
                <p>{course.description}</p>
                <Link href={`/courses/${course.id}`} className="tp-link-btn">
                  詳細を見る
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
