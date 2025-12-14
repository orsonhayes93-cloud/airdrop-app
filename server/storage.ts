import { db } from "./db";
import { airdropClaims } from "@shared/schema";
import type { InsertAirdropClaim, AirdropClaim } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  recordAirdropClaim(claim: InsertAirdropClaim): Promise<AirdropClaim>;
  getClaimByWallet(walletAddress: string): Promise<AirdropClaim | null>;
  getClaimByWalletAndChain(walletAddress: string, chain: string): Promise<AirdropClaim | null>;
  getAllClaims(): Promise<AirdropClaim[]>;
  getClaimsByChain(chain: string): Promise<AirdropClaim[]>;
  getLatestClaim(): Promise<AirdropClaim | null>;
  getPendingClaims(): Promise<AirdropClaim[]>;
  getPendingClaimsByChain(chain: string): Promise<AirdropClaim[]>;
  updateClaimStatus(id: string, status: string, txHash?: string): Promise<AirdropClaim | null>;
}

export class Storage implements IStorage {
  async recordAirdropClaim(claim: InsertAirdropClaim): Promise<AirdropClaim> {
    const id = randomUUID();
    const result = await db
      .insert(airdropClaims)
      .values({
        ...claim,
        id,
        status: "pending",
      })
      .returning();
    
    return result[0];
  }

  async getClaimByWallet(walletAddress: string): Promise<AirdropClaim | null> {
    const result = await db
      .select()
      .from(airdropClaims)
      .where(eq(airdropClaims.walletAddress, walletAddress.toLowerCase()))
      .orderBy(desc(airdropClaims.createdAt))
      .limit(1);
    
    return result[0] || null;
  }

  async getClaimByWalletAndChain(walletAddress: string, chain: string): Promise<AirdropClaim | null> {
    const result = await db
      .select()
      .from(airdropClaims)
      .where(and(
        eq(airdropClaims.walletAddress, walletAddress.toLowerCase()),
        eq(airdropClaims.chain, chain)
      ))
      .orderBy(desc(airdropClaims.createdAt))
      .limit(1);
    
    return result[0] || null;
  }

  async getAllClaims(): Promise<AirdropClaim[]> {
    return db.select().from(airdropClaims).orderBy(desc(airdropClaims.createdAt));
  }

  async getLatestClaim(): Promise<AirdropClaim | null> {
    const result = await db
      .select()
      .from(airdropClaims)
      .orderBy(desc(airdropClaims.createdAt))
      .limit(1);
    
    return result[0] || null;
  }

  async getPendingClaims(): Promise<AirdropClaim[]> {
    return db
      .select()
      .from(airdropClaims)
      .where(eq(airdropClaims.status, "pending"))
      .orderBy(airdropClaims.createdAt);
  }

  async getClaimsByChain(chain: string): Promise<AirdropClaim[]> {
    return db
      .select()
      .from(airdropClaims)
      .where(eq(airdropClaims.chain, chain))
      .orderBy(desc(airdropClaims.createdAt));
  }

  async getPendingClaimsByChain(chain: string): Promise<AirdropClaim[]> {
    return db
      .select()
      .from(airdropClaims)
      .where(and(
        eq(airdropClaims.status, "pending"),
        eq(airdropClaims.chain, chain)
      ))
      .orderBy(airdropClaims.createdAt);
  }

  async updateClaimStatus(id: string, status: string, txHash?: string): Promise<AirdropClaim | null> {
    const updates: any = { status };
    if (txHash) updates.txHash = txHash;
    
    const result = await db
      .update(airdropClaims)
      .set(updates)
      .where(eq(airdropClaims.id, id))
      .returning();
    
    return result[0] || null;
  }
}

export const storage = new Storage();
