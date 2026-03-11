# GDG Kanban Task Manager 🚀

A high-performance, responsive Kanban-style task management application built for the **GDG on Campus SRM Technical Recruitments 2026**. This project features glassmorphism UI, dual-theme switching, and smooth drag-and-drop interactions.

## ✨ Features
* **Kanban Workflow:** Three distinct columns (Todo, In Progress, Done).
* **Full CRUD:** Create, Read, Update (Edit), and Delete tasks.
* **Drag & Drop:** Real-time task reordering using `@hello-pangea/dnd`.
* **State Persistence:** Data remains intact after page refreshes via `LocalStorage`.
* **Responsive Design:** Fully functional on mobile, tablet, and desktop.
* **Dual-Theme Toggle:** Switch between "Digital Nomad" (Light) and "City Night" (Dark) modes.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS (Glassmorphism + Backdrop Blurs)
* **State Management:** React Hooks (useState, useEffect)
* **Icons & Utils:** UUID for unique task IDs

## 📝 Development & Testing Process

### 1. Environment Setup
* Scaffolded the project using Vite for optimal build speeds.
* Integrated Tailwind CSS and configured the `content` paths for standard React components.

### 2. Core Logic Implementation
* **Persistence:** Implemented a `useEffect` hook to synchronize the task state with the browser's `localStorage` whenever a change occurs.
* **Drag and Drop:** Configured `DragDropContext` to handle cross-column movement and vertical reordering within the same column.

### 3. Testing Workflow
To ensure reliability, the following tests were performed:
* **Task Lifecycle:** Verified that adding, editing, and deleting tasks updates the UI and LocalStorage instantly.
* **State Integrity:** Confirmed that tasks remain in their respective columns after a hard browser refresh ($F5$).
* **Responsiveness:** Tested layout transitions from `flex-row` (Desktop) to `flex-col` (Mobile) using Chrome DevTools.
* **Theme Persistence:** Verified that the user's theme choice is remembered across sessions.

## 🚀 Getting Started

1. Clone the repository.
2. Run `npm install`.
3. Start the dev server with `npm run dev`.

## 🌐 Live Link
[https://gdg-kanban-board.vercel.app](https://gdg-kanban-board.vercel.app)
