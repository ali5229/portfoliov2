import { motion } from "framer-motion";
import portrait from "@/assets/portrait.jpg";

export function Hero() {
  return (
    <section
      id="home"
      className="grain relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      {/* Giant vertical name */}
      <div className="pointer-events-none absolute left-2 top-0 hidden h-full items-center md:flex">
        <h2
          className="font-display text-[10vw] leading-none tracking-tighter text-foreground/10"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          DEVELOPER
        </h2>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-12 md:px-16">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative col-span-1 mx-auto md:col-span-7 md:mx-0"
        >
          <div className="group/portrait relative mx-auto w-full max-w-[min(88vw,14rem)] md:max-w-[15rem] [perspective:1200px]">
            <div
              className="relative isolate aspect-[3/4] overflow-hidden rounded-sm outline outline-1 -outline-offset-1 outline-border/70 shadow-[0_26px_50px_-24px_rgb(0_0_0/0.72)] transition-[transform,box-shadow,outline-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform-style:preserve-3d] group-hover/portrait:[transform:rotateX(7deg)_rotateY(-13deg)_translateZ(14px)_scale3d(1.02,1.02,1.02)] group-hover/portrait:shadow-[0_36px_70px_-28px_rgb(0_0_0/0.55),0_0_52px_-10px_oklch(0.62_0.24_27_/0.32)] group-hover/portrait:outline-primary/55"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={portrait}
                alt="Portrait"
                className="h-full w-full object-cover grayscale contrast-[1.02] brightness-[0.96] transition-[filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portrait:grayscale-0 group-hover/portrait:saturate-110 group-hover/portrait:brightness-105 group-hover/portrait:contrast-105"
              />
              {/* thematic warmth on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light bg-gradient-to-br from-primary via-primary/10 to-muted transition-opacity duration-500 group-hover/portrait:opacity-[0.45]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay bg-gradient-to-t from-background/25 via-transparent to-primary/35 transition-opacity duration-500 group-hover/portrait:opacity-100"
              />
              {/* red redaction bar over eye */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 1,
                  ease: [0.65, 0, 0.35, 1],
                }}
                style={{ originX: 0 }}
                className="absolute left-[28%] top-[32%] z-[1] h-[6%] w-[28%] bg-primary transition-[filter,opacity] duration-300 group-hover/portrait:opacity-90 mix-blend-multiply"
              />
              {/* corner ticks */}
              <div className="absolute left-3 top-3 z-[1] h-4 w-4 border-l-2 border-t-2 border-primary transition-colors duration-300 group-hover/portrait:border-primary-foreground/50" />
              <div className="absolute right-3 top-3 z-[1] h-4 w-4 border-r-2 border-t-2 border-primary transition-colors duration-300 group-hover/portrait:border-primary-foreground/50" />
              <div className="absolute bottom-3 left-3 z-[1] h-4 w-4 border-b-2 border-l-2 border-primary transition-colors duration-300 group-hover/portrait:border-primary-foreground/50" />
              <div className="absolute bottom-3 right-3 z-[1] h-4 w-4 border-b-2 border-r-2 border-primary transition-colors duration-300 group-hover/portrait:border-primary-foreground/50" />
            </div>
          </div>
        </motion.div>

        {/* Right column: typographic stack */}
        <div className="col-span-1 flex flex-col gap-4 md:col-span-5">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
          >
            — Software Engineer
          </motion.span>

          <div className="font-display text-5xl leading-[0.9] text-primary md:text-6xl lg:text-7xl">
            {["BUILD", "FAST", "SHIP", "SMART"].map((w, i) => (
              <motion.div
                key={w}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                {w}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="-mt-2"
          >
            <span className="font-script text-5xl text-primary md:text-6xl">
              smart
            </span>
            <span className="ml-2 font-display text-2xl tracking-widest text-foreground md:text-3xl">
              NOT HARD
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground"
          >
            I design and engineer performant, beautifully crafted digital
            products from the ground up — bridging code and editorial design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            DEV — PORTFOLIO / 2026
          </motion.div>
        </div>
      </div>

      {/* Corner labels */}
      <div className="absolute bottom-6 left-6 z-10">
        <span className="font-display text-xl text-primary">#DEV</span>
      </div>
      <div className="absolute bottom-6 right-6 z-10 hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">
        VS · CODE · 2026
      </div>
    </section>
  );
}
