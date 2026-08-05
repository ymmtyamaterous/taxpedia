"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { Header } from "@/components/header";
import { getGlossaryApi } from "@/lib/api-client";
import type { GlossaryTerm } from "@/lib/auth-types";

export default function GlossaryPage() {
  const { user } = useAuth();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGlossaryApi()
      .then(({ items }) => setTerms(items))
      .catch(() => setTerms([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.reading.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [query, terms]);

  const categories = useMemo(
    () => Array.from(new Set(filtered.map((t) => t.category).filter(Boolean))),
    [filtered],
  );

  return (
    <div className="tp-page">
      <Header />
      <main className="tp-container">
        <div className="tp-page-heading">
          <div>
            <h1 className="tp-title">用語辞典</h1>
            <p className="tp-lead">税務・税法に関するキーワードを解説します。</p>
          </div>
          {user?.role === "admin" && (
            <Link href="/admin" className="tp-link-btn">
              用語を管理する
            </Link>
          )}
        </div>

        <div className="tp-glossary-search">
          <input
            type="search"
            className="tp-glossary-search-input"
            placeholder="用語を検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="tp-lead">読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p className="tp-lead">該当する用語が見つかりませんでした。</p>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <section key={category} className="tp-glossary-section">
              <h2 className="tp-glossary-category">{category}</h2>
              <ul className="tp-glossary-list">
                {filtered
                  .filter((t) => t.category === category)
                  .map((term) => (
                    <li key={term.id} className="tp-glossary-item">
                      <div className="tp-glossary-term-header">
                        <span className="tp-glossary-term">{term.term}</span>
                        {term.reading && (
                          <span className="tp-glossary-reading">（{term.reading}）</span>
                        )}
                      </div>
                      <p className="tp-glossary-definition">{term.definition}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))
        ) : (
          <ul className="tp-glossary-list" style={{ marginTop: "1rem" }}>
            {filtered.map((term) => (
              <li key={term.id} className="tp-glossary-item">
                <div className="tp-glossary-term-header">
                  <span className="tp-glossary-term">{term.term}</span>
                  {term.reading && (
                    <span className="tp-glossary-reading">（{term.reading}）</span>
                  )}
                </div>
                <p className="tp-glossary-definition">{term.definition}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
