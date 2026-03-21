"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "@/components/auth-provider";
import { getLessonMemoApi, saveLessonMemoApi, startLessonApi } from "@/lib/api-client";
import type { Lesson } from "@/lib/auth-types";

type Props = {
  lesson: Lesson;
};

export function LessonViewer({ lesson }: Props) {
  const { token } = useAuth();
  const [memoContent, setMemoContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ログイン済みの場合、レッスン表示時に「学習中」ステータスを記録する
  useEffect(() => {
    if (!token) return;
    startLessonApi(lesson.id, token).catch(() => {
      // 進捗保存の失敗はサイレントに無視（学習体験を妨げない）
    });
  }, [lesson.id, token]);

  // メモ取得
  useEffect(() => {
    if (!token) return;
    getLessonMemoApi(lesson.id, token)
      .then((memo) => setMemoContent(memo.content))
      .catch(() => {
        // 取得失敗はサイレントに無視
      });
  }, [lesson.id, token]);

  const handleSaveMemo = async () => {
    if (!token) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveLessonMemoApi(lesson.id, memoContent, token);
      setSaveMessage("保存しました");
      setTimeout(() => setSaveMessage(null), 2000);
    } catch {
      setSaveMessage("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const paragraphs = lesson.content.split("\n\n").filter(Boolean);

  return (
    <>
      <article className="tp-article-body tp-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.content}
        </ReactMarkdown>
      </article>

      {token && (
        <div className="tp-memo">
          <h3 className="tp-memo-title">📝 メモ</h3>
          <textarea
            className="tp-memo-textarea"
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="このレッスンのメモを入力してください..."
            rows={5}
          />
          <div className="tp-memo-actions">
            <button
              type="button"
              className="tp-primary-btn"
              onClick={handleSaveMemo}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "メモを保存"}
            </button>
            {saveMessage && (
              <span className="tp-memo-save-msg">{saveMessage}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
