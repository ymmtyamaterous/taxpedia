import Link from "next/link";
import { Header } from "@/components/header";

export default function TermsPage() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container" style={{ maxWidth: 800 }}>
        <h1 className="tp-title">利用規約</h1>
        <p className="tp-lead">最終更新日: 2026年5月2日</p>

        <div className="tp-card" style={{ marginTop: "1.5rem", lineHeight: 1.8 }}>
          <h2>第1条（適用）</h2>
          <p>
            本規約は、Taxpedia（以下「当サービス」）が提供するサービスの利用条件を定めるものです。
            ユーザーの皆さまは、本規約に同意の上、当サービスをご利用ください。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>第2条（利用登録）</h2>
          <p>
            当サービスは登録なしでも利用可能ですが、学習進捗の記録などの一部機能はアカウント登録が必要です。
            登録時には正確な情報を入力してください。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>第3条（禁止事項）</h2>
          <p>ユーザーは以下の行為を行ってはなりません。</p>
          <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
            <li>法令または公序良俗に違反する行為</li>
            <li>当サービスのサーバーまたはネットワークに過度な負荷をかける行為</li>
            <li>当サービスの運営を妨害するおそれのある行為</li>
            <li>他のユーザーに不利益を与える行為</li>
          </ul>

          <h2 style={{ marginTop: "1.5rem" }}>第4条（コンテンツについて）</h2>
          <p>
            当サービスのコンテンツには生成AIによって作成されたものが含まれます。
            情報の正確性については十分にご確認いただき、税務に関する具体的なご判断は専門家にご相談ください。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>第5条（免責事項）</h2>
          <p>
            当サービスは、提供するコンテンツの正確性・完全性について保証しません。
            当サービスのご利用により生じた損害について、運営者は一切の責任を負いません。
          </p>

          <h2 style={{ marginTop: "1.5rem" }}>第6条（規約の変更）</h2>
          <p>
            運営者は、必要に応じて本規約を変更することがあります。
            変更後の規約は当サービス上に掲載した時点で効力を生じます。
          </p>

          <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <Link href="/" className="tp-link-btn">トップページへ戻る</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
