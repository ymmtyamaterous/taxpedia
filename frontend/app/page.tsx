import Link from "next/link";

import { Header } from "@/components/header";

const features = [
  "登録なしで全コンテンツ学習可能",
  "1レッスン5〜10分の短時間設計",
  "4択クイズで理解度をその場で確認",
  "登録すると進捗・履歴・バッジを保存",
];

export default function Home() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-hero">
        <section>
          <p className="tp-chip">完全無料・登録なしで学べる</p>
          <h1 className="tp-title">税金って、むずかしくない。</h1>
          <p className="tp-lead">
            Taxpedia は学生・若手社会人向けの税金学習サービスです。
            座学 + クイズで、確定申告や節税の基礎を短時間で身につけられます。
          </p>
          <div className="tp-actions">
            <Link href="/courses" className="tp-primary-btn">
              コースを見る
            </Link>
            <Link href="/register" className="tp-link-btn">
              進捗を保存する
            </Link>
          </div>
        </section>

        <section className="tp-card">
          <h2>主な機能</h2>
          <ul className="tp-bullet">
            {features.map((feature) => (
              <li key={feature}>✅ {feature}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
