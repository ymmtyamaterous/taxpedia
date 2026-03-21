"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/courses", label: "コース" },
  { href: "/glossary", label: "用語辞典" },
  { href: "/mypage", label: "マイページ" },
];

export function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="tp-header">
      <Link href="/" className="tp-logo">
        📗 Taxpedia
      </Link>
      <nav className="tp-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      {isLoading && (
        <div className="tp-header-auth" aria-hidden="true">
          <div className="tp-header-skeleton tp-header-skeleton-text" />
          <div className="tp-header-skeleton tp-header-skeleton-btn" />
        </div>
      )}

      {!isLoading && (
        <div className="tp-header-auth">
          {user ? (
            <>
              <span className="tp-user-name">{user.displayName}</span>
              <button type="button" className="tp-link-btn" onClick={logout}>
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="tp-link-btn">
                ログイン
              </Link>
              <Link href="/register" className="tp-primary-btn">
                無料で始める
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
