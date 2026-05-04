import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";
import { broadcastWhale } from "@/lib/ws";

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "https://eth.llamarpc.com"
);

const WHALE_THRESHOLD = ethers.parseEther("100");

export function startListener() {
  console.log("🐋 Whale listener STARTED");

  provider.on("block", async (blockNumber: number) => {
    const block = await provider.getBlock(blockNumber);
    if (!block) return;

    for (const txHash of block.transactions) {
      const tx = await provider.getTransaction(txHash);
      if (!tx || !tx.value) continue;

      if (tx.value >= WHALE_THRESHOLD) {
        const whale = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value.toString(),
          blockNumber,
        };

        // 💾 DB
        await prisma.whaleTransaction.create({
          data: {
            hash: whale.hash,
            from: whale.from,
            to: whale.to ?? "contract",
            value: whale.value,
            blockNumber: whale.blockNumber,
          },
        });

        // ⚡ REAL-TIME PUSH (THIS WAS MISSING)
        broadcastWhale(whale);

        console.log("🐋 Whale broadcasted:", whale.hash);
      }
    }
  });
}