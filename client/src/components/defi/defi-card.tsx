import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Settings, Info, ChevronDown, RefreshCw, Search, Wallet, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import ClaimButton from "./claim-button";
import { StakeSwapButton } from "./claim-button";

// ... existing TOKENS ...
const TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "🔷", balance: "4.204" },
  { symbol: "USDC", name: "USD Coin", icon: "💵", balance: "1,240.50" },
  { symbol: "NEX", name: "Nexus", icon: "💠", balance: "500.00" },
  { symbol: "WBTC", name: "Wrapped BTC", icon: "₿", balance: "0.05" },
  { symbol: "SOL", name: "Solana", icon: "◎", balance: "0.00" },
  { symbol: "USDT", name: "Tether", icon: "₮", balance: "0.00" },
];

// Sub-component for the Swap Form (original logic)
function SwapForm({ openTokenModal, tokenFrom, setTokenFrom, tokenTo, setTokenTo, inputAmount, setInputAmount, outputAmount, isLoading, handleSwap, walletConnected }: any) {
  const maxBalance = parseFloat(tokenFrom.balance.replace(',', ''));
  const inputVal = parseFloat(inputAmount || "0");
  const isExceedingBalance = inputVal > maxBalance;

  return (
    <div className="space-y-2">
        {!walletConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-2 text-xs text-yellow-600 dark:text-yellow-400">
            Connect your wallet to swap tokens
          </div>
        )}
        {isExceedingBalance && inputAmount && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-2 text-xs text-red-600 dark:text-red-400">
            Amount exceeds balance
          </div>
        )}
        {/* From Section */}
        <div className="bg-secondary/30 rounded-2xl p-4 mb-2 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20 group/section">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase">From</span>
            <div className="flex items-center gap-2">
               <span className="text-xs text-muted-foreground font-mono">Balance: {tokenFrom.balance}</span>
               <button 
                 className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors"
                 onClick={() => setInputAmount(tokenFrom.balance.replace(',', ''))}
                 disabled={!walletConnected}
               >
                 MAX
               </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Input 
              type="number" 
              placeholder="0.0"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              disabled={!walletConnected}
              className="border-none bg-transparent text-3xl font-mono p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-[60%] disabled:opacity-50"
            />
            <Button 
              variant="outline" 
              className="rounded-full bg-card border-border hover:border-primary hover:bg-secondary pl-2 pr-3 gap-2 font-bold min-w-[110px] justify-between transition-all"
              onClick={() => openTokenModal("from")}
              disabled={!walletConnected}
            >
              <span className="text-lg">{tokenFrom.icon}</span>
              {tokenFrom.symbol}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            ≈ $ {inputAmount ? (parseFloat(inputAmount) * 3200).toLocaleString() : "0.00"}
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="relative h-4 flex justify-center items-center z-20">
          <Button 
            size="icon" 
            className="absolute bg-card border-4 border-background rounded-xl h-10 w-10 hover:scale-110 hover:rotate-180 transition-all duration-300 shadow-lg z-10"
            onClick={() => {
              const temp = tokenFrom;
              setTokenFrom(tokenTo);
              setTokenTo(temp);
              setInputAmount(outputAmount); // Crude approx
            }}
          >
            <ArrowDown className="w-4 h-4 text-primary" />
          </Button>
        </div>

        {/* To Section */}
        <div className="bg-secondary/30 rounded-2xl p-4 mt-2 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20 group/section">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase">To</span>
            <span className="text-xs text-muted-foreground font-mono">Balance: {tokenTo.balance}</span>
          </div>
          <div className="flex justify-between items-center">
            <Input 
              readOnly
              value={outputAmount}
              placeholder="0.0"
              className="border-none bg-transparent text-3xl font-mono p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-[60%] text-primary"
            />
            <Button 
              variant="outline" 
              className="rounded-full bg-card border-border hover:border-primary hover:bg-secondary pl-2 pr-3 gap-2 font-bold min-w-[110px] justify-between transition-all"
              onClick={() => openTokenModal("to")}
            >
              <span className="text-lg">{tokenTo.icon}</span>
              {tokenTo.symbol}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </div>
           <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>≈ $ {outputAmount ? (parseFloat(outputAmount) * 2200).toLocaleString() : "0.00"}</span>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-primary flex items-center gap-1 cursor-help hover:underline decoration-dotted">
                   No Slippage <Info className="w-3 h-3" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Trades are executed via CoW Protocol <br/> to prevent MEV and slippage.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Info Section */}
        <AnimatePresence>
          {inputAmount && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-2 overflow-hidden"
            >
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-mono">1 {tokenFrom.symbol} = 1.45 {tokenTo.symbol}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Network Cost</span>
                <span className="font-mono text-primary flex items-center gap-1">
                   ~$2.45 <span className="text-[10px] bg-primary/20 px-1 rounded text-primary">CHEAP</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <Button 
          className="w-full mt-6 h-14 text-lg font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-all duration-300 relative overflow-hidden"
          disabled={!inputAmount || isLoading || !walletConnected || isExceedingBalance}
          onClick={handleSwap}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
              <span>Swapping...</span>
            </div>
          ) : !walletConnected ? (
            "Connect Wallet"
          ) : !inputAmount ? (
            "Enter Amount"
          ) : isExceedingBalance ? (
            "Insufficient Balance"
          ) : (
            "Swap Now"
          )}
        </Button>
    </div>
  )
}

