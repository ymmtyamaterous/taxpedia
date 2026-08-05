"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";
import {
  CourseInput,
  createCourseApi,
  createGlossaryTermApi,
  createLessonApi,
  deleteCourseApi,
  deleteGlossaryTermApi,
  deleteLessonApi,
  getAdminCoursesApi,
  getCourseLessonsApi,
  getGlossaryApi,
  GlossaryInput,
  LessonInput,
  updateCourseApi,
  updateGlossaryTermApi,
  updateLessonApi,
} from "@/lib/api-client";
import type { Course, GlossaryTerm, Lesson } from "@/lib/auth-types";

type Tab = "courses" | "lessons" | "glossary";

const newCourse = (): CourseInput => ({ title: "", description: "", level: "beginner", orderIndex: 0 });
const newLesson = (): LessonInput => ({ courseId: 0, title: "", content: "", estimatedMinutes: 5, orderIndex: 0 });
const newTerm = (): GlossaryInput => ({ term: "", reading: "", definition: "", category: "" });

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [courseForm, setCourseForm] = useState<CourseInput>(newCourse);
  const [lessonForm, setLessonForm] = useState<LessonInput>(newLesson);
  const [termForm, setTermForm] = useState<GlossaryInput>(newTerm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    if (!token) return;
    const { items } = await getAdminCoursesApi(token);
    setCourses(items);
    setSelectedCourseId((current) => current || items[0]?.id || 0);
  }, [token]);

  const loadLessons = useCallback(async (courseId: number) => {
    if (!courseId) {
      setLessons([]);
      return;
    }
    const { items } = await getCourseLessonsApi(courseId);
    setLessons(items);
  }, []);

  const loadTerms = useCallback(async () => {
    const { items } = await getGlossaryApi();
    setTerms(items);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.replace("/");
  }, [isLoading, router, user]);

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    const load = async () => {
      try {
        await Promise.all([loadCourses(), loadTerms()]);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "管理データの取得に失敗しました");
      }
    };
    void load();
  }, [loadCourses, loadTerms, token, user?.role]);

  useEffect(() => {
    const load = async () => {
      try {
        await loadLessons(selectedCourseId);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "レッスンの取得に失敗しました");
      }
    };
    void load();
  }, [loadLessons, selectedCourseId]);

  const run = async (action: () => Promise<void>, message: string) => {
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(message);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "操作に失敗しました");
    }
  };

  const saveCourse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    void run(async () => {
      if (editingId) await updateCourseApi(editingId, courseForm, token);
      else await createCourseApi(courseForm, token);
      setCourseForm(newCourse());
      setEditingId(null);
      await loadCourses();
    }, "コースを保存しました。");
  };

  const saveLesson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !selectedCourseId) return;
    void run(async () => {
      const input = { ...lessonForm, courseId: selectedCourseId };
      if (editingId) await updateLessonApi(editingId, input, token);
      else await createLessonApi(input, token);
      setLessonForm(newLesson());
      setEditingId(null);
      await loadLessons(selectedCourseId);
    }, "レッスンを保存しました。");
  };

  const saveTerm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    void run(async () => {
      if (editingId) await updateGlossaryTermApi(editingId, termForm, token);
      else await createGlossaryTermApi(termForm, token);
      setTermForm(newTerm());
      setEditingId(null);
      await loadTerms();
    }, "用語を保存しました。");
  };

  const beginCourseEdit = (course: Course) => {
    setEditingId(course.id);
    setCourseForm({ title: course.title, description: course.description, level: course.level, orderIndex: course.orderIndex ?? 0 });
  };
  const beginLessonEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setLessonForm({ courseId: lesson.courseId, title: lesson.title, content: lesson.content, estimatedMinutes: lesson.estimatedMinutes, orderIndex: lesson.orderIndex ?? 0 });
  };
  const beginTermEdit = (term: GlossaryTerm) => {
    setEditingId(term.id);
    setTermForm({ term: term.term, reading: term.reading, definition: term.definition, category: term.category });
  };
  const resetForm = () => {
    setEditingId(null);
    if (tab === "courses") setCourseForm(newCourse());
    if (tab === "lessons") setLessonForm(newLesson());
    if (tab === "glossary") setTermForm(newTerm());
  };

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">管理画面</h1>
        <p className="tp-lead">コース、レッスン、用語を管理できます。</p>
        <div className="tp-admin-tabs" role="tablist" aria-label="管理対象">
          {(["courses", "lessons", "glossary"] as Tab[]).map((item) => (
            <button key={item} type="button" className={tab === item ? "tp-admin-tab tp-admin-tab--active" : "tp-admin-tab"} onClick={() => { setTab(item); resetForm(); }}>
              {{ courses: "コース", lessons: "レッスン", glossary: "用語" }[item]}
            </button>
          ))}
        </div>
        {error && <p className="tp-error" role="alert">{error}</p>}
        {notice && <p className="tp-notice">{notice}</p>}

        {tab === "courses" && <section className="tp-admin-grid">
          <form className="tp-form tp-card" onSubmit={saveCourse}>
            <h2>{editingId ? "コースを編集" : "コースを追加"}</h2>
            <label>コース名<input required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} /></label>
            <label>説明<textarea required value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} /></label>
            <label>レベル<select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as CourseInput["level"] })}><option value="beginner">初級</option><option value="intermediate">中級</option><option value="advanced">上級</option></select></label>
            <label>表示順<input type="number" value={courseForm.orderIndex} onChange={(e) => setCourseForm({ ...courseForm, orderIndex: Number(e.target.value) })} /></label>
            <div className="tp-actions"><button className="tp-primary-btn">保存</button>{editingId && <button type="button" className="tp-link-btn" onClick={resetForm}>キャンセル</button>}</div>
          </form>
          <div className="tp-admin-list">{courses.map((course) => <article key={course.id} className="tp-card"><h2>{course.title}</h2><p>{course.description}</p><div className="tp-actions"><button type="button" className="tp-link-btn" onClick={() => beginCourseEdit(course)}>編集</button><button type="button" className="tp-danger-btn" onClick={() => { if (token && confirm(`「${course.title}」と配下のレッスンを削除します。`)) void run(async () => { await deleteCourseApi(course.id, token); await loadCourses(); }, "コースを削除しました。"); }}>削除</button></div></article>)}</div>
        </section>}

        {tab === "lessons" && <section className="tp-admin-grid">
          <form className="tp-form tp-card" onSubmit={saveLesson}>
            <h2>{editingId ? "レッスンを編集" : "レッスンを追加"}</h2>
            <label>コース<select required value={selectedCourseId} onChange={(e) => { const id = Number(e.target.value); setSelectedCourseId(id); setLessonForm({ ...lessonForm, courseId: id }); }}>{courses.length === 0 && <option value="">コースを先に作成してください</option>}{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
            <label>レッスン名<input required value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} /></label>
            <label>本文（Markdown）<textarea required className="tp-admin-textarea" value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} /></label>
            <label>目安時間（分）<input required min="1" type="number" value={lessonForm.estimatedMinutes} onChange={(e) => setLessonForm({ ...lessonForm, estimatedMinutes: Number(e.target.value) })} /></label>
            <label>表示順<input type="number" value={lessonForm.orderIndex} onChange={(e) => setLessonForm({ ...lessonForm, orderIndex: Number(e.target.value) })} /></label>
            <div className="tp-actions"><button className="tp-primary-btn" disabled={!selectedCourseId}>保存</button>{editingId && <button type="button" className="tp-link-btn" onClick={resetForm}>キャンセル</button>}</div>
          </form>
          <div className="tp-admin-list">{lessons.map((lesson) => <article key={lesson.id} className="tp-card"><h2>{lesson.title}</h2><p>{lesson.estimatedMinutes}分</p><div className="tp-actions"><button type="button" className="tp-link-btn" onClick={() => beginLessonEdit(lesson)}>編集</button><button type="button" className="tp-danger-btn" onClick={() => { if (token && confirm(`「${lesson.title}」を削除します。`)) void run(async () => { await deleteLessonApi(lesson.id, token); await loadLessons(selectedCourseId); }, "レッスンを削除しました。"); }}>削除</button></div></article>)}</div>
        </section>}

        {tab === "glossary" && <section className="tp-admin-grid">
          <form className="tp-form tp-card" onSubmit={saveTerm}>
            <h2>{editingId ? "用語を編集" : "用語を追加"}</h2>
            <label>用語<input required value={termForm.term} onChange={(e) => setTermForm({ ...termForm, term: e.target.value })} /></label>
            <label>読み<input value={termForm.reading} onChange={(e) => setTermForm({ ...termForm, reading: e.target.value })} /></label>
            <label>説明<textarea required className="tp-admin-textarea" value={termForm.definition} onChange={(e) => setTermForm({ ...termForm, definition: e.target.value })} /></label>
            <label>カテゴリ<input value={termForm.category} onChange={(e) => setTermForm({ ...termForm, category: e.target.value })} /></label>
            <div className="tp-actions"><button className="tp-primary-btn">保存</button>{editingId && <button type="button" className="tp-link-btn" onClick={resetForm}>キャンセル</button>}</div>
          </form>
          <div className="tp-admin-list">{terms.map((term) => <article key={term.id} className="tp-card"><h2>{term.term}</h2><p>{term.definition}</p><div className="tp-actions"><button type="button" className="tp-link-btn" onClick={() => beginTermEdit(term)}>編集</button><button type="button" className="tp-danger-btn" onClick={() => { if (token && confirm(`「${term.term}」を削除します。`)) void run(async () => { await deleteGlossaryTermApi(term.id, token); await loadTerms(); }, "用語を削除しました。"); }}>削除</button></div></article>)}</div>
        </section>}
      </main>
    </div>
  );
}
