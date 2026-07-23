import type { ReactNode } from "react";

/**
 * Vortano service / product names to render in bold wherever they appear
 * inside plain-string copy (FAQ answers, roadmap items, …).
 * Longest phrases first so they win over their substrings.
 */
const SERVICE_TERMS = [
  "Autonomous on-chain agents",
  "hybrid NPU + GPU router",
  "Live shell terminal",
  "hybrid routing engine",
  "AI model suite",
  "GPU marketplace",
  "autonomous agents",
  "AI-native OS",
  "voltra CLI",
  "$VRTN",
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE = new RegExp(`(${SERVICE_TERMS.map(escape).join("|")})`, "gi");
const LOWER = new Set(SERVICE_TERMS.map((t) => t.toLowerCase()));

/** Split copy on any service term and wrap matches in a bold <strong>. */
export function highlightServices(text: string): ReactNode[] {
  return text.split(RE).map((part, i) =>
    part && LOWER.has(part.toLowerCase()) ? (
      <strong key={i} className="font-bold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
