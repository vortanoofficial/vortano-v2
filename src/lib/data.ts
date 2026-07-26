// ============================================================
// VORTANO — mock data layer (Robinhood Chain)
// All figures are illustrative placeholders for the UI mockup.
// ============================================================

export const CHAIN = {
  name: "Robinhood Chain",
  short: "Robinhood",
  explorer: "Robinscan",
  gas: "0.04 gwei",
  block: "18,492,113",
  contract: "0xe81dc008231035c91f09633c541394b9ddf53673",
} as const;

export const HERO_STATS = [
  { label: "Compute online", value: "2,418", unit: "PFLOPs" },
  { label: "Active providers", value: "14,832", unit: "" },
  { label: "Jobs settled (30d)", value: "1.2M", unit: "" },
  { label: "Paid to nodes", value: "$48.7M", unit: "USDG" },
];

export type Ticker = { name: string; price: string; delta: string; up: boolean };

export const PRICE_TICKER: Ticker[] = [
  { name: "H100 SXM", price: "$2.18/hr", delta: "-3.4%", up: false },
  { name: "A100 80GB", price: "$1.42/hr", delta: "-1.2%", up: false },
  { name: "TPU v5e", price: "$1.85/hr", delta: "+0.8%", up: true },
  { name: "RTX 4090", price: "$0.41/hr", delta: "+2.1%", up: true },
  { name: "MI300X", price: "$2.74/hr", delta: "-0.6%", up: false },
  { name: "NPU Apex-3", price: "$0.22/hr", delta: "+5.4%", up: true },
  { name: "H200 NVL", price: "$3.10/hr", delta: "+0.3%", up: true },
  { name: "L40S", price: "$0.92/hr", delta: "-2.0%", up: false },
  { name: "TPU v5p", price: "$3.42/hr", delta: "+1.1%", up: true },
  { name: "NPU Hailo-10", price: "$0.18/hr", delta: "-0.9%", up: false },
];

export type Node = {
  arch: string;
  id: string;
  region: string;
  kind: "GPU" | "TPU" | "NPU / ASIC";
  chip: string;
  memory: string;
  perf: string;
  uptime: string;
  price: string;
  status: "Available now" | "Reserved";
  /** baseline live GPU utilization %, drives the load graph */
  util: number;
};

export const NODES: Node[] = [
  { arch: "Ada Lovelace", id: "4090-fra-12", region: "Frankfurt, EU", kind: "GPU", chip: "NVIDIA RTX 4090", memory: "24 GB GDDR6X", perf: "82.6 TFLOPs", uptime: "99.9%", price: "0.41", status: "Available now", util: 71 },
  { arch: "Lovelace", id: "l40s-syd-03", region: "Sydney, APAC", kind: "GPU", chip: "NVIDIA L40S", memory: "48 GB GDDR6", perf: "362 TFLOPs", uptime: "99.9%", price: "0.92", status: "Available now", util: 79 },
  { arch: "Ampere", id: "a100-sgp-09", region: "Singapore, APAC", kind: "GPU", chip: "NVIDIA A100", memory: "80 GB HBM2e", perf: "624 TFLOPs", uptime: "99.9%", price: "1.42", status: "Available now", util: 86 },
  { arch: "Hopper", id: "h100-iad-04", region: "Ashburn, US-East", kind: "GPU", chip: "NVIDIA H100 SXM5", memory: "80 GB HBM3", perf: "989 TFLOPs", uptime: "99.9%", price: "2.18", status: "Available now", util: 94 },
  { arch: "Instinct", id: "mi300x-pdx-02", region: "Portland, US-West", kind: "GPU", chip: "AMD MI300X", memory: "192 GB HBM3", perf: "1307 TFLOPs", uptime: "99.9%", price: "2.74", status: "Available now", util: 90 },
  { arch: "Hopper", id: "h200-tok-01", region: "Tokyo, APAC", kind: "GPU", chip: "NVIDIA H200 NVL", memory: "141 GB HBM3e", perf: "1979 TFLOPs", uptime: "99.9%", price: "3.10", status: "Reserved", util: 0 },
];

export const FILTER_COUNTS = [
  { label: "GPU", count: 6 },
  { label: "TPU", count: 4 },
  { label: "NPU / ASIC", count: 4 },
];

export type LogKind = "SETTLE" | "RENT" | "BOND" | "DEPLOY" | "STREAM";

export const LOG_NODES = [
  "h100-iad-04", "apex3-bln-08", "wse3-aus-01", "a100-sgp-09",
  "tpu-v5e-clb-02", "l40s-syd-03", "mi300x-pdx-02", "h200-tok-01",
];

export const LOG_KINDS: LogKind[] = ["SETTLE", "RENT", "BOND", "DEPLOY", "STREAM"];

export const LOG_AMOUNTS = ["0.0021", "0.1207", "0.0588", "0.0167", "0.0034", "1.2400", "0.0085"];

export const MODEL_SUITE = [
  { tag: "TXT", title: "Text generation", desc: "High-throughput LLMs — instruction-tuned, 128k ctx, streaming.", chip: "H100 ×2", price: "from $3.20/hr" },
  { tag: "IMG", title: "Image synthesis", desc: "State-of-the-art 1024² generation, LoRA-ready, 12s/batch.", chip: "RTX 4090", price: "from $0.41/hr" },
  { tag: "AGT", title: "Autonomous agents", desc: "On-chain agents that transact, coordinate & self-execute on Robinhood Chain.", chip: "A100 80G", price: "from $1.42/hr" },
  { tag: "OS", title: "AI-native OS", desc: "One runtime orchestrating every model, agent & inference job.", chip: "L40S", price: "from $0.92/hr" },
];

