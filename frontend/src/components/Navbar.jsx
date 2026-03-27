import { ChevronLeft, ChevronRight, Download, User, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Navbar() {
  const { toggleSidebar } = useStore();

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-spotify-elevated/70 backdrop-blur-md transition-all duration-300">
      <div className="flex gap-2 items-center">
        <button className="bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-spotify-text cursor-not-allowed hidden sm:flex">
          <ChevronLeft size={20} />
        </button>
        <button className="bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-spotify-text cursor-not-allowed hidden sm:flex">
          <ChevronRight size={20} />
        </button>
        <button onClick={toggleSidebar} className="md:hidden bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-spotify-text">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="hidden lg:block bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full hover:scale-105 transition-transform">
          Explore Premium
        </button>
        <button className="hidden sm:flex bg-black text-white font-bold text-sm px-4 py-1.5 rounded-full items-center gap-2 hover:scale-105 transition-transform">
          <Download size={16} /> Install App
        </button>
        <Link to="/admin" className="text-spotify-text hover:text-white hover:underline font-bold text-sm flex items-center gap-1 mx-2">
          <Settings size={16} /> Admin
        </Link>
        <button className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
