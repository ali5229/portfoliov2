import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Loader2 } from "lucide-react";
import { Section } from "./Section";
import { toast } from "sonner";
import { submitContactForm } from "../../lib/contact";

export function Contact() {
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    try {
      const res = await submitContactForm({ data: { name, email, message } });

      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        form.reset();
      } else {
        toast.error(res.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Section id="contact" className="!py-32">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">
            04 / CONTACT
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 font-display text-6xl leading-[0.9] md:text-8xl"
          >
            LET'S
            <br />
            <span className="text-primary">BUILD</span>{" "}
            <span className="font-script text-primary">something</span>
          </motion.h2>
          <p className="mt-8 max-w-md text-sm text-muted-foreground">
            Open for senior engineering roles, freelance collaborations and
            interesting problems. Drop a line.
          </p>

          <a
            href="mailto:aliabbas55506@gmail.com"
            className="group mt-10 inline-flex items-center gap-3 border-b border-foreground pb-2 font-display text-2xl tracking-wider hover:text-primary"
          >
            <Mail className="h-5 w-5" />
            aliabbas55506@gmail.com
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 md:col-span-5"
        >
          {[
            { label: "Name", type: "text", name: "name" },
            { label: "Email", type: "email", name: "email" },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {f.label}
              </span>
              <input
                type={f.type}
                name={f.name}
                required
                className="w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Message
            </span>
            <textarea
              name="message"
              rows={4}
              required
              className="w-full resize-none border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="group mt-2 inline-flex w-fit items-center gap-2 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPending ? (
              <>
                Sending...
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Send Message
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </Section>
  );
}