function StakeForm({ walletConnected }: any) {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState(30);
  const [isStaking, setIsStaking] = useState(false);
  const maxBalance = 500;
  const stakeAmount = parseFloat(amount || "0");
  const isExceedingBalance = stakeAmount > maxBalance;

  const handleStake = async () => {
    if (!walletConnected) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet to stake tokens",
      });
      return;
    }

    if (isExceedingBalance) {
      toast.error("Insufficient Balance", {
        description: `You can only stake up to ${maxBalance} NEX`,
      });
      return;
    }

    setIsStaking(true);
    
    // Show staking for 1 second before success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Staked successfully!", {
      description: `You staked ${amount} NEX for ${period} days.`,
      duration: 5000,
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#ffffff']
    });
    setIsStaking(false);
    setAmount("");
  };

  return (
    <div className="space-y-6 py-2">
      <div className="bg-secondary/20 rounded-xl p-4 border border-primary/10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Staking Pool</span>
          <span className="flex items-center gap-1 text-sm font-bold text-primary">
            <Sparkles className="w-3 h-3" /> 14.2% APY
          </span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="text-3xl">💠</div>
          <div>
            <div className="font-bold font-display text-lg">NEX Staking</div>
            <div className="text-xs text-muted-foreground">Earn compounding rewards</div>
          </div>
        </div>
      </div>

      {!walletConnected && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-600 dark:text-yellow-400">
          Connect your wallet to stake tokens
        </div>
      )}
      {isExceedingBalance && amount && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-600 dark:text-red-400">
          Amount exceeds balance
        </div>
      )}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
           <span>Amount to Stake</span>
           <span>Available: 500.00 NEX</span>
        </div>
        <div className="flex gap-2">
          <Input 
            type="number" 
            placeholder="0.0" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!walletConnected}
            className="bg-secondary/30 border-transparent font-mono text-lg disabled:opacity-50"
          />
          <Button 
            variant="outline" 
            onClick={() => setAmount("500")}
            disabled={!walletConnected}
          >
            Max
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs text-muted-foreground">
           <span>Lock Period</span>
           <span className="text-foreground">{period} Days</span>
        </div>
        <Slider 
          defaultValue={[30]} 
          max={365} 
          step={1} 
          className="py-2"
          onValueChange={(v) => setPeriod(v[0])}
        />
        <div className="flex justify-between text-xs">
           <span>30d</span>
           <span>90d</span>
           <span>180d</span>
           <span>365d</span>
        </div>
      </div>

      <div className="bg-secondary/30 rounded-lg p-3 text-xs space-y-1">
         <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Rewards</span>
            <span className="font-mono text-primary">{(parseFloat(amount || "0") * 0.142 * (period/365)).toFixed(2)} NEX</span>
         </div>
         <div className="flex justify-between">
            <span className="text-muted-foreground">Unlock Date</span>
            <span className="font-mono text-foreground">Dec 24, 2025</span>
         </div>
      </div>

      <Button 
        className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
        onClick={handleStake}
        disabled={!amount || !walletConnected || isExceedingBalance || isStaking}
      >
        {isStaking ? (
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            <span>Staking...</span>
          </div>
        ) : !walletConnected ? (
          "Connect Wallet"
        ) : !amount ? (
          "Enter Amount"
        ) : isExceedingBalance ? (
          "Insufficient Balance"
        ) : (
          "Stake Tokens"
        )}
      </Button>
    </div>
  )
}

