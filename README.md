# 🐋 Whale Intelligence Terminal

A real-time blockchain intelligence dashboard that tracks whale transactions, DEX swaps, and smart money flows using WebSocket streaming and on-chain data signals.

---

## 🔥 Live Demo
- Frontend (Vercel): https://your-vercel-url.vercel.app
- Backend (Railway WebSocket): wss://whale-intelligence-terminal-production.up.railway.app

---

## 🧠 System Architecture
Ethereum RPC / Alchemy Streams
↓
Node.js WebSocket Server (Railway)
↓
Real-time event broadcasting
↓
Next.js 16 Dashboard (Vercel)
↓
Bloomberg-style trading UI


---

## ⚙️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 18
- TailwindCSS
- WebSocket client

### Backend
- Node.js
- ws (WebSocket server)
- Real-time event streaming

### Blockchain Layer
- Alchemy WebSocket API
- Ethereum RPC
- (Expandable: ERC20 + DEX decoding)

### Infrastructure
- Vercel (Frontend hosting)
- Railway (WebSocket backend)
- Neon + Prisma (Database layer)

---

## 📊 Features

### 🐋 Whale Tracking
- Real-time large transaction detection
- Wallet activity streaming

### 🧠 Smart Money Signals
- Whale clustering (basic)
- DEX swap detection

### 📡 Live Market Feed
- WebSocket-powered streaming UI
- Auto-updating event terminal

### 📈 Terminal UI
- Bloomberg-style 3-panel layout
- Heat strip visualization
- Live activity feed

---

## 🧩 Future Upgrades

- ERC20 transfer decoding
- DEX swap parsing (Uniswap, etc.)
- Wallet clustering (exchange vs smart money)
- Predictive whale detection model
- Historical on-chain analytics

---

## 🛠 Setup

### 1. Install dependencies

npm install

Run frontend
npm run dev

Run backend
node ws-server.js

NEXT_PUBLIC_WS_URL=wss://your-railway-url
DATABASE_URL=your_neon_db
ALCHEMY_WS_URL=your_alchemy_ws
RPC_URL=your_rpc_url

🧠 Key Insight

This system simulates a real-time institutional crypto intelligence terminal, similar in concept to Bloomberg-style market feeds but applied to on-chain blockchain data.

📌 Joshua B. Nixon 

Blockchain Engineer | Smart Contract Developer | Web3 Full Stack Engineer