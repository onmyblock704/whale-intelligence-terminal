"use client";

import { useEffect, useState } from "react";

type WhaleEvent = {
  type: string;
  data: any;
};

export default function Home() {
  const [events, setEvents] = useState<WhaleEvent[]>([]);
  const [latestBlock, setLatestBlock] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);

      setEvents((prev) => [event, ...prev].slice(0, 80));

      if (event?.data?.blockNumber) {
        setLatestBlock(event.data.blockNumber);
      }
    };

    ws.onerror = (err) => console.error("WS error:", err);

    return () => ws.close();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-mono grid grid-cols-12">

      {/* ================= LEFT PANEL ================= */}
      <div className="col-span-3 border-r border-zinc-800 p-3 space-y-3">
        <div className="text-xs text-zinc-400 tracking-widest">
          WALLET CLUSTERS
        </div>

        <WalletClusters events={events} />
      </div>

      {/* ================= CENTER PANEL ================= */}
      <div className="col-span-6 border-r border-zinc-800 p-3 space-y-4">

        <MarketPulse latestBlock={latestBlock} events={events} />

        <HeatStrip events={events} />

        <EventFeed events={events} />
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="col-span-3 p-3 space-y-3">
        <div className="text-xs text-zinc-400 tracking-widest">
          SMART MONEY SIGNALS
        </div>

        <SmartMoneyPanel events={events} />
      </div>
    </div>
  );
}

/* =========================================================
   📡 MARKET PULSE (CENTER HEADER)
========================================================= */
function MarketPulse({ latestBlock, events }: any) {
  const whaleCount = events.filter((e: any) =>
    e.type.includes("whale")
  ).length;

  const swapCount = events.filter((e: any) =>
    e.type === "dex_swap"
  ).length;

  return (
    <div className="flex justify-between text-xs border-b border-zinc-800 pb-2">
      <span className="text-green-400 animate-pulse">
        ● LIVE ON-CHAIN FEED
      </span>

      <span className="text-zinc-400">
        Block: {latestBlock || "syncing..."}
      </span>

      <span className="text-yellow-400">
        Whales: {whaleCount} | Swaps: {swapCount}
      </span>
    </div>
  );
}

/* =========================================================
   📊 HEAT STRIP (ACTIVITY VISUALIZATION)
========================================================= */
function HeatStrip({ events }: any) {
  return (
    <div className="flex gap-1 h-10 items-end">
      {events.slice(0, 40).map((e: any, i: number) => {
        const intensity =
          e.type === "whale_eth"
            ? 100
            : e.type === "dex_swap"
            ? 70
            : 30;

        return (
          <div
            key={i}
            className="w-2 bg-green-500"
            style={{
              height: `${intensity}%`,
              opacity: intensity / 100,
            }}
          />
        );
      })}
    </div>
  );
}

/* =========================================================
   📡 EVENT FEED (CENTER STREAM)
========================================================= */
function EventFeed({ events }: any) {
  return (
    <div className="space-y-2">
      {events.map((event: any, i: number) => (
        <EventCard key={i} event={event} />
      ))}
    </div>
  );
}

/* =========================================================
   🐋 EVENT CARD (INTELLIGENCE UNIT)
========================================================= */
function EventCard({ event }: any) {
  const isWhale = event.type === "whale_eth";
  const isERC20 = event.type === "erc20_transfer";
  const isSwap = event.type === "dex_swap";

  const style = isWhale
    ? "border-yellow-500 bg-yellow-900/10"
    : isERC20
    ? "border-blue-500 bg-blue-900/10"
    : "border-purple-500 bg-purple-900/10";

  return (
    <div className={`p-3 border rounded-md transition ${style}`}>
      <div className="text-xs text-zinc-400 uppercase">
        {event.type}
      </div>

      <div className="text-sm mt-1">
        {event.data?.hash?.slice(0, 14)}...
      </div>

      {isWhale && (
        <div className="text-yellow-400 text-xs mt-1">
          🧠 SMART MONEY DETECTED
        </div>
      )}

      {isERC20 && (
        <div className="text-blue-400 text-xs mt-1">
          ERC-20 FLOW
        </div>
      )}

      {isSwap && (
        <div className="text-purple-400 text-xs mt-1">
          DEX ACTIVITY
        </div>
      )}
    </div>
  );
}

/* =========================================================
   🧠 LEFT PANEL — WALLET CLUSTERS
========================================================= */
function WalletClusters({ events }: any) {
  const whales = events.filter((e: any) =>
    e.type === "whale_eth"
  );

  return (
    <div className="space-y-2">
      {whales.slice(0, 8).map((w: any, i: number) => (
        <div
          key={i}
          className="p-2 border border-zinc-800 rounded text-xs"
        >
          <div className="text-yellow-400">
            CLUSTER {i + 1}
          </div>
          <div className="text-zinc-400">
            {w.data.from?.slice(0, 10)}...
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   🧠 RIGHT PANEL — SMART MONEY SIGNALS
========================================================= */
function SmartMoneyPanel({ events }: any) {
  const smart = events.filter((e: any) =>
    e.type === "whale_eth"
  );

  return (
    <div className="space-y-2">
      {smart.slice(0, 6).map((s: any, i: number) => (
        <div
          key={i}
          className="p-2 border border-yellow-500 bg-yellow-900/10 rounded"
        >
          <div className="text-xs text-yellow-400">
            SMART MONEY ENTRY
          </div>
          <div className="text-xs text-zinc-400">
            {s.data.value} wei
          </div>
        </div>
      ))}
    </div>
  );
}