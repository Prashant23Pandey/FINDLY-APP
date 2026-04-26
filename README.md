# 🛡️ Findly: AI-Powered Campus Utility Platform

Findly is a high-fidelity, wizard-themed Lost & Found ecosystem designed specifically for the **NIET Campus**. It leverages cutting-edge computer vision to automate item recovery and gamify campus helpfulness.

![Project Preview](frontend/public/images/id_card.png)

## 🚀 Key Features

*   **Porygon AI Neural Scan**: Real-time image recognition using TensorFlow.js to auto-identify, categorize, and tag items.
*   **Wizard-Themed UX**: An immersive dark-mode interface built with Next.js, Framer Motion, and Tailwind CSS.
*   **Gamified XP System**: Earn XP and level up for every item reported or returned. Track your helpfulness on the Global Leaderboard.
*   **Smart Matching**: Sophisticated matching algorithms that alert users when a lost item's characteristics match a newly reported found item.
*   **Safe Handover**: Integrated contact portal for secure item transitions.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js
- **AI Engine**: TensorFlow.js, MobileNet V2
- **Auth**: JWT-based Secure Authentication

## 📦 Project Structure

```bash
├── frontend/        # Next.js web application
├── backend/         # Express.js API server
└── ai-service/      # Python-based auxiliary AI services (Optional)
```

## 🚥 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm / yarn

### 2. Installation

**Setup Backend:**
```bash
cd backend
npm install
node server.js
```

**Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=your_secret_key
ADMIN_REGISTRATION_CODE=NIET_ADMIN_2024
```

## 📸 Core Intelligence
The platform features a **Neural Scan Intelligence** layer that provides:
- bit-perfect image persistence
- Automatic description generation
- Heuristic fallback for offline processing

---
**Developed with ❤️ for the NIET Community by Prashant Pandey**
