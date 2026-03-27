import { motion } from 'framer-motion';
import { Play, Pause, Plus } from 'lucide-react';
import { useStore } from '../store';

export default function SongCard({ song, index, queue }) {
  const { currentSong, isPlaying, playSong, togglePlayPause, playlists, addSongToPlaylist } = useStore();
  
  const isCurrentSong = currentSong?.audio === song.audio;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(index, queue);
    }
  };

  return (
    <motion.div 
      className="bg-[#181818] p-4 rounded-lg cursor-pointer relative group hover:bg-[#282828] transition-colors duration-300"
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
      onDoubleClick={() => playSong(index, queue)}
    >
      <div className="relative mb-4">
        <img 
          src={song.image} 
          alt={song.title} 
          className="w-full aspect-square object-cover rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          loading="lazy"
        />
        
        <motion.button
          className={`absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-10`}
          onClick={(e) => {
            e.stopPropagation();
            if (playlists.length === 0) {
              alert('Please create a playlist first from the sidebar!');
              return;
            }
            const pId = prompt('Enter exact playlist name to add this song:\n' + playlists.map(p => p.name).join(', '));
            if (pId) {
              const p = playlists.find(p => p.name.toLowerCase() === pId.toLowerCase());
              if (p) addSongToPlaylist(p.id, song);
              else alert('Playlist not found!');
            }
          }}
          title="Add to Playlist"
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={16} />
        </motion.button>

        <motion.button
          className={`absolute bottom-2 right-2 w-12 h-12 bg-spotify-accent rounded-full flex items-center justify-center text-black shadow-lg shadow-black/40 ${isCurrentSong && isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'} transition-all duration-300 hover:scale-105 hover:bg-spotify-accentHover z-10`}
          onClick={handlePlayClick}
          whileTap={{ scale: 0.95 }}
        >
          {isCurrentSong && isPlaying ? (
            <Pause fill="black" size={20} />
          ) : (
            <Play fill="black" size={20} className="ml-1" />
          )}
        </motion.button>
      </div>
      
      <h3 className={`font-bold text-base mb-1 truncate ${isCurrentSong ? 'text-spotify-accent' : 'text-white'}`}>
        {song.title}
      </h3>
      <p className="text-sm font-medium text-spotify-text line-clamp-2">
        {song.description}
      </p>
    </motion.div>
  );
}
