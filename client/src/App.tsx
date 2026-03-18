import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SwapPage from "@/pages/swap";
import StakePage from "@/pages/stake";
import AirdropPage from "@/pages/airdrop";

// 1. THIS IS THE CORRECT PATH FOR THE 10 HUBS
import HubPage from "./pages/hub"; 

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/swap" component={SwapPage} />
      <Route path="/stake" component={StakePage} />
      <Route path="/airdrop" component={AirdropPage} />
      
      {/* 2. THIS CONNECTS ALL 10 DIVISIONS AUTOMATICALLY */}
      <Route path="/hub/:id" component={HubPage} /> 
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
