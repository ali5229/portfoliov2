import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ali — Software Engineer Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of a software engineer crafting performant, beautifully designed digital products.",
      },
      { property: "og:title", content: "Ali — Software Engineer Portfolio" },
      {
        property: "og:description",
        content:
          "Selected projects, experience and the toolbox of a software engineer.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteNav />
      <SocialSidebar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
