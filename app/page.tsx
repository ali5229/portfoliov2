import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CaseStudy } from "@/components/CaseStudy";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PageBackground } from "@/components/PageBackground";
import { SectionHead } from "@/components/SectionHead";
import { ScrollTrace } from "@/components/ScrollTrace";
import { SectorsStrip } from "@/components/SectorsStrip";
import { SideProjects } from "@/components/SideProjects";
import { StackScanner } from "@/components/StackScanner";
import { work } from "@/lib/data";

export default function Home() {
  return (
    <>
      <PageBackground />
      <Header />
      <main id="top">
        <Hero />
        <SectorsStrip />

        <section className="wrap pt-24 pb-6" id="work">
          <SectionHead
            label={work.label}
            title={work.title}
            intro={work.intro}
          />
          <div className="grid gap-[22px]">
            <CaseStudy data={work.featured} />
            <div className="grid grid-cols-2 gap-[22px] upto-760:grid-cols-[1fr]">
              {work.duo.map((c) => (
                <CaseStudy key={c.title} data={c} />
              ))}
            </div>
          </div>
        </section>

        <ArchitectureDiagram />
        <SideProjects />
        <Experience />
        <StackScanner />
        <Contact />
      </main>
      <Footer />
      <ScrollTrace />
    </>
  );
}
