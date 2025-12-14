import { useState, useEffect } from "react";
import { Wallet, Gift, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import ClaimButton from "@/components/defi/claim-button";
import ChainSelector from "@/components/defi/chain-selector";
import { detectAllWallets } from "@/utils/wallet-detection";
import type { ChainName } from "@shared/chains";

export default function AirdropPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedChains, setConnectedChains] = useState<ChainName[]>([]);
  const [selectedChain, setSelectedChain] = useState<ChainName>("ethereum");

  useEffect(() => {
    const detectWallets = async () => {
      try {
        const wallets = await detectAllWallets();
        const chains = wallets.map(w => w.chain);
        const uniqueChains = Array.from(new Set(chains)) as ChainName[];
        setConnectedChains(uniqueChains);
        setWalletConnected(uniqueChains.length > 0);
        
        // Always select the first available chain, or keep current if still available
        if (uniqueChains.length > 0) {
          if (uniqueChains.includes(selectedChain)) {
            // Current chain is still available, keep it
            return;
          } else {
            // Current chain not available, switch to first available
            setSelectedChain(uniqueChains[0]);
          }
        }
      } catch (e) {
        setWalletConnected(false);
        setConnectedChains([]);
      }
    };
    
    detectWallets();
    const interval = setInterval(detectWallets, 2000);
    
    return () => clearInterval(interval);
  }, [selectedChain]);

  return (
    <div className="min-h-screen w-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      {!walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40 px-4"
        >
          <Card className="bg-yellow-500/10 border border-yellow-500/30 p-4 flex items-center gap-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Connect your wallet to claim your airdrop
            </p>
          </Card>
        </motion.div>
      )}
      <main className="pt-24 pb-12 w-full">
        <div className="w-full max-w-4xl mx-auto px-2 md:px-4 space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              NEX Airdrop
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Claim your allocation of the NEX governance token from Season 2 airdrop
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-gradient-to-br from-blue-500/20 to-transparent border-blue-500/20 p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Allocation</p>
                    <h3 className="text-3xl font-bold">92,000</h3>
                  </div>
                  <Gift className="w-8 h-8 text-blue-400 opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">NEX tokens to claim</p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gradient-to-br from-purple-500/20 to-transparent border-purple-500/20 p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Value</p>
                    <h3 className="text-3xl font-bold">~$276K</h3>
                  </div>
                  <Lock className="w-8 h-8 text-purple-400 opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">At current price</p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gradient-to-br from-green-500/20 to-transparent border-green-500/20 p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Claim Window</p>
                    <h3 className="text-3xl font-bold">60 days</h3>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">From snapshot date</p>
              </Card>
            </motion.div>
          </div>

          {/* Main Claim Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 rounded-3xl" />
              
              <Card className="bg-card/90 backdrop-blur-xl border-border p-6 rounded-3xl shadow-2xl relative z-10 text-center space-y-4">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto"
                >
                  <Wallet className="w-8 h-8 text-primary" />
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold font-display mb-1">Claim Your Airdrop</h2>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to claim your NEX tokens
                  </p>
                </div>

                <div className="bg-secondary/30 rounded-xl p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Your Allocation:</span>
                    <span className="font-bold text-primary">92,000 NEX</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">USD Value:</span>
                    <span className="font-bold">~$276K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-bold text-green-400">✓ Eligible</span>
                  </div>
                </div>

                {walletConnected && (
                  <>
                    <ChainSelector
                      selectedChain={selectedChain}
                      onChainChange={setSelectedChain}
                      connectedWallets={connectedChains}
                      data-testid="chain-selector"
                    />
                    <div className="h-px bg-border/20" />
                  </>
                )}

                <ClaimButton chain={selectedChain} />

                <div className="text-xs text-muted-foreground border-t border-border/50 pt-3">
                  Snapshot taken at Block #1829304 on Nov 15, 2025
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-secondary/20 border-border/50 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  How it Works
                </h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Connect your wallet</li>
                  <li>Check your eligibility</li>
                  <li>Claim your NEX tokens</li>
                  <li>Tokens arrive instantly</li>
                </ol>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-secondary/20 border-border/50 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Important Info
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Claim within 60 days</li>
                  <li>Requires MetaMask or Web3 wallet</li>
                  <li>Gas fees apply (network dependent)</li>
                  <li>Check eligible chains</li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
