import Link from "next/link";

import { Header } from "@/components/header";
import { LevelBadge } from "@/components/level-badge";
import { getCoursesApi } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { items: courses } = await getCoursesApi();

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">コース一覧</h1>
        <p className="tp-lead">レベル別に税金の基礎から学べます。</p>

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
      </main>
    </div>
  );
}
