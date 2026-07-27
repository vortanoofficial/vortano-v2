// Vortano inference endpoint — server-side proxy to a hosted model.
// The API key stays on the server (env DEEPSEEK_API_KEY) and never reaches the
// browser. Guarded with input caps + a lightweight in-memory rate limit so a
// public endpoint can't run up the bill.
//
// Honesty: this serves a preview of the model experience via a hosted inference
// provider. It is NOT (yet) running on Vortano's decentralized compute — that's
// the roadmap. The UI must say so.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const MAX_INPUT = 1200; // chars
const MAX_TOKENS = 320;

const SYSTEM =
  "You are the Vortano model preview — a helpful, concise assistant hosted for vortano.ai, " +
  "an on-chain compute marketplace on Robinhood Chain. Be genuinely useful and brief (a few " +
  "sentences unless asked for more). If asked about Vortano, describe it accurately: a " +
  "decentralized GPU/NPU marketplace where jobs settle in USDG on Robinhood Chain, coordinated " +
  "by the $VRTN token. Do not give financial advice or price predictions.";

// naive in-memory rate limit (best-effort; resets on redeploy)
const HITS = new Map<string, { n: number; t: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1h
const LIMIT = 30; // per IP per hour

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = HITS.get(ip);
  if (!cur || now - cur.t > WINDOW_MS) {
    HITS.set(ip, { n: 1, t: now });
    return false;
  }
  cur.n += 1;
  return cur.n > LIMIT;
}

export async function POST(req: Request) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    return Response.json(
      { error: "offline", message: "The model is warming up. Check back shortly." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anon";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "rate_limited", message: "You've hit the preview limit for now — try again later." },
      { status: 429 },
    );
  }

  let prompt = "";
  try {
    const body = await req.json();
    prompt = String(body?.prompt ?? "").slice(0, MAX_INPUT);
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (!prompt.trim()) return Response.json({ error: "empty" }, { status: 400 });

  try {
    const r = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!r.ok) {
      return Response.json({ error: "upstream", status: r.status }, { status: 502 });
    }
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content?.trim() ?? "";
    const usage = j?.usage ?? null;
    return Response.json({ text, usage });
  } catch {
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
