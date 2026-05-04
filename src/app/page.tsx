"use client";

import { useEffect, useState, useMemo } from "react";

type Whale = {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: number;
};

export default function Home() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [ethPrice, setEthPrice] = useState(3000);

  // 🌐 REAL-TIME WEBSOCKET CONNECTION
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "whale") {
        setWhales((prev) => [msg.data, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  // 💰 PRICE FETCH (still REST, stable)
  useEffect(() => {
    const loadPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch {}
    };

    loadPrice();
  }, []);

  // 📊 TOTAL VOLUME
  const total = useMemo(() => {
    return whales.reduce((acc, w) => {
      return acc + (Number(w.value) / 1e18) * ethPrice;
    }, 0);
  }, [whales, ethPrice]);

  return (
    <div className="h-screen bg-black text-white font-mono flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between p-3 border-b border-zinc-800 text-xs">
        <span className="text-green-400 animate-pulse">
          ● WHALE INTELLIGENCE TERMINAL
        </span>
        <span>ETH ${ethPrice}</span>
        <span className="text-green-400">
          VOL ${total.toFixed(0)}
        </span>
      </div>

      {/* FEED */}
      <div className="flex-1 overflow-auto">
        {whales.map((w) => (
          <div
            key={w.hash}
            className="border-b border-zinc-900 p-3 hover:bg-zinc-900/40"
          >
            <div className="text-xs text-gray-400">{w.hash}</div>

            <div className="flex justify-between text-sm mt-1">
              <span>FROM {w.from.slice(0, 10)}...</span>
              <span>TO {w.to?.slice(0, 10) || "CONTRACT"}...</span>
            </div>

            <div className="text-green-400 mt-1">
              {(Number(w.value) / 1e18).toFixed(2)} ETH
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}