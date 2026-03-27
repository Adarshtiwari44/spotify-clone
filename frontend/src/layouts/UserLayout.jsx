import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import Navbar from '../components/Navbar';

export default function UserLayout() {
  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        <Sidebar />
        <div className="flex-1 bg-spotify-elevated rounded-lg flex flex-col overflow-hidden relative">
          <Navbar />
          <div className="flex-1 overflow-y-auto w-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-spotify-accent/20 to-spotify-elevated h-64 pointer-events-none" />
            <div className="relative z-10 p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <PlayerBar />
    </div>
  );
}
