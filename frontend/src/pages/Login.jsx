import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        toast.success("Login Successful!");
        navigate('/admin');
      }
    } catch (err) {
      toast.error("Invalid Credentials");
      setError("Incorrect username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24">
      <div className="mb-10 flex items-center gap-2">
        <i className="fa-brands fa-spotify text-spotify-accent text-[2.5rem]"></i>
        <h1 className="text-white text-3xl font-bold">Spotify</h1>
      </div>

      <motion.div 
        className="bg-[#121212] w-full max-w-[734px] rounded-lg p-[72px] shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white text-[32px] font-bold text-center mb-[40px]">
          Log in to Spotify Admin
        </h2>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="bg-[#e22134] text-white text-sm font-semibold p-3 mb-6 rounded flex items-center gap-2"
          >
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5 max-w-[324px] mx-auto w-full">
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-bold">Username</label>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#121212] text-white p-3.5 rounded border border-[#727272] hover:border-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-bold">Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#121212] text-white p-3.5 rounded border border-[#727272] hover:border-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-spotify-accent text-black font-bold p-3.5 rounded-full mt-4 hover:bg-spotify-accentHover hover:scale-[1.04] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
