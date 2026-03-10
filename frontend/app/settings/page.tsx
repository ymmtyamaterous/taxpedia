import { Header } from "@/components/header";

export default function SettingsPage() {
  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container tp-auth">
        <h1 className="tp-title">プロフィール設定</h1>

        <form className="tp-form">
          <label>
            表示名
            <input type="text" defaultValue="デモユーザー" />
          </label>
          <button type="submit" className="tp-primary-btn">
            保存
          </button>
        </form>

        <form className="tp-form">
          <label>
            新しいパスワード
            <input type="password" minLength={8} />
          </label>
          <button type="submit" className="tp-primary-btn">
            パスワード変更
          </button>
        </form>

        <button type="button" className="tp-danger-btn">
          退会する
        </button>
      </main>
    </div>
  );
}
