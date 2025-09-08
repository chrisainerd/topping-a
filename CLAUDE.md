# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real-time 3D synchronization application that allows multiple users to interact with 3D objects simultaneously across different devices. The project uses Socket.IO for real-time communication and Three.js for 3D rendering.

## Commands

**Development:**
```bash
npm start        # Start the server (runs on port 3000 by default)
```

**Dependencies:**
```bash
npm install      # Install dependencies (express, socket.io)
```

## Architecture

### Core Components

1. **server.js** - Node.js/Express server with Socket.IO
   - Handles WebSocket connections for real-time state synchronization
   - Caches last state to sync new clients immediately
   - Broadcasts state changes to all connected clients
   - Displays local network IPs for cross-device access

2. **index.html** - Main 3D viewer application
   - Three.js-based 3D furniture viewer with synchronized camera/object states
   - Role-based UI (Pro vs Regular users)
   - Material/color selection system
   - Mobile device preview dock for Pro users

3. **viewer.html** - Simple cube synchronization demo
   - Demonstrates basic real-time 3D object synchronization
   - Uses Three.js r124 with OrbitControls

### Key Technical Details

- **Module System**: Uses ESM (`"type": "module"` in package.json)
- **Real-time Sync**: Socket.IO broadcasts state changes with throttling (~30fps)
- **State Management**: Server caches last state for immediate sync on new connections
- **CORS**: Configured to allow all origins (`{ cors: { origin: "*" } }`)
- **Port**: Default 3000, configurable via PORT environment variable

### State Synchronization Pattern

The app uses a bidirectional sync pattern:
1. Client emits state changes (camera position, object properties)
2. Server broadcasts to all other clients
3. Server caches state for new client initialization
4. Throttling prevents excessive updates (33ms minimum interval)