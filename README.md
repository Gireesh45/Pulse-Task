# VideoPlatform - Content Analysis & Streaming

A comprehensive full-stack application that enables users to upload videos, processes them for content sensitivity, and provides seamless video streaming capabilities with real-time progress tracking.

## Architecture

- **Backend Context:** Node.js, Express, MongoDB (Mongoose), Socket.io, Multer, fluent-ffmpeg, JWT
- **Frontend Context:** React, Vite, Tailwind CSS v4, Framer Motion, Axios, Socket.io-client
- **Patterns:** Multi-Tenant Architecture, Role-Based Access Control (RBAC), Asynchronous Event-Driven Progress reporting.

## Features

1. **Multi-Tenant User Isolation:** Users access videos unique to their `Organization`.
2. **Role-Based Access Control:** Viewers can watch, Editors/Admins can upload.
3. **Advanced Async Processing:** Videos are ingested, and a background FFmpeg/ML pipeline runs, optimizing output while `Socket.io` pushes real-time percentage updates to the dynamic frontend modal. Note: if FFmpeg is unavailable, it gracefully falls back to simulated pipeline processing.
4. **Resilient HTTP Media Streaming:** React player uses 206 Partial Content queries to chunk-load videos efficiently instead of bulky file downloads.
5. **Ultra-Premium UI/UX:** A full dark-mode glassmorphism interface with micro-interactions via `framer-motion`.

## Getting Started

### Prerequisites
- Node.js (Latest LTS)
- MongoDB instance (Local or Atlas running without auth on port 27017, or configure the .env URL)
- (Optional) FFmpeg installed and in your system PATH for true video transcode processing. Else simulation will take over.

### Setup Instructions

1. **Clone & Install Dependencies**
   Navigate to `/backend` and run `npm install`.
   Navigate to `/frontend` and run `npm install`.

2. **Configure Environment**
   In the `/backend` directory, modify `.env` (it defaults to `mongodb://127.0.0.1:27017/videoplatform`).

3. **Run Backend Services**
   Inside `/backend` run:
   ```bash
   npx tsx src/server.ts
   ```

4. **Run Frontend Application**
   Inside `/frontend` run:
   ```bash
   npm run dev
   ```

### Default Credentials
Because there are no seeders defined, you will need to register a new account on the Auth page to begin interacting with the Dashboard. Your first sign-up sets your desired Role and Organization.
