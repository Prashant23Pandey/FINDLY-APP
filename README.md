# 🛡️ Findly: AI-Powered NIET Campus Utility Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://findly-app.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Powered by TensorFlow](https://img.shields.io/badge/Powered%20by-TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)

**Findly** is a high-fidelity, wizard-themed Lost & Found ecosystem designed specifically for the **NIET Campus**. It leverages edge computer vision to automate item recovery, eliminate manual data entry, and gamify campus-wide helpfulness.

---

## 🌟 Immersive Experience

Findly isn't just a utility; it's a **gamified quest** to keep the NIET campus organized. Our "Porygon-AI" core provides an interface that feels alive.

### 🤖 Porygon AI Neural Scan
Stop typing descriptions! Our integrated **TensorFlow.js** vision engine analyzes your items in real-time.
- **Auto-Tagging**: Instant identification of objects (Wallets, Earbuds, ID Cards).
- **Smart Formatting**: Categorizes items and generates high-accuracy descriptions automatically.
- **Holographic UI**: Immersive "laser-scan" animations during processing.

### 🎮 Gamified progression
Every good deed is rewarded.
- **XP & Levels**: Earn +10 to +200 XP for reporting lost items or facilitating handovers.
- **Global Leaderboard**: Compete with other students to become the campus's "Master Finder."
- **Branch Pride**: Represent the **CSE AI** department and climb the ranks.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Framer Motion |
| **Intelligence** | TensorFlow.js, MobileNet V2 for Edge Vision |
| **Backend** | Node.js, Express.js, JWT Authentication |
| **Design** | Poké-inspired Wizard Theme with Glassmorphism |
| **Deployment** | Vercel (Monorepo Multi-Service Architecture) |

---

## 🧱 Architecture Details

### 1. Unified API Strategy
Findly uses a **Vercel Monorepo** structure. The frontend and backend run as parallel services, enabling high-performance serverless execution and shared deployment logic.

### 2. Vision Pipeline
```mermaid
graph LR
    A[Image Upload] --> B[TensorFlow.js Prep]
    B --> C{Model Choice}
    C -->|Local| D[MobileNet Inference]
    C -->|Fallback| E[Heuristic Engine]
    D --> F[Auto-filled Form]
    E --> F
    F --> G[Secure Submission]
```

### 3. Data Integrity
- **Mandatory Photo Enforcement**: Ensures every report has visual proof for the AI to verify.
- **Bit-Perfect Sync**: Large-payload support (100MB) ensures high-res photos persist through the API to the search results.

---

## 🚦 Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Prashant23Pandey/FINDLY-APP.git
   ```
2. Setup environment:
   ```env
   JWT_SECRET=pokefind_secret
   ADMIN_REGISTRATION_CODE=NIET_ADMIN_2024
   ```
3. Run with NPM:
   ```bash
   # In root directory
   npm install 
   npm run dev
   ```

---

## 🗺️ Roadmap
- [x] Porygon AI Scan Integration
- [x] Gamified Leaderboard & XP
- [x] Admin Dashboard for Moderation
- [ ] Real-time WhatsApp Notification Bridge
- [ ] Persistent MongoDB Integration

**Developed for the NIET Community by [Prashant Pandey](https://github.com/Prashant23Pandey)**
