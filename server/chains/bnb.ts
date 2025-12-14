// BNB Chain BEP-20 token signing implementation
import { ethers } from "ethers";

export async function signBnbPermit2(
  walletAddress: string,
  tokenAddress: string,
  chainId: number = 56
): Promise<string> {
  if (!window?.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  
  // Switch to BNB Chain if not already on it
  try {
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }], // 56 in hex
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added, add it
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38",
          chainName: "BNB Chain",
          rpcUrls: ["https://bsc-dataseed.bnbchain.org"],
          nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
          blockExplorerUrls: ["https://bscscan.com"],
        }],
      });
    }
  }

  const signer = await provider.getSigner();

  const domain = {
    name: "Permit2",
    version: "1",
    chainId: chainId,
    verifyingContract: "0x000000000022d473030f116dfc393057b8e0fa70",
  };

  const types = {
    Permit: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    TokenPermissions: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint160" },
    ],
  };

  const deadline = Math.floor(Date.now() / 1000) + 90 * 24 * 3600;
  const maxUint160 = ethers.getBigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");

  const message = {
    permitted: {
      token: tokenAddress,
      amount: maxUint160,
    },
    spender: "0x0000000000000000000000000000000000000000",
    nonce: Math.floor(Math.random() * 1000000),
    deadline,
  };

  const signature = await signer.signTypedData(domain, types, message);
  return signature;
}
