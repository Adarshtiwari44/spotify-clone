# Spotify Clone - Modern MERN Stack

A stunning, high-performance Spotify web player clone built with modern web technologies. Completely reimagined from static HTML to a beautifully animated and fully responsive Single Page Application (SPA).

## 🚀 Features

*   **Custom Admin Dashboard**: Secure (`/login`) portal to upload custom MP3s and Cover Artwork directly from your local machine.
*   **Real-time UI Hydration**: New songs uploaded by the admin instantly appear on the User page without ever refreshing the browser.
*   **Persistent Custom Audio Player**: An intelligent, bottom-anchored Player Bar that syncs to global state. Includes a dynamic responsive progress bar, volume controls, and fully functional **shuffle & repeat** toggles. 
*   **Dynamic Playlists & Search**: Create custom playlists from the sidebar, seamlessly add songs to them, and find tracks using a live-filtering search bar.
*   **Responsive Architecture**: Features a sleek, mobile-friendly slide-over sidebar and an adaptive grid layout ensuring perfect scaling on any device.
*   **Premium Animations**: Implements Spotify-style micro-interactions. Album cards possess subtle "scale-and-glow" effects, powered by Framer Motion.
*   **Modern Glassmorphism**: Utilizes Vite & Tailwind styling to flawlessly recreate the Spotify Dark Mode aesthetic with frosted glass headers and sleek sidebars.

## 💻 Tech Stack

### Frontend Architecture
*   **React.js (Vite)**: For blazing fast local development and optimized component chunking. 
*   **Tailwind CSS (v4)**: Utilizing the newest `@tailwindcss/vite` plugin for ultra-rapid utility class rendering.
*   **Zustand**: A lightweight, scalable global state manager handling our play/pause functions and global `currentSong` library.
*   **Framer Motion**: The industry standard for complex React animations (hover scaling, error shaking, transitions).
*   **React Router DOM**: Client-side routing connecting the User Page with the secure Admin panels seamlessly.
*   **Axios**: Promise-based HTTP client for uploading Multipart Form Data (audio and image files) to the backend API.
*   **Lucide React & FontAwesome**: Open-source crisp SVG icon vectors.
*   **React Hot Toast**: Beautiful pop-up notifications for upload successes and login failures.

### Backend Architecture
*   **Node.js & Express.js**: A lightweight, non-blocking REST API server.
*   **Multer**: Middleware for handling `multipart/form-data`, specifically engineered here to save `.mp3` files to `/music` and `.jpg/.png` files to `/img`.
*   **Local JSON Database**: File system-based pseudo-database (`data/songs.json`) storing persistent metadata for all uploaded media.
*   **Concurrently**: A robust dev-dependency proxy allowing both the Vite React environment and the Express REST API to spin up simultaneously with a single command. 

## ⚙️ How To Run Locally

1. Open your terminal in the root project folder.
2. Install all dependencies:
```bash
npm install
```
3. Start the application (spins up both Front-end and Back-end servers):
```bash
npm run dev
```

4. **User Playback**: Open `http://localhost:5173` in your browser.
5. **Admin Upload**: Open `http://localhost:5173/login`. 
   *(Default Username: `admin` / Password: `1234`)*
