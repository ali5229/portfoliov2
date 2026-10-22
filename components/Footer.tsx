import { site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-rule pt-[22px] pb-[34px]">
      <div className="wrap flex flex-wrap justify-between gap-[10px]">
        <span className="label">{site.footer.copyright}</span>
      </div>
    </footer>
  );
}
