"use client";

import { useMemo, useState } from "react";

import { quizQuestions } from "@/lib/mock-data";

type Props = {
  lessonId: number;
};

export function QuizClient({ lessonId }: Props) {
  const question = useMemo(
    () => quizQuestions.find((item) => item.lessonId === lessonId) ?? null,
    [lessonId],
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!question) {
    return <p>このレッスンのクイズは準備中です。</p>;
  }

  const isCorrect = selectedId === question.answerId;

  return (
    <section className="tp-card">
      <h2>{question.question}</h2>
      <ul className="tp-choice-list">
        {question.choices.map((choice) => (
          <li key={choice.id}>
            <button
              type="button"
              className={`tp-choice ${selectedId === choice.id ? "is-selected" : ""}`}
              onClick={() => setSelectedId(choice.id)}
            >
              <span>{choice.label}</span>
              {choice.text}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="tp-primary-btn"
        disabled={selectedId === null}
        onClick={() => setSubmitted(true)}
      >
        答え合わせ
      </button>

      {submitted && (
        <p className={`tp-feedback ${isCorrect ? "ok" : "ng"}`}>
          {isCorrect ? "正解！" : "不正解"} {question.explanation}
        </p>
      )}
    </section>
  );
}
