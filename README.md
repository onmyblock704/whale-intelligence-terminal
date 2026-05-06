# 🧠 Whale Intelligence Terminal

> Real-time blockchain intelligence system that detects, classifies, and visualizes on-chain “smart money” activity.

---

## 🚀 Live Demo

!

---

## 📊 What This Is

Whale Intelligence Terminal is a **real-time on-chain analytics dashboard** that transforms raw Ethereum blockchain data into actionable intelligence.

It streams live events, identifies high-value transactions, and surfaces “smart money” signals in a Bloomberg-style interface.

---

## 🧠 Core Idea

Instead of passively viewing blockchain data, this system:

* **Listens** to live blockchain activity
* **Classifies** transactions into meaningful signals
* **Streams** insights in real-time via WebSockets
* **Visualizes** intelligence in a multi-panel terminal UI

---

## ⚙️ System Architecture

```
Ethereum RPC
     ↓
Listener (event ingestion)
     ↓
Classification Engine
     ↓
WebSocket Server (real-time streaming)
     ↓
Next.js Frontend (live terminal UI)
```

---

## 🔥 Features

### ⚡ Real-Time Streaming

WebSocket-powered pipeline delivers live blockchain updates with sub-second latency.

### 🐋 Whale Detection

Identifies high-value ETH transfers and flags potential smart money movement.

### 🔄 Event Classification

Transforms raw blockchain data into structured signals:

* `whale_eth`
* `erc20_transfer`
* `dex_swap`

### 📊 Intelligence UI

Bloomberg-style dashboard:

* **Left Panel:** Wallet clustering
* **Center Panel:** Live feed + heatmap
* **Right Panel:** Smart money signals

---

## 🧩 Tech Stack

### Frontend

* Next.js
* React
* TailwindCSS
* WebSockets

### Backend

* Node.js
* WebSocket server
* Event streaming engine

### Blockchain

* Ethereum RPC
* Transaction decoding
* Event classification

---

## 🧠 Engineering Highlights

* Event-driven architecture
* Real-time pub/sub system
* Blockchain data normalization
* Reactive UI rendering
* Scalable backend/frontend separation

---

## 📈 Why This Matters

This project replicates the core architecture used by:

* Nansen → wallet intelligence
* Glassnode → on-chain analytics
* Bloomberg L.P. → trading terminal UI

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
vercel
```

### Backend (Railway / Render / Fly.io)

```bash
node ws-server.js
```

---

## 🔮 Future Enhancements

* Smart money scoring (0–100)
* Predictive flow detection
* Wallet labeling (funds, exchanges)
* Telegram / Discord alerts
* Price overlays + charts

---

## 👨‍💻 Joshua B. Nixon

Blockchain Engineer | Smart Contract Developer | Web3 Full-Stack Engineer
