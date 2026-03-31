import React from 'react';
import { Play, ShieldAlert, ShieldCheck, Clock, FileWarning } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoCard = ({ video, onPlay }: any) => {
  const isReady = video.processingStatus === 'Ready';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel overflow-hidden rounded-2xl group flex flex-col relative"
    >
      <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
        {isReady && video.safetyStatus === 'Safe' ? (
          <button 
            onClick={() => onPlay(video)}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-all shadow-lg text-white opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        ) : !isReady ? (
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
             <div className="text-sm font-medium text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full">
               {video.processingStatus} {video.processingProgress}%
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-red-400">
             <ShieldAlert className="w-12 h-12 mb-2 opacity-50" />
             <span className="text-sm font-bold uppercase tracking-wider bg-red-500/10 px-3 py-1 rounded-md">Flagged Content</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-100 line-clamp-1 mb-1">{video.title}</h3>
        <p className="text-xs text-gray-400 mb-4">{new Date(video.createdAt).toLocaleDateString()}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {video.safetyStatus === 'Safe' ? (
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3 h-3 mr-1" /> Safe
              </span>
            ) : video.safetyStatus === 'Flagged' ? (
              <span className="flex items-center text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md">
                <FileWarning className="w-3 h-3 mr-1" /> Flagged
              </span>
            ) : (
              <span className="flex items-center text-xs font-medium text-gray-400 bg-gray-400/10 px-2.5 py-1 rounded-md">
                <Clock className="w-3 h-3 mr-1" /> Checking
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-mono">{(video.size / (1024*1024)).toFixed(1)} MB</span>
        </div>
      </div>
    </motion.div>
  );
};
