<div align="center">

# 🌌 Archive Terminal

**An immersive, photorealistic 3D CRUD application for managing your digital library**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160+-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10+-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

*Next-generation digital archive featuring a live 3D server room, CSS CRT stat monitors, and cinematic UI animations.*

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Aesthetic & Design v4.0](#-aesthetic--design-v40)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Features](#-features)
- [Database Schema](#%EF%B8%8F-database-schema)
- [Project Structure](#%EF%B8%8F-project-structure)
- [Getting Started](#-getting-started)

---

## 🌟 About the Project

**Archive Terminal v4.0** is a highly polished, full-stack **MERN** application transformed into a fully immersive WebGL experience. Designed as a personal command center for cataloguing technical resources, it combines a robust backend architecture with bleeding-edge frontend presentation.

The entire interface floats above a live, real-time 3D rendered server room built with **Three.js** and **React Three Fiber**.

> *"The archive is always open. The terminal never sleeps."*

---

## 🎨 Aesthetic & Design v4.0

The interface strictly adheres to a **futuristic sci-fi terminal** aesthetic, blending photorealism with UI:

| Design Element | Implementation |
| :--- | :--- |
| **WebGL Background** | Live 3D server room with flickering LED racks, atmospheric fog, and floating holographic code panels. |
| **Server Room HUD** | Pure CSS server room dashboard with animated data streams and glowing CRT monitors displaying live database statistics. |
| **Metal UI Frames** | Modals and headers housed in heavy brushed metal enclosures with 3D bevels and corner screws. |
| **Console Desk** | Photorealistic carbon fiber console desk anchoring the foreground. |
| **Cinematic Motion** | Framer Motion spring-physics for modals, GSAP terminal typing effects, and glitch-hover buttons. |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Role |
| :--- | :--- |
| **React 18 & Vite** | UI framework and blazing-fast build tool |
| **Three.js & R3F** | WebGL rendering for the 3D server room background |
| **Framer Motion & GSAP** | High-performance physics-based UI and typography animations |
| **Tailwind CSS v4** | Utility-first styling with custom CSS tokens |
| **Axios** | HTTP client for API communication |

### Backend

| Technology | Role |
| :--- | :--- |
| **Node.js & Express** | JavaScript runtime and RESTful API framework |
| **MongoDB & Mongoose** | NoSQL document database and schema validation |
| **CORS & dotenv** | Security and environment variable management |

---

## ⚡ Features

### Core CRUD Operations
- ✅ **Create** — Animated heavy metal modal form with custom glassmorphism dropdowns.
- ✅ **Read** — Full-detail ViewModal for reading complete resource descriptions without truncation.
- ✅ **Update** — Modal auto-populates with existing resource data for seamless editing.
- ✅ **Delete** — Stylized confirmation dialog prevents accidental data loss.

### UI/UX Highlights
- 🔍 **Real-time Search** — Client-side title filtering with instant visual feedback.
- 📊 **Server Room Stats** — Live counts of Total, Active, and Archived resources rendered as glowing CRT monitors in a pure CSS server rack.
- 📭 **Empty States** — Context-aware messaging for empty archive vs. no search results.
- 🖱️ **Glitch Interactions** — Buttons feature chromatic aberration jitter effects on hover.

---

## 🗄️ Database Schema

The **Resource** Mongoose model represents a single item in the digital archive:

```js
{
  title:       String,   // required, trimmed
  category:    String,   // required (AI Model, Code Snippet, Research Paper, Tool, Other)
  description: String,   // required
  status:      String,   // default: 'Active' (Active, Archived, In Review)
  createdAt:   Date,     // default: Date.now
}
```

---

## ⚙️ Project Structure

```
CRUD/
│
├── 📁 server/                        # Node.js + Express Backend
│   ├── 📁 config/db.js               # MongoDB connection
│   ├── 📁 models/Resource.js         # Mongoose schema
│   ├── 📁 routes/resourceRoutes.js   # RESTful CRUD API
│   ├── server.js                     # Express app entry
│   └── package.json                  
│
├── 📁 client/                        # React + WebGL Frontend
│   ├── 📁 public/assets/             # Photorealistic AI-generated textures
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Scene3D.jsx           # Three.js server room background
│   │   │   ├── HolOrbs.jsx           # Pure CSS Server Room HUD with CRT monitors
│   │   │   ├── Dashboard.jsx         # Main orchestrator & animations
│   │   │   ├── ResourceModal.jsx     # Metal-framed Create/Edit form
│   │   │   ├── ViewModal.jsx         # Full-detail reading modal
│   │   │   ├── ConfirmModal.jsx      # Delete confirmation
│   │   │   ├── Navbar.jsx            # Fixed top nav with GSAP typing
│   │   │   └── Toast.jsx             # Framer Motion notifications
│   │   ├── App.jsx                   # Component layer stack (WebGL -> UI)
│   │   └── App.css                   # Custom CSS styling
│   └── package.json                  
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- Local [MongoDB](https://www.mongodb.com/try/download/community) instance running on `mongodb://127.0.0.1:27017`
- Git

### Step 1 — Setup the Backend

```bash
cd server
npm install
npm run dev
```
> 🟢 Server will be live at **`http://localhost:5000`**

### Step 2 — Setup the Frontend

Open a **new terminal window**:

```bash
cd client
npm install
npm run dev
```
> 🟢 Frontend will be live at **`http://localhost:5173`**

### Step 3 — Open the App

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser. The Vite dev server automatically proxies all `/api` requests to `http://localhost:5000`.

---

<div align="center">
<b>Built with ⚡ by <a href="https://github.com/adixists">adixists</a></b>
</div>
