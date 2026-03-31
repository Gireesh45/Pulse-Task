import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, FileVideo } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const UploadModal = ({ isOpen, onClose, onUploadComplete }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const uploadVideo = async () => {
    if (!file || !title) return;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          setProgress(percentCompleted);
        }
      });
      onUploadComplete();
      onClose();
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setUploading(false);
      setFile(null);
      setTitle('');
      setProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-40"
            onClick={!uploading ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 pointer-events-none"
          >
            <div className="glass-panel rounded-3xl p-8 pointer-events-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                  Upload Video
                </h3>
                {!uploading && (
                  <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {!file ? (
                <div
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-700/50 hover:border-indigo-500/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-12 h-12 text-indigo-400 mb-4" />
                  <p className="text-gray-300 font-medium text-center">Drag & Drop your video here</p>
                  <p className="text-gray-500 text-sm mt-2">or click to browse from your computer</p>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <FileVideo className="w-8 h-8 text-indigo-400" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-gray-200 font-medium truncate">{file.name}</p>
                      <p className="text-gray-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    {!uploading && (
                      <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-400 cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Video Title"
                    className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl py-3 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={uploading}
                  />

                  {uploading && (
                     <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                       />
                     </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={uploadVideo}
                    disabled={uploading || !title}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {uploading ? `Uploading ${progress}%` : 'Start Upload'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
