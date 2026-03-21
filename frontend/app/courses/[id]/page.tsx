import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { LevelBadge } from "@/components/level-badge";
import { getCourseApi, getCourseLessonsApi } from "@/lib/api-client";
import { LessonList } from "./lesson-list";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const courseId = Number(id);

  if (Number.isNaN(courseId)) {
    notFound();
  }

  let course;
  let courseLessons;
  try {
    [course, { items: courseLessons }] = await Promise.all([
      getCourseApi(courseId),
      getCourseLessonsApi(courseId),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">{course.title}</h1>
        <LevelBadge level={course.level} />
        <p className="tp-lead">{course.description}</p>

        <section className="tp-list-section">
          <h2>レッスン</h2>
          <LessonList lessons={courseLessons} />
        </section>
      </main>
    </div>
  );
}
