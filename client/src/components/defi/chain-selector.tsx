import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChainName } from "@shared/chains";
import { CHAINS } from "@shared/chains";

interface ChainSelectorProps {
  selectedChain: ChainName;
  onChainChange: (chain: ChainName) => void;
  connectedWallets: ChainName[];
}

export default function ChainSelector({
  selectedChain,
  onChainChange,
  connectedWallets,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chains = Object.values(CHAINS);
  const selectedChainInfo = CHAINS[selectedChain];

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-semibold text-foreground">Select Blockchain</label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {chains.map((chain) => {
          const isConnected = connectedWallets.includes(chain.id);
          const isSelected = selectedChain === chain.id;
          
          return (
            <button
              key={chain.id}
              onClick={() => {
                if (isConnected) {
                  onChainChange(chain.id);
                  setIsOpen(false);
                }
              }}
              disabled={!isConnected}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all border text-center",
                isSelected && isConnected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : isConnected
                  ? "bg-secondary text-secondary-foreground border-secondary hover:border-primary hover:shadow-md"
                  : "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50"
              )}
              data-testid={`chain-select-${chain.id}`}
              title={isConnected ? `${chain.name} wallet connected` : `${chain.name} wallet not connected`}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{chain.nativeToken}</span>
                {isConnected && <span className="text-xs">✓</span>}
              </div>
              <div className="text-xs text-muted-foreground">{chain.name}</div>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
        Currently on: <span className="font-bold text-foreground">{selectedChainInfo.name}</span>
      </div>
    </div>
  );
}
