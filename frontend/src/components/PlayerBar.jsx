import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Mic2, ListMusic, MonitorSpeaker, Volume2 } from 'lucide-react';
import { useStore } from '../store';

export default function PlayerBar() {
  const { currentSong, isPlaying, togglePlayPause, nextSong, prevSong, volume, setVolume, isShuffle, toggleShuffle, isRepeat, toggleRepeat } = useStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) {
    return (
      <div className="h-[90px] bg-black border-t border-[#282828] px-4 flex justify-between items-center text-spotify-text">
        <div className="w-[30%]"></div>
        <div className="w-[40%] flex flex-col items-center gap-2">
          <div className="flex gap-6 items-center">
            <SkipBack size={20} className="opacity-50" />
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-50">
              <Play size={16} fill="black" className="ml-1" />
            </div>
            <SkipForward size={20} className="opacity-50" />
          </div>
          <div className="w-full max-w-md h-1 rounded-full bg-[#4d4d4d]"></div>
        </div>
        <div className="w-[30%]"></div>
      </div>
    );
  }

  return (
    <div className="h-[90px] bg-black border-t border-[#282828] px-4 flex justify-between items-center z-50">
      <audio 
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={nextSong}
      />
      
      {/* Left: Song Info */}
      <div className="w-[30%] flex items-center gap-4">
        <img src={currentSong.image} alt={currentSong.title} className="w-14 h-14 rounded shadow-md object-cover" />
        <div className="flex flex-col justify-center">
          <a href="#" className="font-semibold text-white text-sm hover:underline line-clamp-1">{currentSong.title}</a>
          <a href="#" className="text-xs text-spotify-text hover:text-white hover:underline line-clamp-1">{currentSong.description}</a>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="w-[40%] flex flex-col items-center gap-2">
        <div className="flex items-center gap-6 text-spotify-text">
          <Shuffle 
            size={16} 
            onClick={toggleShuffle}
            className={`cursor-pointer transition-colors ${isShuffle ? 'text-spotify-accent' : 'opacity-50 hover:text-white'}`} 
          />
          <SkipBack size={20} onClick={prevSong} className="cursor-pointer hover:text-white transition-colors" />
          <button 
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={16} fill="black" />
            ) : (
              <Play size={16} fill="black" className="ml-1" />
            )}
          </button>
          <SkipForward size={20} onClick={nextSong} className="cursor-pointer hover:text-white transition-colors" />
          <Repeat 
            size={16} 
            onClick={toggleRepeat}
            className={`cursor-pointer transition-colors ${isRepeat ? 'text-spotify-accent' : 'opacity-50 hover:text-white'}`} 
          />
        </div>
        
        <div className="w-full max-w-md flex items-center gap-2 text-xs text-spotify-text">
          <span>{formatTime(progress)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={progress}
            onChange={handleSeek}
            style={{ background: `linear-gradient(to right, #1db954 ${(progress / (duration || 1)) * 100}%, #4d4d4d ${(progress / (duration || 1)) * 100}%)` }}
            className="w-full h-1 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 hover:[&::-webkit-slider-thumb]:opacity-100"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="w-[30%] flex justify-end items-center gap-4 text-spotify-text">
        <Mic2 size={16} className="hover:text-white cursor-pointer transition-colors" />
        <ListMusic size={16} className="hover:text-white cursor-pointer transition-colors" />
        <MonitorSpeaker size={16} className="hover:text-white cursor-pointer transition-colors" />
        <div className="flex items-center gap-2 w-24 hover:text-white transition-colors group">
          <Volume2 size={16} className="cursor-pointer" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ background: `linear-gradient(to right, #1db954 ${volume * 100}%, #4d4d4d ${volume * 100}%)` }}
            className="w-full h-1 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 hover:[&::-webkit-slider-thumb]:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
