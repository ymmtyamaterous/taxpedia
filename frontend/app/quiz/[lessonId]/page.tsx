import { notFound } from "next/navigation";

import { Header } from "@/components/header";

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

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">理解度チェック</h1>
        <p className="tp-lead">4択クイズで学習内容を確認します。</p>
        <QuizClient lessonId={id} />
      </main>
    </div>
  );
}
