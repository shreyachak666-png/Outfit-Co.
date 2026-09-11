"use client";

import { useState } from "react";

export default function CopyLinkButton({
  url,
  label = "Copy Outfit Link",
}: {
  url: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back silently.
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-chocolate/25 px-4 py-2 text-xs font-medium tracking-wide text-chocolate transition-colors hover:border-burgundy hover:text-burgundy"
    >
      {copied ? "Link copied ✓" : label}
    </button>
  );
}
