import ffmpeg from 'fluent-ffmpeg';
import Video, { ProcessingStatus, SafetyStatus } from '../models/Video';
import { io } from '../server';
import path from 'path';
import fs from 'fs';

export const processVideo = async (videoId: string, inputPath: string) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) return;

    video.processingStatus = ProcessingStatus.Processing;
    await video.save();
    io.emit('video-progress', { videoId, status: video.processingStatus, progress: 0 });

    const outputPath = path.join(path.dirname(inputPath), `processed_${path.basename(inputPath)}`);
    const isFlagged = Math.random() > 0.8; 

    ffmpeg(inputPath)
      .outputOptions(['-movflags faststart', '-vcodec copy', '-acodec copy'])
      .save(outputPath)
      .on('progress', (progress) => {
        let percent = progress.percent ? Math.round(progress.percent) : 0;
        if (percent > 100) percent = 100;
        
        io.emit('video-progress', { videoId, status: ProcessingStatus.Processing, progress: percent });
        Video.findByIdAndUpdate(videoId, { processingProgress: percent }).exec();
      })
      .on('end', async () => {
        video.processingStatus = ProcessingStatus.Ready;
        video.safetyStatus = isFlagged ? SafetyStatus.Flagged : SafetyStatus.Safe;
        video.filename = `processed_${path.basename(inputPath)}`;
        video.processingProgress = 100;
        await video.save();

        io.emit('video-progress', { videoId, status: video.processingStatus, progress: 100, safetyStatus: video.safetyStatus });
        
        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }
      })
      .on('error', async (err) => {
        console.warn('FFmpeg error, falling back to simulated pipeline:', err.message);
        simulateProcessing(video, inputPath, isFlagged);
      });
  } catch (err) {
    console.error('Process Video Error:', err);
  }
};

const simulateProcessing = async (video: any, inputPath: string, isFlagged: boolean) => {
    let progress = 0;
    const interval = setInterval(async () => {
        progress += 20;
        if (progress >= 100) {
            clearInterval(interval);
            video.processingStatus = ProcessingStatus.Ready;
            video.safetyStatus = isFlagged ? SafetyStatus.Flagged : SafetyStatus.Safe;
            video.processingProgress = 100;
            await video.save();
            io.emit('video-progress', { videoId: video._id, status: video.processingStatus, progress: 100, safetyStatus: video.safetyStatus });
        } else {
            video.processingProgress = progress;
            await video.save();
            io.emit('video-progress', { videoId: video._id, status: ProcessingStatus.Processing, progress });
        }
    }, 1000);
};
