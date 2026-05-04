"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  // ⚡ WebSocket stream
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "whale") {
        setWhales((prev) => [msg.data, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  // 💰 ETH price
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch {}
    };

    load();
  }, []);

  // 🧠 SMART MONEY DETECTION
  const isSmartMoney = (w: Whale) => {
    const eth = Number(w.value) / 1e18;
    const usd = eth * ethPrice;

    // rule-based heuristic (can later become ML model)
    return eth > 50 || usd > 100000;
  };

  // 📊 CHART DATA
  const chartData = useMemo(() => {
    const map = new Map<number, number>();

    whales.forEach((w) => {
      const eth = Number(w.value) / 1e18;
      const bucket = Math.floor(w.blockNumber / 10) * 10;

      map.set(bucket, (map.get(bucket) || 0) + eth);
    });

    return Array.from(map.entries())
      .map(([block, value]) => ({ block, value }))
      .slice(-20);
  }, [whales]);

  const totalUsd = useMemo(() => {
    return whales.reduce((acc, w) => {
      return acc + (Number(w.value) / 1e18) * ethPrice;
    }, 0);
  }, [whales, ethPrice]);

  return (
    <div className="h-screen bg-black text-green-200 font-mono flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between p-3 border-b border-zinc-800 text-xs">
        <span className="text-green-400 animate-pulse">
          ● WHALE INTELLIGENCE TERMINAL
        </span>

        <span>ETH ${ethPrice.toFixed(2)}</span>

        <span className="text-green-400">
          FLOW ${totalUsd.toFixed(0)}
        </span>
      </div>

      {/* CHART */}
      <div className="h-48 border-b border-zinc-800 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis dataKey="block" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fill="rgba(34,197,94,0.15)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* HEADER ROW */}
      <div className="grid grid-cols-12 text-[11px] text-gray-500 border-b border-zinc-800 p-2">
        <div className="col-span-3">TX HASH</div>
        <div className="col-span-2">FROM</div>
        <div className="col-span-2">TO</div>
        <div className="col-span-2 text-right">ETH</div>
        <div className="col-span-2 text-right">USD</div>
        <div className="col-span-1 text-right">FLAG</div>
      </div>

      {/* FEED */}
      <div className="flex-1 overflow-auto">
        {whales.map((w) => {
          const eth = Number(w.value) / 1e18;
          const usd = eth * ethPrice;
          const smart = isSmartMoney(w);

          return (
            <div
              key={w.hash}
              className={`grid grid-cols-12 text-xs p-2 border-b border-zinc-900 transition
              ${smart ? "bg-yellow-900/20 border-yellow-500/30" : "hover:bg-zinc-900/40"}`}
            >

              {/* HASH */}
              <div className="col-span-3 text-gray-400 truncate">
                {w.hash}
              </div>

              {/* FROM */}
              <div className="col-span-2">
                {smart ? "🧠 " : "🟢 "}
                {w.from.slice(0, 8)}...
              </div>

              {/* TO */}
              <div className="col-span-2">
                🔵 {w.to?.slice(0, 8) || "CONTRACT"}...
              </div>

              {/* ETH */}
              <div className="col-span-2 text-right text-green-400">
                {eth.toFixed(2)}
              </div>

              {/* USD */}
              <div className="col-span-2 text-right text-green-300">
                ${usd.toFixed(0)}
              </div>

              {/* FLAG */}
              <div className="col-span-1 text-right">
                {smart ? (
                  <span className="text-yellow-400 animate-pulse">
                    SMART
                  </span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}