import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Globe, Shield, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NETWORKS = [
  { id: "eth", name: "Ethereum", color: "bg-blue-500" },
  { id: "arb", name: "Arbitrum", color: "bg-cyan-500" },
  { id: "opt", name: "Optimism", color: "bg-red-500" },
  { id: "poly", name: "Polygon", color: "bg-purple-500" },
  { id: "base", name: "Base", color: "bg-blue-600" },
];

export function NetworkSelector() {
  const [activeNetwork, setActiveNetwork] = useState(NETWORKS[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 gap-2 bg-secondary/20 border-border/50 hover:bg-secondary/40 hover:border-primary/30 transition-all"
        >
          <div className={`w-2 h-2 rounded-full ${activeNetwork.color} shadow-[0_0_8px_currentColor]`} />
          <span className="hidden sm:inline">{activeNetwork.name}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-border">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Select Network
        </div>
        {NETWORKS.map((net) => (
          <DropdownMenuItem
            key={net.id}
            onClick={() => setActiveNetwork(net)}
            className="flex items-center gap-3 py-3 cursor-pointer focus:bg-secondary/50"
          >
            <div className={`w-2 h-2 rounded-full ${net.color}`} />
            <span className="flex-1 font-medium">{net.name}</span>
            {activeNetwork.id === net.id && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <div className="p-2 mt-2 border-t border-border/50">
           <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-2">
             <Wifi className="w-3 h-3 text-green-500" />
             <span>All Systems Operational</span>
           </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
