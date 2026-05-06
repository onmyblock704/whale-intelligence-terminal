"use client";

import { useEffect, useState } from "react";

type WhaleEvent = {
  type: string;
  data: {
    hash: string;
    from: string;
    to?: string;
    value: string;
    blockNumber: number;
  };
};

export default function Home() {
  const [events, setEvents] = useState<WhaleEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const WS_URL =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

    console.log("🔌 Connecting WS:", WS_URL);

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("🟢 WS connected");
      setConnected(true);
    };

    ws.onclose = () => {
      console.log("🔴 WS closed");
      setConnected(false);
    };

    ws.onerror = (err) => {
      console.log("⚠️ WS error", err);
      setConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setEvents((prev) => [data, ...prev].slice(0, 50));
      } catch (err) {
        console.log("⚠️ Bad WS message format", err);
      }
    };

    return () => ws.close();
  }, []);

  // 🔥 SIMPLE SMART MONEY FILTER
  const whaleEvents = events.filter((e) =>
    e.type.includes("whale")
  );

  const dexEvents = events.filter((e) =>
    e.type.includes("dex")
  );

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex">

      {/* ================= LEFT PANEL ================= */}
      <div className="w-1/5 border-r border-green-900 p-3">
        <h2 className="text-xs text-gray-400 mb-2">WALLET CLUSTERS</h2>

        <div className="space-y-2">
          <div className="p-2 bg-zinc-950 border border-green-900">
            🐋 Whale Cluster A
          </div>
          <div className="p-2 bg-zinc-950 border border-green-900">
            🧠 Smart Money Flow
          </div>
          <div className="p-2 bg-zinc-950 border border-green-900">
            🔥 Hot Wallets
          </div>
        </div>

        <h2 className="text-xs text-gray-400 mt-6 mb-2">HEAT STRIP</h2>
        <div className="h-32 bg-gradient-to-r from-green-900 via-yellow-600 to-red-600 opacity-40"></div>
      </div>

      {/* ================= CENTER PANEL ================= */}
      <div className="w-3/5 p-4 overflow-y-auto">
        <div className="flex justify-between mb-4 border-b border-green-900 pb-2">
          <h1 className="text-lg">LIVE WHALE FEED</h1>

          <span className={connected ? "text-green-400" : "text-red-500"}>
            {connected ? "● LIVE" : "● OFFLINE"}
          </span>
        </div>

        <div className="space-y-3">
          {events.map((e, i) => (
            <div
              key={i}
              className="border border-green-900 bg-zinc-950 p-3"
            >
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{e.type}</span>
                <span>Block #{e.data.blockNumber}</span>
              </div>

              <div className="mt-1 text-sm">
                <div>{e.data.hash}</div>
                <div className="text-green-300 font-bold">
                  {e.data.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="w-1/5 border-l border-green-900 p-3">
        <h2 className="text-xs text-gray-400 mb-2">SMART MONEY</h2>

        <div className="space-y-2">
          {whaleEvents.slice(0, 5).map((e, i) => (
            <div
              key={i}
              className="p-2 border border-green-900 bg-zinc-950"
            >
              🐋 {e.data.value}
            </div>
          ))}
        </div>

        <h2 className="text-xs text-gray-400 mt-6 mb-2">
          DEX ACTIVITY
        </h2>

        <div className="space-y-2">
          {dexEvents.slice(0, 5).map((e, i) => (
            <div
              key={i}
              className="p-2 border border-green-900 bg-zinc-950"
            >
              🔄 Swap detected
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}