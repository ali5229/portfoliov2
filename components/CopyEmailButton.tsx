"use client";

import { useRef, useState } from "react";

/** Copies the email; if the clipboard API is unavailable, selects the address in #addr instead. */
export function CopyEmailButton({
  email,
  label,
  className,
}: {
  email: string;
  label: string;
  className: string;
}) {
  const [text, setText] = useState(label);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flash = (msg: string, ms: number) => {
    setText(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setText(label), ms);
  };

  const fallback = () => {
    const addr = document.getElementById("addr");
    if (!addr) return;
    const r = document.createRange();
    r.selectNodeContents(addr);
    const s = getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
    addr.scrollIntoView({ block: "center" });
    flash("Selected, press Ctrl+C", 2200);
  };

  const copy = () => {
    try {
      navigator.clipboard.writeText(email).then(() => flash("Copied", 1600), fallback);
    } catch {
      fallback();
    }
  };

  return (
    <button className={className} type="button" onClick={copy}>
      {text}
    </button>
  );
}