export type PriceRow = {
  chip: string;
  spec: string;
  vortano: string;
  aws: string;
  gcp: string;
  azure: string;
};

export const PRICE_TABLE: PriceRow[] = [
  { chip: "H100 80GB", spec: "SXM5", vortano: "$2.18", aws: "$12.29", gcp: "$11.06", azure: "$10.96" },
  { chip: "A100 80GB", spec: "PCIe", vortano: "$1.42", aws: "$5.12", gcp: "$4.32", azure: "$4.96" },
  { chip: "TPU v5p", spec: "1×chip", vortano: "$3.42", aws: "—", gcp: "$8.95", azure: "—" },
  { chip: "L40S 48GB", spec: "PCIe", vortano: "$0.92", aws: "$3.78", gcp: "$3.21", azure: "$3.42" },
  { chip: "RTX 4090", spec: "24GB", vortano: "$0.41", aws: "—", gcp: "—", azure: "—" },
];

export const MECHANISM = [
  { num: "I", title: "Connect & deposit", desc: "Bring any EVM wallet. Deposit USDG, USDC, ETH or VRTN into the rental escrow. No KYC for jobs under 10k USDG." },
  { num: "II", title: "Pick an accelerator", desc: "Filter nodes by class, memory, region, framework. Every provider posts a slashing bond — bad nodes get burned." },
  { num: "III", title: "Stream payments", desc: "Pay per second from escrow. Pause, resume or fail-over to a hot replica. Receipts settle automatically on Robinhood Chain." },
];

export const PROVIDER_STEPS = [
  { n: "1", title: "Install the agent", desc: "curl vortano.org/agent | sh — runs in a container, isolated from your host." },
  { n: "2", title: "Post a bond in VRTN", desc: "~$200 worth of VRTN per accelerator. Recovered when you exit the network gracefully." },
  { n: "3", title: "Set your floor price", desc: "The market discovers price — you set a refusal threshold below which jobs aren't accepted." },
  { n: "4", title: "Stream revenue", desc: "USDG streamed to your wallet every block via Superfluid. Withdraw any time." },
];

export const TOKEN_DIST = [
  { label: "Node providers", pct: 38 },
  { label: "Public sale", pct: 22 },
  { label: "DAO treasury", pct: 18 },
  { label: "Core contributors", pct: 14 },
  { label: "Liquidity & LPs", pct: 8 },
];

export const ROADMAP = [
  {
    phase: "Q1 · 2025", status: "Shipped", title: "Genesis",
    items: ["Whitepaper v1", "Testnet on Robinhood Chain Sepolia", "First 100 providers", "Seed round closed"],
  },
  {
    phase: "Q4 · 2025", status: "Shipped", title: "Mainnet",
    items: ["Mainnet on Robinhood Chain", "GPU marketplace live", "Spearbit audit", "$8M TVL bonded"],
  },
  {
    phase: "Q2 · 2026", status: "In progress", title: "Expansion",
    items: ["Hybrid NPU + GPU router", "AI model suite (text + image)", "$VRTN token launch (LBP)", "Live shell terminal"],
  },
  {
    phase: "Q4 · 2026", status: "Planned", title: "Sovereignty",
    items: ["Autonomous on-chain agents", "AI-native OS", "zk-fraud proofs for inference", "DAO governance v1"],
  },
];

export const FAQ = [
  {
    q: "What is Vortano?",
    a: "A Robinhood Chain-native compute layer that turns idle GPU & NPU capacity into a permissionless supercomputer for the AI age. Providers monetize their hardware while developers tap inference, training and autonomous agents — all settled trustlessly in USDG on Robinhood Chain, with each provider posting a VRTN bond that gets slashed for misbehavior.",
  },
  {
    q: "Is this really on-chain?",
    a: "Every rental intent, agent transaction, payment stream and provider claim is recorded on Robinhood Chain mainnet, and every output is cryptographically attributable. Inference itself runs off-chain on provider hardware, but optional (zk) fraud proofs are available for jobs that need full verification.",
  },
  {
    q: "How can it be 5–10× cheaper than AWS?",
    a: "Our hybrid routing engine sends ultra-efficient edge inference to NPUs and heavy training to GPUs, with load-balancing that pushes cost-per-token to industry-leading lows. No data-center markup, no corporate margin — price is discovered by an order book, not a board meeting.",
  },
  {
    q: "Which token do you pay with?",
    a: "USDG — the Global Dollar, native to Robinhood Chain — is the default. You can also pay with USDC, ETH or VRTN via auto-swap. Providers receive USDG streamed directly from escrow to their wallet via Superfluid.",
  },
  {
    q: "What is the role of $VRTN?",
    a: "Three things: (1) provider bond — slashed for misbehavior, (2) governance — voting on protocol parameters, and (3) revenue share — stakers earn a slice of protocol fees.",
  },
  {
    q: "Do I need KYC?",
    a: "Not for jobs under 10,000 USDG. Providers under 100 TFLOPs aggregate are also KYC-free. Above that, we integrate with zk-KYC providers for optional compliance.",
  },
];

export const NAV = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Chat", href: "#chat" },
  { label: "Shell", href: "#shell" },
  { label: "AI Wallet", href: "#wallet" },
  { label: "Platformpaper", href: "/platformpaper" },
];

export const FOOTER = {
  protocol: ["Marketplace", "Provider portal", "Slashing & bonds", "VRTN token"],
  developers: ["Ship log", "Whitepaper", "CLI · voltra-rent", "SDK (TS / Py)", "Contracts on Robinscan"],
  community: ["GitHub", "Discord", "X / Twitter", "Mirror", "DAO forum"],
};
