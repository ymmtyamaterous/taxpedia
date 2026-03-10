import { Header } from "@/components/header";

export default function MyPage() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <h1 className="tp-title">マイページ</h1>
        <div className="tp-grid">
          <section className="tp-card">
            <h2>学習統計</h2>
            <ul>
              <li>修了コース: 2</li>
              <li>連続学習日数: 7日</li>
              <li>獲得バッジ: 3</li>
            </ul>
          </section>
          <section className="tp-card">
            <h2>学習中コース</h2>
            <ul>
              <li>確定申告の手順と書類（65%）</li>
              <li>副業の税金・経費のポイント（10%）</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
