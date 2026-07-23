import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marketplace } from "@/components/Marketplace";
import { NetworkPulse } from "@/components/NetworkPulse";
import { GlobalCoverage } from "@/components/GlobalCoverage";
import { ModelSuite } from "@/components/ModelSuite";
import { ShellTerminal } from "@/components/ShellTerminal";
import { Routing } from "@/components/Routing";
import { Mechanism } from "@/components/Mechanism";
import { Provider } from "@/components/Provider";
import { Wallet } from "@/components/Wallet";
import { Token } from "@/components/Token";
import { Roadmap } from "@/components/Roadmap";
import { Faq } from "@/components/Faq";
import { CtaFooter } from "@/components/CtaFooter";
import { GlitchOverlay } from "@/components/GlitchOverlay";
import { MarketProvider } from "@/components/MarketProvider";

export default function Home() {
  return (
    <MarketProvider>
      <main className="relative">
        <div className="bg-shine" aria-hidden />
        <div className="grain" aria-hidden />
        <GlitchOverlay />
        <Navbar />
        <Hero />
        <Marketplace />
        <NetworkPulse />
        <GlobalCoverage />
        <ModelSuite />
        <ShellTerminal />
        <Routing />
        <Mechanism />
        <Provider />
        <Wallet />
        <Token />
        <Roadmap />
        <Faq />
        <CtaFooter />
      </main>
    </MarketProvider>
  );
}
