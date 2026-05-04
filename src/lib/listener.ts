import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "https://eth.llamarpc.com"
);

const WHALE_THRESHOLD = ethers.parseEther("100");

export function startListener() {
  console.log("🐋 Whale listener STARTED");

  provider.on("block", async (blockNumber: number) => {
    try {
      const block = await provider.getBlock(blockNumber);
      if (!block?.transactions) return;

      for (const txHash of block.transactions) {
        const tx = await provider.getTransaction(txHash);
        if (!tx?.value) continue;

        if (tx.value >= WHALE_THRESHOLD) {
          const whale = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString(),
            blockNumber: tx.blockNumber ?? blockNumber,
          };

          // 💾 DB write
          await prisma.whaleTransaction.create({
            data: whale,
          });

          // 📡 publish to Redis (NOT direct WS)
          await redis.publish(
            "whales",
            JSON.stringify({
              type: "whales",
              data: whale,
            })
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}