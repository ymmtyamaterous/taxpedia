import Link from "next/link";
import { Header } from "@/components/header";

export default function PrivacyPage() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container" style={{ maxWidth: 800 }}>
        <h1 className="tp-title">プライバシーポリシー</h1>
        <p className="tp-lead">最終更新日: 2026年5月2日</p>

        <div className="tp-card" style={{ marginTop: "1.5rem", lineHeight: 1.8 }}>
          <h2>1. 収集する情報</h2>
          <p>当サービスは以下の情報を収集する場合があります。</p>
          <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li>アカウント登録時に入力されたメールアドレス・表示名</li>
            <li>学習進捗・クイズ回答等のサービス利用情報</li>
            <li>アクセスログ（IPアドレス・ブラウザ情報など）</li>
          </ul>

          <h2 style={{ marginTop: "1.5rem" }}>2. 情報の利用目的</h2>
          <p>収集した情報は以下の目的で利用します。</p>
          <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li>サービスの提供・運営・改善</li>
            <li>学習進捗の管理・表示</li>
            <li>不正利用の防止</li>
          </ul>

          <h2 style={{ marginTop: "1.5rem" }}>3. 第三者への提供</h2>
          <p>
            運営者は、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供しません。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>4. データの保管・管理</h2>
          <p>
            収集した情報は適切なセキュリティ対策を講じた環境で管理します。
            不要となったデータは適切な方法で廃棄します。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>5. Cookie について</h2>
          <p>
            当サービスは認証情報の保持等のために Cookie を使用することがあります。
            ブラウザの設定により Cookie を無効にすることも可能ですが、一部機能が使用できなくなる場合があります。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>6. 個人情報の開示・削除</h2>
          <p>
            ユーザーは自身の個人情報の開示・訂正・削除を求めることができます。
            ご希望の方はお問い合わせフォームよりご連絡ください。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>7. プライバシーポリシーの変更</h2>
          <p>
            運営者は必要に応じて本ポリシーを変更することがあります。
            変更後のポリシーは当サービス上に掲載した時点で効力を生じます。
          </p>

          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <Link href="/" className="tp-link-btn">トップページへ戻る</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
