import Link from "next/link";

const navItems = [
  { href: "/courses", label: "コース" },
  { href: "/mypage", label: "マイページ" },
  { href: "/login", label: "ログイン" },
];

export function Header() {
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
      <Link href="/register" className="tp-primary-btn">
        無料で始める
      </Link>
    </header>
  );
}
