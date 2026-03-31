import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { UploadModal } from '../components/UploadModal';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { LogOut, Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [videos, setVideos] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos${filter ? `?status=${filter}` : ''}`);
      setVideos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [filter]);

  useEffect(() => {
    if (socket) {
      socket.on('video-progress', (update: any) => {
        setVideos(prev => prev.map(v => 
          v._id === update.videoId 
            ? { ...v, processingStatus: update.status, processingProgress: update.progress, safetyStatus: update.safetyStatus || v.safetyStatus }
            : v
        ));
      });
    }
    return () => {
      if (socket) socket.off('video-progress');
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100 flex flex-col">
      <header className="sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white tracking-widest text-lg">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">VideoPlatform</h1>
              <p className="text-xs text-indigo-400 font-medium">{user?.organizationId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            </div>
            
            <div className="h-6 w-px bg-gray-800" />
            
            <button 
              onClick={logout} 
              className="text-gray-400 hover:text-red-400 transition-colors flex items-center text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold">Video Library</h2>
            <p className="text-gray-400 mt-1">Manage and stream your organization's content</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <select 
                className="bg-gray-900/80 border border-gray-800 rounded-lg py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="">All Videos</option>
                <option value="Safe">Safe</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
            
            {(user?.role === 'Editor' || user?.role === 'Admin') && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUploadOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Video
              </motion.button>
            )}
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800/50 border-dashed">
             <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-500" />
             </div>
             <h3 className="text-xl font-medium text-gray-300">No videos found</h3>
             <p className="text-gray-500 mt-2 text-center max-w-md">Your library is empty. Upload your first video to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} onPlay={setActiveVideo} />
            ))}
          </div>
        )}
      </main>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadComplete={fetchVideos} 
      />

      {activeVideo && (
        <VideoPlayer 
          title={activeVideo.title}
          videoId={activeVideo._id} 
          onClose={() => setActiveVideo(null)} 
        />
      )}
    </div>
  );
};
