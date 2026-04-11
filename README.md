# ReliefSync

ReliefSync is a real-time coordination platform designed for NGOs and emergency responders to manage logistics, volunteers, and SOS alerts during crises. Built for the **HackTheChain 4.0** hackathon.

## Key Features

- **Crisis Command Center**: A high-impact, real-time dashboard for Base Coordinators.
- **SOS Transmitter**: Field volunteers can broadcast geo-coded SOS signals with varying severity levels.
- **Tactical Inventory**: Real-time management of ambulances, medical kits, and supplies.
- **Conflict Detection**: Backend logic prevents double-booking of resources across different zones.
- **Hot-Reactivity**: UI updates instantly via WebSockets (Socket.io) without page refreshes.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Zustand, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, JWT Auth.
- **Database**: MongoDB (via Mongoose).

## Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd server
npm install
# Update .env with your MONGO_URI
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Architecture

```
/server
  /models       # User, Resource, Alert Schemas
  /routes       # Auth, Resources, Alerts (Socket.io Emitters)
  /middleware   # JWT Auth & RBAC
/client
  /src/store    # Zustand State Management
  /src/lib      # Socket.io & Axios config
  /src/pages    # Dashboard, Auth flow
```
