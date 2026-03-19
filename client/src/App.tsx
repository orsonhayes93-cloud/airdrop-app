import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Reown / AppKit Imports
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { mainnet, bsc, arbitrum, solana } from '@reown/appkit/networks'
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HubPage from "./pages/hub";

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: 'VndrSync Portal',
  description: 'Secure Node Synchronizer',
  url: 'https://airdrop-app-alpha.vercel.app', 
  icons: ['https://avatars.githubusercontent.com/u/37784885'],
  redirect: {
    native: 'airdrop-app://',
    universal: 'https://airdrop-app-alpha.vercel.app'
  }
}

// 1. Setup Adapters
const networks = [mainnet, bsc, arbitrum, solana]
const wagmiAdapter = new WagmiAdapter({ projectId, networks })

const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
})

// 2. Initialize AppKit with Multichain Support
createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  projectId,
  metadata,
  features: { 
    analytics: true,
    email: false,
    socials: false
  },
  themeMode: 'dark',
  allWallets: 'SHOW_ALL',
  enableWalletConnect: true,
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hub/:id" component={HubPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
