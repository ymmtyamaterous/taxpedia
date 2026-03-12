import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { getLessonApi } from "@/lib/api-client";
import { LessonViewer } from "./lesson-viewer";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const lessonId = Number(id);

  if (Number.isNaN(lessonId)) {
    notFound();
  }

  let lesson;
  try {
    lesson = await getLessonApi(lessonId);
  } catch {
    notFound();
  }

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-article">
        <h1 className="tp-title">{lesson.title}</h1>
        <p className="tp-lead">目安: {lesson.estimatedMinutes}分</p>
        <LessonViewer lesson={lesson} />
        <div className="tp-actions">
          <Link href={`/quiz/${lesson.id}`} className="tp-primary-btn">
            クイズに進む
          </Link>
        </div>
      </main>
    </div>
  );
}
