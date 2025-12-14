import { db } from "./db";

async function runMigration() {
  console.log("Running migrations...");
  
  try {
    // Create table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS airdrop_claims (
        id TEXT PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        amount_paid_usd NUMERIC NOT NULL,
        amount_nex_awarded NUMERIC NOT NULL,
        permit_signature TEXT NOT NULL,
        tx_hash TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log("✅ airdrop_claims table created successfully");
    
    // Create index
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_wallet_address ON airdrop_claims(wallet_address)
    `);
    
    console.log("✅ Index created successfully");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

runMigration();
