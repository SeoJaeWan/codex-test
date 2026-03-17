"use client";

import Link from "next/link";

export interface BreadcrumbsProps {
  pathname: string;
}

const Breadcrumbs = ({ pathname }: BreadcrumbsProps) => {
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const labels: Record<string, string> = {
    dashboard: "ëŒ€ì‹œë³´ë“œ",
    todos: "í•  ì¼",
    profile: "í”„ë¡œí•„",
    login: "ë¡œê·¸ì¸",
    signup: "íšŒì›ê°€ìž…",
    "error-demo": "ì—ëŸ¬ ë°ëª¨",
  };

  return (
    <div
      className="mx-auto max-w-5xl px-4 py-2 text-sm text-zinc-500"
      data-testid="breadcrumbs"
    >
      <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
        í™ˆ
      </Link>
      {segments.map((seg, i) => (
        <span key={seg}>
          <span className="mx-1">/</span>
          {i === segments.length - 1 ? (
            <span className="text-zinc-900 dark:text-zinc-50">
              {labels[seg] || seg}
            </span>
          ) : (
            <Link
              href={`/${segments.slice(0, i + 1).join("/")}`}
              className="hover:text-zinc-900"
            >
              {labels[seg] || seg}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
