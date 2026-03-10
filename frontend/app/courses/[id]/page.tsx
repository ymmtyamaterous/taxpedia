import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { LevelBadge } from "@/components/level-badge";
import { courses, lessons } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const courseId = Number(id);
  const course = courses.find((item) => item.id === courseId);

  if (Number.isNaN(courseId) || !course) {
    notFound();
  }

  const courseLessons = lessons.filter((lesson) => lesson.courseId === courseId);

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">{course.title}</h1>
        <LevelBadge level={course.level} />
        <p className="tp-lead">{course.description}</p>

        <section className="tp-list-section">
          <h2>レッスン</h2>
          <ul className="tp-list">
            {courseLessons.length > 0 ? (
              courseLessons.map((lesson) => (
                <li key={lesson.id}>
                  <div>
                    <strong>{lesson.title}</strong>
                    <p>{lesson.estimatedMinutes}分</p>
                  </div>
                  <Link href={`/lessons/${lesson.id}`}>学習する</Link>
                </li>
              ))
            ) : (
              <li>このコースのレッスンは準備中です。</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
