import { Home, Search, Library, Plus, ArrowRight, X, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, searchQuery, setSearchQuery, playlists, createPlaylist, playPlaylist } = useStore();

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 p-2 bg-black h-[calc(100vh-90px)]
        md:relative md:flex md:w-[340px] md:h-auto md:bg-transparent md:p-0
        flex-col gap-2 rounded-lg transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0 flex w-[300px]' : '-translate-x-full md:translate-x-0 hidden md:flex'}
      `}>
        {isSidebarOpen && (
          <button onClick={toggleSidebar} className="md:hidden absolute top-4 right-4 text-white z-50 bg-black/50 p-1 rounded-full">
            <X size={24} />
          </button>
        )}
        <div className="bg-spotify-elevated rounded-lg p-5 text-white font-bold text-xl flex items-center gap-2">
        <i className="fa-brands fa-spotify text-spotify-accent text-3xl"></i> Spotify
      </div>
      
      <div className="bg-spotify-elevated rounded-lg py-2 px-3">
        <ul>
          <li>
            <Link to="/" onClick={() => isSidebarOpen && toggleSidebar()} className="flex items-center gap-5 text-spotify-text hover:text-white font-semibold p-3 transition-colors">
              <Home size={24} /> <span>Home</span>
            </Link>
          </li>
          <li className="px-2 pb-2">
            <div className="flex items-center gap-3 text-white font-semibold p-2 transition-colors bg-[#242424] rounded-full mt-1 border border-transparent focus-within:border-white">
              <Search size={20} className="ml-2 text-spotify-text" />
              <input 
                type="text" 
                placeholder="What do you want to play?"
                className="bg-transparent border-none outline-none text-sm w-full font-normal placeholder-spotify-text text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </li>
        </ul>
      </div>
      
      <div className="bg-spotify-elevated rounded-lg flex-1 py-2 px-3 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center p-3 text-spotify-text font-semibold">
          <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
            <Library size={24} /> Your Library
          </div>
          <div className="flex gap-4">
            <Plus size={20} className="cursor-pointer hover:text-white transition-colors" onClick={() => { const name = prompt('Enter playlist name:'); if(name) createPlaylist(name); }} />
            <ArrowRight size={20} className="cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
        
        {playlists.length === 0 ? (
          <div className="bg-spotify-highlight p-4 rounded-lg my-4">
            <p className="font-semibold text-white mb-2">Create your first playlist</p>
            <p className="text-sm text-spotify-text mb-5 font-medium">It's easy, we'll help you</p>
            <button 
              className="bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full hover:scale-105 transition-transform"
              onClick={() => { const name = prompt('Enter playlist name:'); if(name) createPlaylist(name); }}
            >
              Create playlist
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {playlists.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 hover:bg-spotify-highlight rounded-lg cursor-pointer group" onClick={() => playPlaylist(p.id)}>
                <div>
                  <p className="text-white font-semibold">{p.name}</p>
                  <p className="text-sm text-spotify-text">Playlist • {p.songs.length} songs</p>
                </div>
                <button className="hidden group-hover:flex w-8 h-8 rounded-full bg-spotify-accent text-black items-center justify-center hover:scale-105 transition-transform">
                  <Play fill="black" size={16} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
