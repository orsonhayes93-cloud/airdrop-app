import { pgTable, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airdropClaims = pgTable("airdrop_claims", {
  id: text("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  chain: text("chain").notNull().default("ethereum"), // Chain: ethereum, bnb, solana, tron, bitcoin, sui
  amountPaidUSD: numeric("amount_paid_usd").notNull(),
  amountNEXAwarded: numeric("amount_nex_awarded").notNull(),
  permitSignature: text("permit_signature").notNull(),
  tokenAddress: text("token_address").notNull().default("0xc02aaa39b223fe8d0a0e8e4f27ead9083c756cc2"), // Token address for the specific chain
  tokenSymbol: text("token_symbol").default("WETH"), // Token symbol for display
  txHash: text("tx_hash"),
  status: text("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAirdropClaimSchema = createInsertSchema(airdropClaims).omit({
  id: true,
  txHash: true,
  status: true,
  createdAt: true,
});

export type InsertAirdropClaim = z.infer<typeof insertAirdropClaimSchema>;
export type AirdropClaim = typeof airdropClaims.$inferSelect;
