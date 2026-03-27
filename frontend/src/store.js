import { create } from 'zustand';
import axios from 'axios';

export const useStore = create((set, get) => ({
  songs: [],
  activeSongs: [],
  currentSong: null,
  currentSongIndex: -1,
  isPlaying: false,
  volume: 1,

  isShuffle: false,
  isRepeat: false,

  isSidebarOpen: false,
  searchQuery: '',
  playlists: [],

  // Fetch from backend
  fetchSongs: async () => {
    try {
      const res = await axios.get('/api/songs');
      set({ songs: res.data, activeSongs: res.data });
    } catch (error) {
      console.error("Failed to fetch songs", error);
    }
  },

  // Admin pushes newly uploaded song directly into state
  addSongLocal: (song) => {
    set((state) => ({ 
      songs: [...state.songs, song],
      activeSongs: [...state.songs, song]
    }));
  },

  // Playback control
  playSong: (index, customQueue = null) => {
    const state = get();
    const queue = customQueue || state.activeSongs;
    if (index >= 0 && index < queue.length) {
      set({ 
        activeSongs: queue,
        currentSong: queue[index], 
        currentSongIndex: index, 
        isPlaying: true 
      });
    }
  },

  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  toggleRepeat: () => {
    set((state) => ({ isRepeat: !state.isRepeat }));
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  createPlaylist: (name) => {
    set((state) => ({
      playlists: [...state.playlists, { id: Date.now(), name, songs: [] }]
    }));
  },

  addSongToPlaylist: (playlistId, song) => {
    set((state) => ({
      playlists: state.playlists.map(p => 
        p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
      )
    }));
  },

  playPlaylist: (playlistId) => {
    const list = get().playlists.find(p => p.id === playlistId);
    if (list && list.songs.length > 0) {
      get().playSong(0, list.songs);
    }
  },

  nextSong: () => {
    const { currentSongIndex, activeSongs, isShuffle, isRepeat } = get();
    if (activeSongs.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * activeSongs.length);
    } else {
      nextIndex = currentSongIndex + 1;
      if (nextIndex >= activeSongs.length) {
        if (isRepeat) {
          nextIndex = 0;
        } else {
          set({ isPlaying: false });
          return;
        }
      }
    }
    get().playSong(nextIndex);
  },

  prevSong: () => {
    const { currentSongIndex, activeSongs, isShuffle } = get();
    if (activeSongs.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * activeSongs.length);
    } else {
      prevIndex = currentSongIndex - 1 < 0 ? activeSongs.length - 1 : currentSongIndex - 1;
    }
    get().playSong(prevIndex);
  },

  setVolume: (value) => {
    set({ volume: value });
  }
}));
