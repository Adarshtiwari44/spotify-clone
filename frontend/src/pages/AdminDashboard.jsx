import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LogOut, Home, KeyRound, UploadCloud } from 'lucide-react';
import { useStore } from '../store';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { addSongLocal } = useStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Unauthorized. Please login.");
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile || !imageFile) {
      return toast.error("Please upload both Audio and Image files");
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('audio', audioFile);
    formData.append('image', imageFile);

    try {
      const res = await axios.post('/api/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // push to zustand store instantly
      if (res.data) {
        addSongLocal(res.data);
        toast.success("Song uploaded successfully!");
        
        // Reset form
        setTitle('');
        setDescription('');
        setAudioFile(null);
        setImageFile(null);
        document.getElementById('uploadForm').reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to upload song.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-base text-white font-sans bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
      <nav className="bg-spotify-elevated/80 backdrop-blur-lg border-b border-[#282828] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-2">
          <KeyRound className="text-spotify-accent" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-[#282828] hover:bg-[#3E3E3E] rounded-full transition-colors font-semibold text-sm">
            <Home size={16} /> Home
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/40 rounded-full transition-colors font-semibold text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-spotify-elevated/60 backdrop-blur-2xl p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[#ffffff10]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-spotify-accent/20 rounded-full flex items-center justify-center mb-4 text-spotify-accent">
              <UploadCloud size={32} />
            </div>
            <h2 className="text-2xl font-bold">Upload New Track</h2>
            <p className="text-spotify-text text-sm mt-1">Files will be instantly available in the user client.</p>
          </div>

          <form id="uploadForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-spotify-text">Song Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tum Hi Ho"
                  className="bg-[#282828] text-white p-3 rounded-lg border border-transparent focus:border-spotify-accent focus:outline-none transition-colors"
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-spotify-text">Artist Name</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Arijit Singh"
                  className="bg-[#282828] text-white p-3 rounded-lg border border-transparent focus:border-spotify-accent focus:outline-none transition-colors"
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-bold text-spotify-text">Audio File (MP3, WAV)</label>
              <input 
                type="file" 
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="w-full text-sm text-spotify-text file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#282828] file:text-white hover:file:bg-[#3E3E3E] cursor-pointer"
                required 
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-bold text-spotify-text">Cover Art (JPG, PNG)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-sm text-spotify-text file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#282828] file:text-white hover:file:bg-[#3E3E3E] cursor-pointer"
                required 
              />
            </div>

            <hr className="border-[#282828] my-4" />

            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-spotify-accent text-black font-bold py-3.5 rounded-full hover:scale-[1.02] hover:bg-spotify-accentHover transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Uploading & Processing...
                </>
              ) : "Publish to Spotify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
