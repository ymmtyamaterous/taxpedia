"use client";

import { useCallback, useEffect, useState } from "react";

import { getLessonQuizApi, submitQuizApi } from "@/lib/api-client";
import { useAuth } from "@/components/auth-provider";
import type { QuizQuestion } from "@/lib/auth-types";

type Props = {
  lessonId: number;
};

type AnswerResult = {
  correct: boolean;
  explanation: string;
};

export function QuizClient({ lessonId }: Props) {
  const { token } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    getLessonQuizApi(lessonId)
      .then(({ items }) => setQuestions(items))
      .catch(() => setQuestions([]))
      .finally(() => setIsLoading(false));
  }, [lessonId]);

  const handleSubmit = useCallback(async () => {
    if (selectedId === null) return;
    const question = questions[currentIndex];
    if (!question) return;

    setIsSubmitting(true);
    try {
      const res = await submitQuizApi(question.id, selectedId, token ?? undefined);
      setResult(res);
      if (res.correct) setScore((s) => s + 1);
    } catch {
      setResult({ correct: false, explanation: "送信に失敗しました" });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedId, questions, currentIndex, token]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setResult(null);
    }
  }, [currentIndex, questions.length]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (questions.length === 0) {
    return <p>このレッスンのクイズは準備中です。</p>;
  }

  if (finished) {
    return (
      <section className="tp-card">
        <h2>クイズ完了！</h2>
        <p className="tp-lead">
          {questions.length}問中 <strong>{score}問</strong> 正解しました。
        </p>
      </section>
    );
  }

  const question = questions[currentIndex];

  return (
    <section className="tp-card">
      <p className="tp-lead">{currentIndex + 1} / {questions.length} 問</p>
      <h2>{question.question}</h2>
      <ul className="tp-choice-list">
        {question.choices.map((choice) => (
          <li key={choice.id}>
            <button
              type="button"
              className={`tp-choice ${selectedId === choice.id ? "is-selected" : ""}`}
              onClick={() => {
                if (!result) setSelectedId(choice.id);
              }}
              disabled={result !== null}
            >
              <span>{choice.label}</span>
              {choice.text}
            </button>
          </li>
        ))}
      </ul>

      {result === null ? (
        <button
          type="button"
          className="tp-primary-btn"
          disabled={selectedId === null || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "送信中..." : "答え合わせ"}
        </button>
      ) : (
        <>
          <p className={`tp-feedback ${result.correct ? "ok" : "ng"}`}>
            {result.correct ? "正解！" : "不正解"} {result.explanation}
          </p>
          <button type="button" className="tp-primary-btn" onClick={handleNext}>
            {currentIndex + 1 >= questions.length ? "結果を見る" : "次の問題"}
          </button>
        </>
      )}
    </section>
  );
}
