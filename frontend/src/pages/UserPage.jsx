import { useEffect } from 'react';
import { useStore } from '../store';
import SongCard from '../components/SongCard';

export default function UserPage() {
  const { songs, fetchSongs, searchQuery } = useStore();

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const filteredSongs = songs.filter(song => 
    song.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white inline-block">
        {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Indian Tracks"}
      </h2>
      
      {songs.length === 0 ? (
        <div className="text-spotify-text py-10 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-spotify-hover rounded-full mb-4"></div>
            <div className="h-4 bg-spotify-hover rounded w-48 mb-2"></div>
            <div className="h-3 bg-spotify-hover rounded w-32"></div>
          </div>
        </div>
      ) : filteredSongs.length === 0 ? (
        <div className="text-spotify-text py-10 text-center">
          <p className="font-semibold text-lg text-white mb-2">No results found for "{searchQuery}"</p>
          <p>Please make sure your words are spelled correctly, or use less or different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-24">
          {filteredSongs.map((song, index) => (
            <SongCard key={song._id || song.id || index} song={song} index={index} queue={filteredSongs} />
          ))}
        </div>
      )}
    </div>
  );
}
