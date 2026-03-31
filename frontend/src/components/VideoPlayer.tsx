import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const VideoPlayer = ({ videoId, title, onClose }: { videoId: string, title: string, onClose: () => void }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
            <h2 className="text-white text-xl font-medium">{title}</h2>
          </div>
          <video 
            controls 
            autoPlay
            className="w-full h-full object-contain"
            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${videoId}/stream?token=${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : ''}`}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
