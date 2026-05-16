import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";

const links = [
  { icon: Github, href: "https://github.com/ali5229", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ali5229/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/aliabbas55506", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/m_ali_abbas_404/", label: "Instagram" },
  { icon: Mail, href: "mailto:aliabbas55506@gmail.com", label: "Email" },
];

export function SocialSidebar() {
  return (
    <aside className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="flex flex-col items-center gap-5 px-4 py-6">
        <div className="h-16 w-px bg-border" />
        {links.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="group relative text-muted-foreground transition-colors hover:text-primary"
          >
            <Icon className="h-4 w-4 transition-transform group-hover:scale-125" />
          </a>
        ))}
        <div className="h-16 w-px bg-border" />
        <span
          className="text-[10px] tracking-[0.3em] text-muted-foreground"
          style={{ writingMode: "vertical-rl" }}
        >
          FOLLOW
        </span>
      </div>
    </aside>
  );
}
