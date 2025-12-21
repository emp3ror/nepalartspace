import Link from "next/link";

import { DoodleDivider } from "@/components/doodle-divider";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "GitHub", href: "https://github.com/example" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/example" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[color:var(--ink)] text-white/90">
      <div className="absolute inset-x-0 top-0">
        <DoodleDivider variant="line" colorClassName="text-white/20" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-14 pt-20 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Starter Kit
          </p>
          <h2 className="text-4xl font-semibold text-white">
            Framework-first scaffolding ready for your brand.
          </h2>
          <p className="text-sm text-white/80">
            Swap in your own routes, copy, and media. The components, layouts, and content pipeline are
            already wired up so you can focus on your story.
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            © {new Date().getFullYear()} Content Starter
          </p>
        </div>

        <div className="grid w-full max-w-md gap-10 sm:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Navigate
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-[color:var(--leaf)]/80" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Connect
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              {socials.map((item) => (
                <li key={item.href}>
                  <Link
                    className="transition hover:text-[color:var(--leaf)]/80"
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" aria-hidden />
    </footer>
  );
}
