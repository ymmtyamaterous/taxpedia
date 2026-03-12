"use client";

import { useEffect } from "react";

import { useAuth } from "@/components/auth-provider";
import { startLessonApi } from "@/lib/api-client";
import type { Lesson } from "@/lib/auth-types";

type Props = {
  lesson: Lesson;
};

export function LessonViewer({ lesson }: Props) {
  const { token } = useAuth();

  // ログイン済みの場合、レッスン表示時に「学習中」ステータスを記録する
  useEffect(() => {
    if (!token) return;
    startLessonApi(lesson.id, token).catch(() => {
      // 進捗保存の失敗はサイレントに無視（学習体験を妨げない）
    });
  }, [lesson.id, token]);

  const paragraphs = lesson.content.split("\n\n").filter(Boolean);

  return (
    <article className="tp-article-body">
      {paragraphs.map((para, index) => (
        <p key={index}>{para}</p>
      ))}
    </article>
  );
}
