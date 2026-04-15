"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  { href: "/marketplace", label: "Marketplace", match: (path: string) => path === "/marketplace" || path.startsWith("/marketplace/") },
  { href: "/events", label: "Events", match: (path: string) => path === "/events" || path.startsWith("/events/") },
];

const getLinkClasses = (active: boolean) =>
  [
    "cursor-pointer",
    "transition",
    "hover:text-[#1a1a1a]",
    active ? "font-semibold text-[#1a1a1a]" : "text-[#666]",
  ].join(" ");

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
      <div className="flex items-center gap-2 text-lg font-semibold italic">
        <span className="text-2xl text-[#fcd68a]">A</span>
        Nepal Art Space
      </div>
      <nav className="hidden items-center gap-8 text-sm md:flex">
        {navItems.map(({ href, label, match }) => {
          const active = match(pathname);
          return (
            <Link key={href} href={href} className={getLinkClasses(active)}>
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
