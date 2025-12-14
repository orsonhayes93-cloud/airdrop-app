import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InfoPages } from "@/components/layout/info-pages";
import { DeFiCard } from "@/components/defi/defi-card";
import { StatsTicker } from "@/components/defi/stats-ticker";
import { PortfolioChart } from "@/components/defi/portfolio-chart";
import { OnboardingModal } from "@/components/defi/onboarding-modal";
import { CommandPalette } from "@/components/defi/command-palette";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/ui/particles-background";
import { AIChatWidget } from "@/components/defi/ai-chat-widget";
import { ArrowRight, ShieldCheck, Zap, Globe, Lock } from "lucide-react";
import bgImage from "@assets/generated_images/abstract_cyberpunk_defi_background_with_neon_green_grid_lines_and_dark_void.png";

export default function Home() {
  const [activeTheme, setActiveTheme] = useState("default");
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const checkWallet = () => {
      try {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
          setWalletConnected(false);
          return;
        }
        // Check multiple ways to detect connected account
        const account = ethereum.selectedAddress || (ethereum._state && ethereum._state.accounts && ethereum._state.accounts[0]);
        const isConnected = !!(account && typeof account === 'string' && account.trim().length > 0 && account !== '0x');
        setWalletConnected(isConnected);
      } catch (e) {
        setWalletConnected(false);
      }
    };
    
    checkWallet();
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", checkWallet);
    }
    window.addEventListener("accountsChanged", checkWallet);
    
    return () => {
      window.removeEventListener("accountsChanged", checkWallet);
      if ((window as any).ethereum?.removeListener) {
        (window as any).ethereum.removeListener("accountsChanged", checkWallet);
      }
    };
  }, []);

  const toggleTheme = (theme: string) => {
    setActiveTheme(theme);
    document.body.className = ""; // Reset
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Layers */}
      <div className="fixed inset-0 z-[-2]">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      <ParticlesBackground />

      <Navbar />
      <OnboardingModal />
      <CommandPalette />
      <AIChatWidget />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4">
          <div className="container mx-auto grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Text (5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-8 pt-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                V2.0 Protocol Live
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                Trade with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 text-glow">Absolute</span> <br/>
                <span className="text-primary text-glow">Precision</span>
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-md font-light">
                The next generation of decentralized trading. Zero slippage, MEV protection, and institutional-grade liquidity for everyone.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold text-md h-12 px-8 rounded-full">
                  Start Trading
                </Button>
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold text-md h-12 px-8 rounded-full backdrop-blur-md">
                  View Documentation
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-border/30">
                <div>
                  <div className="text-3xl font-mono font-bold text-white">$4.2B+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-bold text-white">1.2M+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Trades</div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-bold text-primary text-glow">0.01s</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Latency</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Dashboard (7 cols) */}
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
               {/* Chart Card */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="h-full min-h-[400px]"
               >
                 <PortfolioChart />
               </motion.div>

               {/* Swap Card */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
               >
                 <DeFiCard walletConnected={walletConnected} />
               </motion.div>
            </div>
          </div>
        </section>

        <StatsTicker />

        {/* Features Grid */}
        <section className="py-24 px-4 relative overflow-hidden">
           <div className="container mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-4xl font-display font-bold mb-4">Elite Features</h2>
               <p className="text-muted-foreground max-w-2xl mx-auto">
                 Built for power users who demand speed, security, and deep liquidity.
               </p>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
               {[
                 { title: "MEV Protection", icon: ShieldCheck, desc: "Transactions are routed through private channels to prevent front-running." },
                 { title: "Flash Execution", icon: Zap, desc: "Sub-second confirmation times with our optimized L2 routing engine." },
                 { title: "Cross-Chain", icon: Globe, desc: "Seamlessly bridge and swap assets across 12+ networks in one click." },
               ].map((f, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className="p-8 rounded-3xl bg-secondary/20 border border-white/5 backdrop-blur-sm hover:bg-secondary/40 transition-all group"
                 >
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                     <f.icon className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold mb-3 font-display">{f.title}</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     {f.desc}
                   </p>
                 </motion.div>
               ))}
             </div>
           </div>
        </section>

        {/* Theme Switcher Demo */}
        <section className="py-12 px-4 border-t border-border/30">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest">Choose Your Interface</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => toggleTheme('default')}
                className={`border-primary/50 ${activeTheme === 'default' ? 'bg-primary/20' : ''}`}
              >
                Neon Green (Default)
              </Button>
              <Button 
                variant="outline" 
                onClick={() => toggleTheme('matrix')}
                className={`border-green-500/50 text-green-500 ${activeTheme === 'matrix' ? 'bg-green-500/20' : ''}`}
              >
                Matrix
              </Button>
              <Button 
                variant="outline" 
                onClick={() => toggleTheme('purple')}
                className={`border-purple-500/50 text-purple-500 ${activeTheme === 'purple' ? 'bg-purple-500/20' : ''}`}
              >
                Purple Haze
              </Button>
            </div>
          </div>
        </section>

        <InfoPages />
        <Footer />

      </main>
    </div>
  );
}
