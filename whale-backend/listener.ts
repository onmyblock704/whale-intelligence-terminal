import { ethers } from "ethers";
import { updateWalletActivity } from "./lib/cluster";

const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || "https://eth.llamarpc.com"
);

const WHALE_THRESHOLD = ethers.parseEther("50");

export function startListener(broadcast: (data: any) => void) {
  console.log("🧠 On-chain listener active");

  provider.on("block", async (blockNumber) => {
    const block = await provider.getBlock(blockNumber, true);
    if (!block) return;

    for (const txHash of block.transactions) {
      const tx = await provider.getTransaction(txHash);
      if (!tx) continue;

      // 🐋 ETH WHALE
      if (tx.value && tx.value >= WHALE_THRESHOLD) {
        updateWalletActivity(tx.from, tx.to ?? undefined);

        broadcast({
          type: "whale_eth",
          data: {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString(),
            blockNumber,
          },
        });
      }

      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) continue;

      for (const log of receipt.logs) {
        // 🟢 ERC20
        if (
          log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        ) {
          const from = "0x" + log.topics[1].slice(26);
          const to = "0x" + log.topics[2].slice(26);

          updateWalletActivity(from, to, log.address);

          broadcast({
            type: "erc20_transfer",
            data: {
              token: log.address,
              from,
              to,
              txHash,
              blockNumber,
            },
          });
        }

        // 🔴 DEX SWAP (basic)
        if (
          log.topics[0] ===
          "0xd78ad95fa46c994b6551d0da85fc275fe613c5e7a3b0e7d8c6b9a6b2b2a2b5b8"
        ) {
          updateWalletActivity(tx.from, undefined, log.address);

          broadcast({
            type: "dex_swap",
            data: {
              pool: log.address,
              txHash,
              blockNumber,
            },
          });
        }
      }
    }
  });
}