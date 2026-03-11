"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/header";

// ── Carousel ──────────────────────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const total = 4;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const goTo = (index: number) => {
    setCurrent(((index % total) + total) % total);
  };

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
  };

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lp-hero-carousel">
      {/* Track */}
      <div
        ref={trackRef}
        className="lp-carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
          startAuto();
        }}
      >
        {/* SLIDE 1 */}
        <div className="lp-carousel-slide" style={{ background: "linear-gradient(135deg,#f0faf4 0%,#e8f8ee 100%)" }}>
          <div className="lp-slide-blob" style={{ width: 480, height: 480, background: "radial-gradient(circle,rgba(80,200,122,0.22),transparent 70%)", top: -100, left: -80 }} />
          <div className="lp-slide-blob" style={{ width: 320, height: 320, background: "radial-gradient(circle,rgba(255,217,74,0.18),transparent 70%)", bottom: 0, right: 60 }} />
          <div className="lp-slide-content">
            <div className="lp-hero-badge"><div className="lp-hero-badge-dot" />完全無料 · 登録なしでも学べる</div>
            <h1 className="lp-hero-title">
              税金って、<br />
              <span className="lp-highlight">むずかしくない。</span><br />
              もう不安にならない。
            </h1>
            <p className="lp-hero-sub">
              確定申告、ふるさと納税、節税…<br />
              知っているようで知らない税金の知識を、<br />
              <strong style={{ color: "var(--green-dark)" }}>登録不要・完全無料</strong>で今すぐ学べます。
            </p>
            <div className="lp-hero-cta">
              <Link href="/courses" className="lp-btn-main">📖 登録なしで学ぶ</Link>
              <Link href="/register" className="lp-btn-outline">📌 進捗を記録したい</Link>
            </div>
            <div className="lp-hero-social-proof">
              <div className="lp-avatars"><span>🧑</span><span>👩</span><span>👨</span><span>🙋</span></div>
              <div className="lp-social-text"><strong>12,000人以上</strong>が学習中<br />平均満足度 ★ 4.8</div>
            </div>
          </div>
          <div className="lp-slide-visual">
            <div style={{ position: "relative" }}>
              <div className="lp-sticker lp-sticker-1">🎉 今なら無料！</div>
              <div className="lp-phone-mock">
                <div className="lp-phone-header">
                  <div className="lp-phone-logo">📗 Taxpedia</div>
                  <div className="lp-progress-label">進捗 65%</div>
                </div>
                <div className="lp-progress-bar-wrap"><div className="lp-progress-bar-fill" /></div>
                <div className="lp-lesson-card lp-active">
                  <div className="lp-lesson-emoji">📄</div>
                  <div className="lp-lesson-info"><div className="lp-lesson-title">確定申告のやり方</div><div className="lp-lesson-meta">学習中 · 残り5分</div></div>
                  <span className="lp-lesson-badge lp-badge-mid">中級</span>
                </div>
                <div className="lp-lesson-card">
                  <div className="lp-lesson-emoji">💰</div>
                  <div className="lp-lesson-info"><div className="lp-lesson-title">ふるさと納税を使いこなす</div><div className="lp-lesson-meta">未学習 · 8分</div></div>
                  <span className="lp-lesson-badge lp-badge-beginner">入門</span>
                </div>
                <div className="lp-lesson-card">
                  <div className="lp-lesson-emoji">📈</div>
                  <div className="lp-lesson-info"><div className="lp-lesson-title">iDeCoで節税する方法</div><div className="lp-lesson-meta">未学習 · 10分</div></div>
                  <span className="lp-lesson-badge lp-badge-mid">中級</span>
                </div>
              </div>
              <div className="lp-sticker lp-sticker-2">✅ 3問正解！</div>
            </div>
          </div>
        </div>

        {/* SLIDE 2 */}
        <div className="lp-carousel-slide" style={{ background: "linear-gradient(135deg,#fffdf0 0%,#fdf6d8 100%)" }}>
          <div className="lp-slide-blob" style={{ width: 420, height: 420, background: "radial-gradient(circle,rgba(255,217,74,0.25),transparent 70%)", top: -80, left: -60 }} />
          <div className="lp-slide-blob" style={{ width: 280, height: 280, background: "radial-gradient(circle,rgba(80,200,122,0.2),transparent 70%)", bottom: 20, right: 40 }} />
          <div className="lp-slide-content">
            <div className="lp-hero-badge" style={{ background: "#fff8d6", borderColor: "#f0d96a", color: "#7a5c00" }}>🎯 クイズで楽しく学ぶ</div>
            <h1 className="lp-hero-title">
              読むだけじゃなく、<br />
              <span className="lp-highlight">クイズで定着。</span><br />
              理解が深まる。
            </h1>
            <p className="lp-hero-sub">各レッスンの終わりに確認クイズ。読みっぱなしにならず、知識が自分のものになる設計です。</p>
            <div className="lp-hero-cta">
              <Link href="/courses" className="lp-btn-main">🧠 クイズを体験する</Link>
              <Link href="/courses" className="lp-btn-outline">コースを見る</Link>
            </div>
            <div className="lp-hero-social-proof">
              <div className="lp-avatars"><span>🎓</span><span>💡</span><span>📚</span><span>✏️</span></div>
              <div className="lp-social-text"><strong>80以上</strong>のクイズを収録<br />毎月コンテンツ更新中</div>
            </div>
          </div>
          <div className="lp-slide-visual">
            <div className="lp-hero-quiz-card">
              <div className="lp-hqc-top">
                <span style={{ fontSize: "1.3rem" }}>🧠</span>
                <h3>理解度チェック</h3>
                <span className="lp-hqc-step">Q.2 / 4</span>
              </div>
              <div className="lp-hqc-body">
                <div className="lp-hqc-q">給与から天引きされる「所得税」は、何を基準に計算されますか？</div>
                <div className="lp-hqc-choices">
                  <div className="lp-hqc-choice"><span className="lp-hqc-label">A</span>総支給額（額面）</div>
                  <div className="lp-hqc-choice lp-correct"><span className="lp-hqc-label">B</span>各種控除を引いた課税所得</div>
                  <div className="lp-hqc-choice"><span className="lp-hqc-label">C</span>手取り金額</div>
                  <div className="lp-hqc-choice"><span className="lp-hqc-label">D</span>会社が自由に決める</div>
                </div>
                <div style={{ marginTop: "0.9rem", padding: "0.85rem", background: "#d4f5e2", borderRadius: 12, fontSize: "0.78rem", color: "var(--green-dark)", fontWeight: 600 }}>
                  🎉 正解！所得税は「収入 − 各種控除 ＝ 課税所得」に税率をかけて計算されます。
                </div>
              </div>
              <div className="lp-hqc-footer">
                <span>⭐ 連続正解中！</span>
                <button className="lp-hqc-btn">次の問題 →</button>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 3 */}
        <div className="lp-carousel-slide" style={{ background: "linear-gradient(135deg,#f0faf4 0%,#e4f4ee 100%)" }}>
          <div className="lp-slide-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(45,158,96,0.15),transparent 70%)", top: -120, right: -80 }} />
          <div className="lp-slide-blob" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(255,140,66,0.12),transparent 70%)", bottom: 0, left: 0 }} />
          <div className="lp-slide-content">
            <div className="lp-hero-badge"><div className="lp-hero-badge-dot" />数字で見る Taxpedia</div>
            <h1 className="lp-hero-title">
              税金の知識が、<br />
              <span className="lp-highlight">お金を守る。</span><br />
              今日から変わる。
            </h1>
            <p className="lp-hero-sub">正しい知識を持つだけで、知らずに損していた税金が戻ってくることも。まずは知ることから始めましょう。</p>
            <div className="lp-hero-cta">
              <Link href="/courses" className="lp-btn-main">📖 学習をスタート</Link>
            </div>
            <div className="lp-hero-social-proof">
              <div className="lp-avatars"><span>🧑</span><span>👩</span><span>👨</span><span>🙋</span></div>
              <div className="lp-social-text"><strong>12,000人以上</strong>が学習中<br />平均満足度 ★ 4.8</div>
            </div>
          </div>
          <div className="lp-slide-visual">
            <div className="lp-hero-stats-grid">
              <div className="lp-hstat-card lp-accent"><div className="lp-hstat-icon">📚</div><div className="lp-hstat-num">80+</div><div className="lp-hstat-label">学習コンテンツ数</div></div>
              <div className="lp-hstat-card"><div className="lp-hstat-icon">⏱️</div><div className="lp-hstat-num">5分</div><div className="lp-hstat-label">1レッスンの目安時間</div></div>
              <div className="lp-hstat-card"><div className="lp-hstat-icon">🏆</div><div className="lp-hstat-num">4.8</div><div className="lp-hstat-label">平均満足度（5点満点）</div></div>
              <div className="lp-hstat-card lp-accent"><div className="lp-hstat-icon">👥</div><div className="lp-hstat-num">12K+</div><div className="lp-hstat-label">学習中のユーザー</div></div>
              <div className="lp-hstat-card lp-wide">
                <div style={{ fontSize: "2.2rem" }}>🆓</div>
                <div className="lp-hstat-wide-text"><h4>全コンテンツ、完全無料</h4><p>登録不要・クレカ不要。今すぐ全部読めます。</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 4 */}
        <div className="lp-carousel-slide" style={{ background: "linear-gradient(135deg,#f5f0ff 0%,#ede8ff 100%)" }}>
          <div className="lp-slide-blob" style={{ width: 460, height: 460, background: "radial-gradient(circle,rgba(139,108,255,0.15),transparent 70%)", top: -80, right: -60 }} />
          <div className="lp-slide-blob" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(80,200,122,0.18),transparent 70%)", bottom: 20, left: 20 }} />
          <div className="lp-slide-content">
            <div className="lp-hero-badge" style={{ background: "#f0ebff", borderColor: "#c9b8ff", color: "#5b3fc8" }}>🙋 あなたにぴったり</div>
            <h1 className="lp-hero-title">
              どんな人でも、<br />
              <span className="lp-highlight">自分のペースで</span><br />
              学べます。
            </h1>
            <p className="lp-hero-sub">学生から社会人、副業をはじめた人まで。それぞれのシーンに合ったコースがあります。</p>
            <div className="lp-hero-cta">
              <Link href="/courses" className="lp-btn-main" style={{ background: "#7c5cbf" }}>🗂️ コースを選ぶ</Link>
              <Link href="/courses" className="lp-btn-outline" style={{ borderColor: "#7c5cbf", color: "#5b3fc8" }}>使い方を見る</Link>
            </div>
            <div className="lp-hero-social-proof">
              <div className="lp-avatars"><span>🎓</span><span>💼</span><span>🏠</span><span>📱</span></div>
              <div className="lp-social-text">学生・社会人・フリーランス<br /><strong>誰でも無料で</strong>はじめられます</div>
            </div>
          </div>
          <div className="lp-slide-visual">
            <div className="lp-hero-persona-grid">
              <div className="lp-persona-card lp-active">
                <div className="lp-persona-avatar">🎓</div>
                <div className="lp-persona-info"><div className="lp-persona-name">学生・これから社会人</div><div className="lp-persona-desc">給与明細の読み方、扶養の仕組みをゼロから理解</div></div>
                <span className="lp-persona-tag">入門</span>
              </div>
              <div className="lp-persona-card">
                <div className="lp-persona-avatar">💼</div>
                <div className="lp-persona-info"><div className="lp-persona-name">社会人・会社員</div><div className="lp-persona-desc">年末調整・ふるさと納税・iDeCoを活用したい</div></div>
                <span className="lp-persona-tag">中級</span>
              </div>
              <div className="lp-persona-card">
                <div className="lp-persona-avatar">💻</div>
                <div className="lp-persona-info"><div className="lp-persona-name">副業・フリーランス</div><div className="lp-persona-desc">確定申告・経費・青色申告のポイントを学ぶ</div></div>
                <span className="lp-persona-tag">上級</span>
              </div>
              <div className="lp-persona-card">
                <div className="lp-persona-avatar">🏠</div>
                <div className="lp-persona-info"><div className="lp-persona-name">結婚・住宅購入など</div><div className="lp-persona-desc">配偶者控除・住宅ローン控除など人生の節目の税知識</div></div>
                <span className="lp-persona-tag">中級</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        className="lp-carousel-arrow lp-prev"
        onClick={() => { goTo(current - 1); startAuto(); }}
        aria-label="前のスライド"
      >‹</button>
      <button
        className="lp-carousel-arrow lp-next"
        onClick={() => { goTo(current + 1); startAuto(); }}
        aria-label="次のスライド"
      >›</button>

      {/* Dots */}
      <div className="lp-carousel-dots">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            className={`lp-carousel-dot${i === current ? " lp-active" : ""}`}
            onClick={() => { goTo(i); startAuto(); }}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Curriculum Quiz ────────────────────────────────────────────────────────────
function CurriculumQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correctIndex = 1;

  const choices = [
    "税金がすべて免除される",
    "寄附金額の一部が控除・還付される",
    "税金が2倍になる",
    "特に変わらない",
  ];

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
  };

  return (
    <div className="lp-quiz-card">
      <div className="lp-quiz-top">
        <span className="lp-quiz-icon">🧠</span>
        <h3>理解度チェック</h3>
        <span>Q.3 / 5</span>
      </div>
      <div className="lp-quiz-body">
        <div className="lp-quiz-q">「ふるさと納税」をすると、翌年の税金がどうなりますか？</div>
        <div className="lp-quiz-choices">
          {choices.map((c, i) => {
            let cls = "lp-quiz-choice";
            if (selected === i) cls += " lp-selected";
            if (checked && selected === i) cls += i === correctIndex ? " lp-correct" : " lp-wrong";
            return (
              <button key={i} type="button" className={cls} onClick={() => !checked && setSelected(i)}>
                <span className="lp-choice-circle">{String.fromCharCode(65 + i)}</span>
                {c}
              </button>
            );
          })}
        </div>
        {checked && (
          <div className="lp-quiz-hint">
            🎉 正解！ふるさと納税は自己負担2,000円を超えた分が、翌年の住民税・所得税から控除または還付されます。
          </div>
        )}
      </div>
      <div className="lp-quiz-footer">
        <span>⭐ ストリーク 7日連続！</span>
        <button className="lp-btn-check" onClick={handleCheck}>答え合わせ →</button>
      </div>
    </div>
  );
}

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".lp-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("lp-visible"), i * 60);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useReveal();

  return (
    <div>
      <Header />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Marquee */}
      <div className="lp-marquee-section">
        <div className="lp-marquee-track">
          {["所得税","確定申告","ふるさと納税","住民税","相続税","節税対策","iDeCo","NISA","青色申告","副業の税金","消費税",
            "所得税","確定申告","ふるさと納税","住民税","相続税","節税対策","iDeCo","NISA","青色申告","副業の税金","消費税"].map((kw, i) => (
            <span key={i} className="lp-marquee-item">{kw}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="lp-section lp-features lp-reveal">
        <div className="lp-features-header">
          <div className="lp-section-chip">✨ Features</div>
          <h2 className="lp-section-title">Taxpediaが選ばれる理由</h2>
          <p className="lp-section-desc">難しいこと、ゼロ。楽しいこと、いっぱい。</p>
        </div>
        <div className="lp-features-grid">
          {[
            { icon: "📚", title: "ゼロからでも大丈夫", text: "専門用語をかみ砕いた説明で、まったく知識がない人でもスラスラ読める。「難しそう」という壁を取り除いた設計です。" },
            { icon: "🎯", title: "クイズで楽しく定着", text: "各レッスンの終わりに確認クイズ。読みっぱなしにならず、知識がしっかり自分のものになります。" },
            { icon: "⏱️", title: "1レッスン5〜10分", text: "通勤・休憩・ちょっとした隙間時間にサクッと学べるコンパクト設計。忙しい学生・社会人にぴったり。" },
          ].map((f) => (
            <div key={f.title} className="lp-feat-card">
              <div className="lp-feat-icon-wrap">{f.icon}</div>
              <div className="lp-feat-title">{f.title}</div>
              <p className="lp-feat-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="lp-section lp-how lp-reveal">
        <div className="lp-section-chip">🗺️ How it works</div>
        <h2 className="lp-section-title">使い方はとっても簡単</h2>
        <div className="lp-steps-grid">
          {[
            { num: "1", emoji: "📝", title: "無料で登録する", text: "メールアドレスだけで OK。クレカ不要、30秒で完了。" },
            { num: "2", emoji: "🗂️", title: "コースを選ぶ", text: "「はじめての確定申告」「副業の税金」など目的別コースがずらり。" },
            { num: "3", emoji: "📖", title: "読んでクイズ！", text: "わかりやすい解説を読んで、クイズで理解を確認。スキマ時間で OK。" },
            { num: "4", emoji: "🏆", title: "税金マスターへ", text: "コース修了で修了バッジを獲得。確定申告も節税も自信を持って！" },
          ].map((s) => (
            <div key={s.num} className="lp-step-card">
              <div className="lp-step-num">{s.num}</div>
              <div className="lp-step-emoji">{s.emoji}</div>
              <div className="lp-step-title">{s.title}</div>
              <p className="lp-step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="lp-section lp-curriculum lp-reveal">
        <div className="lp-curriculum-layout">
          <div>
            <div className="lp-section-chip">📋 Curriculum</div>
            <h2 className="lp-section-title">学べるコンテンツ</h2>
            <p className="lp-section-desc">学生・社会人・副業まで、あなたの状況に合ったコースが揃っています。</p>

            <div className="lp-topic-group" style={{ marginTop: "2rem" }}>
              <div className="lp-topic-group-label">🌱 入門レベル</div>
              <div className="lp-topic-list">
                {[
                  { emoji: "💴", name: "そもそも税金って何？", pill: "lp-pill-green", label: "入門" },
                  { emoji: "📊", name: "給与明細の読み方", pill: "lp-pill-green", label: "入門" },
                  { emoji: "🏘️", name: "ふるさと納税ってお得なの？", pill: "lp-pill-green", label: "入門" },
                ].map((t) => (
                  <div key={t.name} className="lp-topic-item">
                    <div className="lp-topic-left"><span className="lp-topic-emoji">{t.emoji}</span><span className="lp-topic-name">{t.name}</span></div>
                    <span className={`lp-topic-pill ${t.pill}`}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-topic-group">
              <div className="lp-topic-group-label">🌿 中級レベル</div>
              <div className="lp-topic-list">
                {[
                  { emoji: "📄", name: "確定申告の手順と書類", pill: "lp-pill-yellow", label: "中級" },
                  { emoji: "💼", name: "副業の税金・経費のポイント", pill: "lp-pill-yellow", label: "中級" },
                  { emoji: "🏦", name: "iDeCo・NISAで賢く節税", pill: "lp-pill-orange", label: "上級" },
                ].map((t) => (
                  <div key={t.name} className="lp-topic-item">
                    <div className="lp-topic-left"><span className="lp-topic-emoji">{t.emoji}</span><span className="lp-topic-name">{t.name}</span></div>
                    <span className={`lp-topic-pill ${t.pill}`}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CurriculumQuiz />
        </div>
      </section>

      {/* Testimonials */}
      <section className="lp-section lp-testimonials lp-reveal">
        <div className="lp-testimonials-header">
          <div>
            <div className="lp-section-chip">💬 Voices</div>
            <h2 className="lp-section-title">みんなの声</h2>
          </div>
          <p className="lp-section-desc">12,000人以上のユーザーに<br />使っていただいています。</p>
        </div>
        <div className="lp-testimonials-grid">
          {[
            { stars: "★★★★★", text: "社会人1年目でお金のことがまったくわからなかったんですが、Taxpediaのおかげで給与明細の見方から確定申告まで一気に理解できました！", avatar: "🧑", name: "田中 蓮 さん", role: "社会人 1年目・22歳" },
            { stars: "★★★★★", text: "副業を始めようとしたとき、税金のことが心配で…。Taxpediaで「副業の税金」コースを受けたら、何をすべきかすっきり整理できました！", avatar: "👩", name: "鈴木 あかり さん", role: "大学院生・25歳" },
            { stars: "★★★★☆", text: "ふるさと納税やiDeCoって名前は知ってたけど正直よくわかってなくて。クイズ形式で学べるのが楽しくて、気づいたら全部終わってた笑", avatar: "👨", name: "佐々木 湊 さん", role: "大学3年生・21歳" },
          ].map((t) => (
            <div key={t.name} className="lp-testi-card">
              <div className="lp-testi-stars">{t.stars}</div>
              <p className="lp-testi-text">{t.text}</p>
              <div className="lp-testi-author">
                <div className="lp-testi-avatar">{t.avatar}</div>
                <div>
                  <div className="lp-testi-name">{t.name}</div>
                  <div className="lp-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account vs Guest */}
      <section className="lp-section lp-account-section lp-reveal">
        <div className="lp-account-header">
          <div className="lp-section-chip">🔓 完全無料</div>
          <h2 className="lp-section-title">登録しなくても学べる。<br />登録するともっと便利。</h2>
          <p className="lp-section-desc">Taxpedia はすべてのコンテンツが無料。アカウント登録は任意ですが、登録すると学習の続きをどこからでも再開できます。</p>
        </div>

        <div className="lp-account-compare">
          <div className="lp-compare-card">
            <div className="lp-compare-icon">👤</div>
            <div className="lp-compare-label">ゲストで学ぶ</div>
            <div className="lp-compare-sub">登録・ログイン不要</div>
            <hr className="lp-compare-divider" />
            <ul className="lp-compare-list">
              <li className="lp-ok">✅ 全コース・全コンテンツを読める</li>
              <li className="lp-ok">✅ クイズに挑戦できる</li>
              <li className="lp-ok">✅ 税金用語辞典を使える</li>
              <li className="lp-no">❌ 学習進捗は保存されない</li>
              <li className="lp-no">❌ 続きから再開できない</li>
              <li className="lp-no">❌ 学習履歴・修了バッジなし</li>
            </ul>
            <Link href="/courses" className="lp-btn-guest">今すぐ学びはじめる →</Link>
          </div>

          <div className="lp-vs-badge">VS</div>

          <div className="lp-compare-card lp-account-card">
            <div className="lp-compare-icon">🌟</div>
            <div className="lp-compare-label">アカウント登録して学ぶ</div>
            <div className="lp-compare-sub">無料・メールだけで30秒</div>
            <hr className="lp-compare-divider" />
            <ul className="lp-compare-list">
              <li className="lp-ok">✅ 全コース・全コンテンツを読める</li>
              <li className="lp-ok">✅ クイズに挑戦できる</li>
              <li className="lp-ok">✅ 税金用語辞典を使える</li>
              <li className="lp-ok">✅ <strong>学習進捗が自動保存される</strong></li>
              <li className="lp-ok">✅ <strong>どのデバイスからでも続きを再開</strong></li>
              <li className="lp-ok">✅ <strong>修了バッジ・学習履歴を記録</strong></li>
            </ul>
            <Link href="/register" className="lp-btn-main" style={{ display: "block", textAlign: "center", padding: "0.85rem" }}>✨ 無料でアカウント登録</Link>
            <p className="lp-compare-note">クレジットカード不要 · いつでも退会できます</p>
          </div>
        </div>

        {/* Progress preview */}
        <div className="lp-progress-preview lp-reveal">
          <div className="lp-pp-label">
            <span className="lp-section-chip" style={{ margin: 0 }}>📊 アカウント登録後のマイページイメージ</span>
          </div>
          <div className="lp-pp-card">
            <div className="lp-pp-header">
              <div>
                <div className="lp-pp-logo">📗 Taxpedia</div>
                <div className="lp-pp-username">田中 蓮さんのマイページ</div>
              </div>
              <div className="lp-pp-stats">
                <div className="lp-pp-stat"><div className="lp-pp-stat-num">6</div><div className="lp-pp-stat-label">修了コース</div></div>
                <div className="lp-pp-stat"><div className="lp-pp-stat-num">🔥 7</div><div className="lp-pp-stat-label">連続学習日</div></div>
                <div className="lp-pp-stat"><div className="lp-pp-stat-num">4</div><div className="lp-pp-stat-label">獲得バッジ</div></div>
              </div>
            </div>
            <div className="lp-pp-courses">
              <div className="lp-pp-course lp-done">
                <span>💴 そもそも税金って何？</span>
                <div className="lp-pp-bar-wrap"><div className="lp-pp-bar" style={{ width: "100%" }} /></div>
                <span className="lp-pp-done-badge">✓ 修了</span>
              </div>
              <div className="lp-pp-course lp-done">
                <span>📊 給与明細の読み方</span>
                <div className="lp-pp-bar-wrap"><div className="lp-pp-bar" style={{ width: "100%" }} /></div>
                <span className="lp-pp-done-badge">✓ 修了</span>
              </div>
              <div className="lp-pp-course lp-inprogress">
                <span>📄 確定申告の手順と書類</span>
                <div className="lp-pp-bar-wrap"><div className="lp-pp-bar" style={{ width: "65%" }} /></div>
                <span className="lp-pp-progress-badge">65% 学習中</span>
              </div>
              <div className="lp-pp-course">
                <span>💼 副業の税金・経費のポイント</span>
                <div className="lp-pp-bar-wrap"><div className="lp-pp-bar" style={{ width: "0%" }} /></div>
                <span style={{ fontSize: "0.7rem", color: "var(--gray)", fontWeight: 600 }}>未開始</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(80,200,122,0.2),transparent 70%)", top: -200, left: -100 }} />
        <div className="lp-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(255,217,74,0.15),transparent 70%)", bottom: -100, right: 0 }} />
        <h2>さあ、税金を<br />自分の味方にしよう。</h2>
        <p>登録不要・完全無料。<br />今日から12,000人と一緒に学びはじめませんか？</p>
        <div className="lp-cta-btns">
          <Link href="/courses" className="lp-btn-cta-main">📖 登録なしで今すぐ学ぶ</Link>
          <Link href="/register" className="lp-btn-cta-outline">📌 アカウント登録して進捗を記録</Link>
        </div>
        <div className="lp-cta-note">全コンテンツ無料 · クレジットカード不要 · アカウント登録も無料</div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">📗 Taxpedia</div>
        <div className="lp-footer-links">
          <a href="#">利用規約</a>
          <a href="#">プライバシーポリシー</a>
          <a href="#">お問い合わせ</a>
          <a href="#">運営会社</a>
        </div>
        <div className="lp-footer-copy">© 2026 Taxpedia. All rights reserved.</div>
      </footer>
    </div>
  );
}
