import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { getLessonApi } from "@/lib/api-client";
import { LessonViewer } from "./lesson-viewer";

type Props = {
  params: Promise<{ id: string }>;
};

const LESSON_ICONS: Record<number, string> = {
  1: "🏛️",
  2: "💴",
  3: "📋",
  4: "📊",
  5: "⚖️",
  6: "🏥",
  7: "📅",
  8: "🗾",
  9: "✉️",
  10: "💻",
  11: "🏠",
  12: "💼",
  13: "🧾",
  14: "🏦",
  15: "📈",
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

  const icon = LESSON_ICONS[lessonId] ?? "📗";

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-article">
        <div className="tp-lesson-hero">
          <div className="tp-lesson-hero-icon">{icon}</div>
          <div className="tp-lesson-hero-body">
            <h1 className="tp-title">{lesson.title}</h1>
            <p className="tp-lead">⏱ 目安: {lesson.estimatedMinutes}分</p>
          </div>
        </div>
        <div className="tp-ai-notice">
          <span className="tp-ai-notice-icon">⚠️</span>
          <span>本コンテンツはAIによって生成された情報を含んでいます。内容の正確性にご注意の上、重要な判断は必ず公式情報をご確認ください。</span>
        </div>
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
