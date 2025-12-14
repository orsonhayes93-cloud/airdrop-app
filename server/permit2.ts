import { ethers } from "ethers";

// Permit2 contract address on Mainnet
const PERMIT2_ADDRESS = "0x000000000022d473030f116dfc393057b8e0fa70";

// Permit2 ABI for executeUsingPermit2
const PERMIT2_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "amount", type: "uint160" },
          { name: "token", type: "address" },
        ],
        name: "transfer",
        type: "tuple",
      },
      { name: "signature", type: "bytes" },
    ],
    name: "permitTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export interface ExecuteCashoutParams {
  userWallet: string;
  developerWallet: string;
  permitSignature: string;
  token: string;
  amount: string; // in wei
  rpcUrl: string;
  developerPrivateKey: string;
}

/**
 * Execute a Permit2 transfer using the user's signature to collect funds
 */
export async function executeCashout(params: ExecuteCashoutParams): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(params.rpcUrl);
    const signer = new ethers.Wallet(params.developerPrivateKey, provider);

    console.log(`🔄 Executing Permit2 transfer...`);
    console.log(`   From: ${params.userWallet}`);
    console.log(`   To: ${params.developerWallet}`);
    console.log(`   Token: ${params.token}`);
    console.log(`   Amount: ${params.amount}`);

    // Create contract instance
    const permit2Contract = new ethers.Contract(
      PERMIT2_ADDRESS,
      PERMIT2_ABI,
      signer
    );

    // Prepare transfer data
    const transfer = {
      from: params.userWallet,
      to: params.developerWallet,
      amount: params.amount,
      token: params.token,
    };

    // Execute permitTransferFrom
    const tx = await permit2Contract.permitTransferFrom(
      transfer,
      params.permitSignature
    );

    console.log(`✅ Transaction submitted: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt?.blockNumber}`);

    return tx.hash;
  } catch (error) {
    console.error("❌ Permit2 execution error:", error);
    throw new Error(`Permit2 execution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get balance of a wallet for a specific token
 */
export async function getTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  rpcUrl: string
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // ERC20 ABI for balanceOf
  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
  ];

  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  const balance = await contract.balanceOf(walletAddress);

  return balance.toString();
}