function AirdropForm({ walletConnected }: any) {
  return (
    <div className="py-8 text-center space-y-6">
       <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
         <Wallet className="w-10 h-10 text-primary" />
       </div>
       <div>
         <h3 className="text-xl font-bold font-display mb-2">Season 2 Airdrop</h3>
         <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
           Click the airdrop button to claim your airdrop
         </p>
       </div>
       
       <ClaimButton chain="ethereum" />

       <div className="text-xs text-muted-foreground pt-4 border-t border-border/50">
         Permit2 Powered
       </div>
    </div>
  )
}

export function DeFiCard({ walletConnected = false }: { walletConnected?: boolean }) {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenFrom, setTokenFrom] = useState(TOKENS[0]);
  const [tokenTo, setTokenTo] = useState(TOKENS[1]);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingSide, setSelectingSide] = useState<"from" | "to">("from");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock calculation
  useEffect(() => {
    if (!inputAmount) {
      setOutputAmount("");
      return;
    }
    const val = parseFloat(inputAmount);
    if (isNaN(val)) return;
    
    // Mock price impact
    setOutputAmount((val * 1.45).toFixed(4));
  }, [inputAmount]);

  const handleSwap = () => {
    // Guard: Check wallet connection first
    if (!walletConnected) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet to swap tokens",
      });
      return;
    }

    const inputVal = parseFloat(inputAmount || "0");
    const maxBalance = parseFloat(tokenFrom.balance.replace(',', ''));
    
    if (inputVal > maxBalance) {
      toast.error("Insufficient Balance", {
        description: `You can only swap up to ${tokenFrom.balance} ${tokenFrom.symbol}`,
      });
      return;
    }

    setIsLoading(true);
    // Show swapping for 1 second before success
    setTimeout(() => {
      setIsLoading(false);
      setInputAmount("");
      setOutputAmount("");
      
      // Confetti effect!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#ffffff', '#00ff00']
      });

      toast.success(`Swapped ${inputAmount} ${tokenFrom.symbol} for ${outputAmount} ${tokenTo.symbol}`, {
        description: "Transaction confirmed on-chain.",
        duration: 5000,
        action: {
          label: "View Details",
          onClick: () => console.log("Undo"),
        },
      });

    }, 1000);
  };

  const openTokenModal = (side: "from" | "to") => {
    setSelectingSide(side);
    setSearchQuery("");
    setIsTokenModalOpen(true);
  };

  const selectToken = (token: typeof TOKENS[0]) => {
    if (selectingSide === "from") {
      if (token.symbol === tokenTo.symbol) setTokenTo(tokenFrom);
      setTokenFrom(token);
    } else {
      if (token.symbol === tokenFrom.symbol) setTokenFrom(tokenTo);
      setTokenTo(token);
    }
    setIsTokenModalOpen(false);
  };

  const filteredTokens = TOKENS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto relative group"
    >
      {/* Glow Effect behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-accent opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 rounded-3xl" />

      <Card className="bg-card/90 backdrop-blur-xl border-border p-1 rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        <Tabs defaultValue="airdrop" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-transparent p-1 mb-2">
            <TabsTrigger value="airdrop" className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-primary font-bold">Airdrop</TabsTrigger>
            <TabsTrigger value="swap" className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-primary font-bold">Swap</TabsTrigger>
            <TabsTrigger value="stake" className="rounded-xl data-[state=active]:bg-secondary data-[state=active]:text-primary font-bold">Stake</TabsTrigger>
          </TabsList>
          
          <div className="p-5 pt-2">
            <TabsContent value="airdrop" className="mt-0 focus-visible:ring-0">
               <AirdropForm walletConnected={walletConnected} />
            </TabsContent>

            <TabsContent value="swap" className="mt-0 focus-visible:ring-0">
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">The swap feature is being enhanced and will be available soon.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stake" className="mt-0 focus-visible:ring-0">
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">The staking feature is being enhanced and will be available soon.</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {/* Token Selection Modal */}
      <Dialog open={isTokenModalOpen} onOpenChange={setIsTokenModalOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Select Token</DialogTitle>
          </DialogHeader>
          
          <div className="relative mt-2 mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or address" 
              className="pl-9 bg-secondary/50 border-transparent focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => selectToken(token)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{token.icon}</span>
                  <div className="text-left">
                    <div className="font-bold font-display">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{token.balance}</div>
                  {token.balance !== "0.00" && (
                    <div className="text-xs text-muted-foreground">≈ ${parseFloat(token.balance.replace(',', '')) * 100}</div>
                  )}
                </div>
              </button>
            ))}
            {filteredTokens.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tokens found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
