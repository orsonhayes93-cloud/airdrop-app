import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, ChevronDown, Settings, ArrowRight, Globe, FileText, Users, Mail, HelpCircle, Coins, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NetworkSelector } from "@/components/defi/network-selector";
import { WalletConnectModal } from "@/components/defi/wallet-connect-modal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const useClickSound = () => {
  const play = () => { };
  return play;
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const playClick = useClickSound();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AUTO-RESTORE ON REFRESH
  useEffect(() => {
    if (localStorage.getItem("__wallet_connected") === "true") {
      const savedAddr = localStorage.getItem("__wallet_address");
      if (savedAddr) {
        (window as any).__wallet_connected = true;
        (window as any).__wallet_address = savedAddr;
        setWalletConnected(true);
        setWalletAddress(savedAddr);
      }
    }
  }, []);

  // MULTI-WALLET CONNECT - Try all 6 wallets
  const connectWallet = async () => {
    try {
      // Try MetaMask first (Ethereum/BNB)
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          if (accounts && accounts.length > 0) {
            const address = accounts[0].toLowerCase();
            (window as any).__wallet_connected = true;
            (window as any).__wallet_address = address;
            localStorage.setItem("__wallet_connected", "true");
            localStorage.setItem("__wallet_address", address);
            setWalletConnected(true);
            setWalletAddress(address);
            ethereum.request({ method: "eth_getBalance", params: [address, "latest"] })
              .then((bal: string) => {
                const eth = parseInt(bal, 16) / 1e18;
                setWalletBalance(eth.toFixed(4));
              });
            toast.success("Wallet connected", { description: `${address.slice(0, 6)}...${address.slice(-4)}` });
            return;
          }
        } catch (e) {}
      }

      // Try Phantom (Solana)
      const phantom = (window as any).solana;
      if (phantom?.isPhantom) {
        try {
          const response = await phantom.connect();
          const address = response.publicKey.toString();
          (window as any).__wallet_connected = true;
          (window as any).__wallet_address = address;
          localStorage.setItem("__wallet_connected", "true");
          localStorage.setItem("__wallet_address", address);
          setWalletConnected(true);
          setWalletAddress(address);
          toast.success("Phantom connected", { description: `${address.slice(0, 6)}...${address.slice(-4)}` });
          return;
        } catch (e) {}
      }

      // Try TronLink (Tron)
      const tronLink = (window as any).tronLink;
      if (tronLink?.ready) {
        try {
          const address = tronLink.tronWeb.defaultAddress.base58;
          if (address) {
            (window as any).__wallet_connected = true;
            (window as any).__wallet_address = address;
            localStorage.setItem("__wallet_connected", "true");
            localStorage.setItem("__wallet_address", address);
            setWalletConnected(true);
            setWalletAddress(address);
            toast.success("TronLink connected", { description: `${address.slice(0, 6)}...${address.slice(-4)}` });
            return;
          }
        } catch (e) {}
      }

      // If none found, show wallet selector modal
      setShowWalletModal(true);
    } catch (err: any) {
      if (err.code !== 4001) {
        toast.error("Connection failed");
      }
    }
  };

  const disconnectWallet = () => {
    (window as any).__wallet_connected = false;
    (window as any).__wallet_address = "";
    localStorage.removeItem("__wallet_connected");
    localStorage.removeItem("__wallet_address");
    setWalletConnected(false);
    setWalletAddress("");
    setWalletBalance("");
    // Notify claim button of disconnect
    window.dispatchEvent(new Event("wallet-disconnected"));
    toast.success("Wallet disconnected");
  };

  return (
    <>
      <WalletConnectModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={connectWallet}
      />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 h-16" 
            : "bg-transparent h-20"
        }`}
      >
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={playClick}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
              <div className="w-4 h-4 bg-background transform rotate-45" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider">NEXUS</span>
          </div>

          {/* Desktop Nav - Mega Menu – 100% YOUR ORIGINAL */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-primary uppercase tracking-wide font-medium text-xs">Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-card/95 backdrop-blur-xl border-primary/20">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md" href="#about">
                            <div className="mb-2 mt-4 text-lg font-bold font-display">About Nexus</div>
                            <p className="text-sm leading-tight text-muted-foreground">Learn about our mission to democratize decentralized finance for everyone.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#contact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center gap-2 text-sm font-medium leading-none"><Mail className="w-4 h-4" /> Contact Us</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Get in touch with our support team.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#tokenomics" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="flex items-center gap-2 text-sm font-medium leading-none"><Coins className="w-4 h-4" /> Tokenomics</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Understand the $NEX token economy.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-primary uppercase tracking-wide font-medium text-xs">Trade</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-card/95 backdrop-blur-xl border-primary/20">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md" href="/">
                            <div className="mb-2 mt-4 text-lg font-bold font-display">Nexus Pro</div>
                            <p className="text-sm leading-tight text-muted-foreground">Advanced trading terminal with real-time charts and order books.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/swap" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Swap</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Instant token exchanges at best rates.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/stake" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Stake</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Earn rewards by staking NEX.</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent hover:text-primary uppercase tracking-wide font-medium text-xs">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card/95 backdrop-blur-xl border-primary/20">
                      {[
                        { title: "Whitepaper", desc: "Read the technical documentation.", icon: FileText, href: "#whitepaper" },
                        { title: "FAQ", desc: "Common questions answered.", icon: HelpCircle, href: "#faq" },
                        { title: "Audits", desc: "Security reports and verifications.", icon: ShieldCheck, href: "#audits" },
                        { title: "Community", desc: "Join our Discord and Twitter.", icon: Users, href: "#community" },
                      ].map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a href={item.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                <item.icon className="w-4 h-4 text-primary" />
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.desc}</p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <NetworkSelector />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>Chinese</DropdownMenuItem>
                <DropdownMenuItem>Korean</DropdownMenuItem>
                <DropdownMenuItem>Japanese</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              {walletConnected && walletBalance && (
                <div className="text-xs font-mono px-3 py-1 rounded bg-primary/20 text-primary">
                  {walletBalance} ETH
                </div>
              )}
              {walletConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 border-none"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border">
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                      {walletAddress}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={disconnectWallet} className="text-red-500 focus:text-red-500">
                      Disconnect Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 border-none"
                  onClick={connectWallet}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu – 100% YOUR ORIGINAL */}
          <div className="md:hidden flex items-center gap-2">
            {walletConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 border-none"
                    size="sm"
                  >
                    <Wallet className="w-4 h-4 mr-1" />
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {walletAddress}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={disconnectWallet} className="text-red-500 focus:text-red-500">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 border-none"
                onClick={connectWallet}
                size="sm"
              >
                <Wallet className="w-4 h-4 mr-1" />
                Connect
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-[80vh] bg-background/95 backdrop-blur-xl border-b border-border overflow-y-auto">
                <div className="flex flex-col gap-6 mt-10">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Company</h3>
                    <a href="#about" className="flex items-center gap-2 text-lg font-display font-medium hover:text-primary transition-colors"><Users className="w-5 h-5" /> About Us</a>
                    <a href="#contact" className="flex items-center gap-2 text-lg font-display font-medium hover:text-primary transition-colors"><Mail className="w-5 h-5" /> Contact</a>
                    <a href="#tokenomics" className="flex items-center gap-2 text-lg font-display font-medium hover:text-primary transition-colors"><Coins className="w-5 h-5" /> Tokenomics</a>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resources</h3>
                    <a href="#faq" className="flex items-center gap-2 text-lg font-display font-medium hover:text-primary transition-colors"><HelpCircle className="w-5 h-5" /> FAQ</a>
                    <a href="#whitepaper" className="flex items-center gap-2 text-lg font-display font-medium hover:text-primary transition-colors"><FileText className="w-5 h-5" /> Whitepaper</a>
                  </div>

                  <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Network</span>
                      <NetworkSelector />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Language</span>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {walletConnected && walletBalance && (
                      <div className="text-center text-sm font-mono px-3 py-2 rounded bg-primary/20 text-primary">
                        Balance: {walletBalance} ETH
                      </div>
                    )}
                    {walletConnected ? (
                      <>
                        <Button 
                          className="w-full bg-primary text-primary-foreground font-bold"
                          onClick={disconnectWallet}
                          variant="destructive"
                        >
                          Disconnect {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-primary text-primary-foreground font-bold"
                        onClick={connectWallet}
                      >
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
