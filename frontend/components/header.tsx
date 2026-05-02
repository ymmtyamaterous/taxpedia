"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";

import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/courses", label: "コース" },
  { href: "/glossary", label: "用語辞典" },
  { href: "/mypage", label: "マイページ" },
];

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const mobileMenu = menuOpen ? (
    <>
      <div className="tp-mobile-overlay" onClick={closeMenu} aria-hidden="true" />
      <nav className="tp-mobile-menu">
        <button
          type="button"
          className="tp-mobile-menu-close"
          onClick={closeMenu}
          aria-label="メニューを閉じる"
        >
          ✕
        </button>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="tp-mobile-menu-item" onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
        <div className="tp-mobile-menu-divider" />
        {isLoading ? null : user ? (
          <>
            <span className="tp-mobile-menu-user">{user.displayName}</span>
            <button
              type="button"
              className="tp-mobile-menu-item tp-mobile-menu-item--btn"
              onClick={() => { logout(); closeMenu(); }}
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="tp-mobile-menu-item" onClick={closeMenu}>
              ログイン
            </Link>
            <Link href="/register" className="tp-mobile-menu-item tp-mobile-menu-item--primary" onClick={closeMenu}>
              無料で始める
            </Link>
          </>
        )}
      </nav>
    </>
  ) : null;

  return (
    <>
      <header className="tp-header">
        <Link href="/" className="tp-logo">
          📗 Taxpedia
        </Link>

        {/* デスクトップナビ */}
        <nav className="tp-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* デスクトップ認証エリア */}
        {isLoading && (
          <div className="tp-header-auth tp-header-auth--desktop" aria-hidden="true">
            <div className="tp-header-skeleton tp-header-skeleton-text" />
            <div className="tp-header-skeleton tp-header-skeleton-btn" />
          </div>
        )}

        {!isLoading && (
          <div className="tp-header-auth tp-header-auth--desktop">
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

        {/* ハンバーガーボタン（モバイルのみ） */}
        <button
          type="button"
          className="tp-hamburger"
          onClick={toggleMenu}
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
        >
          <span className={`tp-hamburger-bar${menuOpen ? " tp-hamburger-bar--open-1" : ""}`} />
          <span className={`tp-hamburger-bar${menuOpen ? " tp-hamburger-bar--open-2" : ""}`} />
          <span className={`tp-hamburger-bar${menuOpen ? " tp-hamburger-bar--open-3" : ""}`} />
        </button>
      </header>

      {/* モバイルメニュー: header の外（body直下）にポータルでレンダリング */}
      {typeof document !== "undefined" && createPortal(mobileMenu, document.body)}
    </>
  );
}
