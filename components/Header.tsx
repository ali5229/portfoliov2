import { nav, site } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-9 border-b border-rule bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-[8px]">
      <div className="wrap flex items-center gap-6 py-[14px]">
        <a
          className="font-display text-[1.05rem] font-black tracking-[-.01em] no-underline [font-stretch:125%]"
          href="#top"
        >
          {site.mark.first}
          <span className="text-accent">{site.mark.sep}</span>
          {site.mark.last}
        </a>
        <nav className="ml-auto flex gap-5 text-[.9rem] upto-760:hidden" aria-label="Sections">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="text-muted no-underline hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <span className="avail inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-rule px-[10px] py-[5px] font-mono text-[.75rem] upto-760:ml-auto">
          <i />
          {site.availability}
        </span>
      </div>
    </header>
  );
}
