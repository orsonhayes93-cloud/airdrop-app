import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Settings, Info, ChevronDown, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "🔷", balance: "4.204" },
  { symbol: "USDC", name: "USD Coin", icon: "💵", balance: "1,240.50" },
  { symbol: "NEX", name: "Nexus", icon: "💠", balance: "500.00" },
  { symbol: "WBTC", name: "Wrapped BTC", icon: "₿", balance: "0.05" },
  { symbol: "SOL", name: "Solana", icon: "◎", balance: "0.00" },
  { symbol: "USDT", name: "Tether", icon: "₮", balance: "0.00" },
];

export function SwapCard() {
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setInputAmount("");
      setOutputAmount("");
    }, 2000);
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

      <Card className="bg-card/90 backdrop-blur-xl border-border p-6 rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <span className="font-display font-bold text-lg border-b-2 border-primary pb-1 cursor-pointer">Swap</span>
            <span className="font-display font-medium text-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Limit</span>
            <span className="font-display font-medium text-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Cross-Chain</span>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Rates</TooltipContent>
            </Tooltip>
            <Tooltip>
               <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Slippage Settings</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* From Section */}
        <div className="bg-secondary/30 rounded-2xl p-4 mb-2 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/20 group/section">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase">From</span>
            <div className="flex items-center gap-2">
               <span className="text-xs text-muted-foreground font-mono">Balance: {tokenFrom.balance}</span>
               <button 
                 className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors"
                 onClick={() => setInputAmount(tokenFrom.balance.replace(',', ''))}
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
              className="border-none bg-transparent text-3xl font-mono p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-[60%]"
            />
            <Button 
              variant="outline" 
              className="rounded-full bg-card border-border hover:border-primary hover:bg-secondary pl-2 pr-3 gap-2 font-bold min-w-[110px] justify-between transition-all"
              onClick={() => openTokenModal("from")}
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
              setInputAmount(outputAmount);
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
          disabled={!inputAmount || isLoading}
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
          ) : (
            !inputAmount ? "Enter Amount" : "Swap Now"
          )}
        </Button>
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
