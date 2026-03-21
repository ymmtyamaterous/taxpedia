"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { getUserLessonProgressApi } from "@/lib/api-client";
import type { LessonProgressItem, Lesson } from "@/lib/auth-types";

type Props = {
  lessons: Lesson[];
};

export function LessonList({ lessons }: Props) {
  const { token } = useAuth();
  const [progressMap, setProgressMap] = useState<Map<number, LessonProgressItem["status"]>>(new Map());

  useEffect(() => {
    if (!token) return;
    getUserLessonProgressApi(token)
      .then(({ items }) => {
        const map = new Map<number, LessonProgressItem["status"]>();
        for (const item of items) {
          map.set(item.lessonId, item.status);
        }
        setProgressMap(map);
      })
      .catch(() => {
        // 取得失敗はサイレントに無視
      });
  }, [token]);

  if (lessons.length === 0) {
    return (
      <ul className="tp-list">
        <li>このコースのレッスンは準備中です。</li>
      </ul>
    );
  }

  return (
    <ul className="tp-list">
      {lessons.map((lesson) => {
        const status = progressMap.get(lesson.id);
        return (
          <li key={lesson.id}>
            <div>
              <strong>{lesson.title}</strong>
              <p>{lesson.estimatedMinutes}分</p>
            </div>
            <div className="tp-lesson-list-right">
              {status === "completed" && (
                <span className="tp-progress-badge tp-progress-completed">✓ 学習済み</span>
              )}
              {status === "in_progress" && (
                <span className="tp-progress-badge tp-progress-in-progress">学習中</span>
              )}
              <Link href={`/lessons/${lesson.id}`}>
                {status === "completed" ? "復習する" : "学習する"}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
