import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function SiteNav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => go("home")}
          className="font-display text-2xl tracking-widest"
        >
          A<span className="text-primary">.</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`relative text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-foreground ${
                active === s.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
              {active === s.id && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            go("contact");
          }}
          className="hidden rounded-none border border-primary bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-transparent hover:text-primary md:block"
        >
          Hire Me
        </a>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-6 py-4">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="py-3 text-left text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
