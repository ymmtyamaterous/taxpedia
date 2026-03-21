import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { getLessonApi } from "@/lib/api-client";

import { QuizClient } from "./quiz-client";

type Props = {
  params: Promise<{ lessonId: string }>;
};

export default async function QuizPage({ params }: Props) {
  const { lessonId } = await params;
  const id = Number(lessonId);

  if (Number.isNaN(id)) {
    notFound();
  }

  let courseId: number;
  try {
    const lesson = await getLessonApi(id);
    courseId = lesson.courseId;
  } catch {
    notFound();
  }

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">理解度チェック</h1>
        <p className="tp-lead">4択クイズで学習内容を確認します。</p>
        <QuizClient lessonId={id} courseId={courseId} />
      </main>
    </div>
  );
}
