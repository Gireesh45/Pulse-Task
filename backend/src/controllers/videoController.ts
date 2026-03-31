import { Request, Response } from 'express';
import Video from '../models/Video';
import { AuthRequest } from '../middleware/authMiddleware';
import { processVideo } from '../services/videoProcessor';

export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    const { title, description } = req.body;

    const video = await Video.create({
      title,
      description,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user?._id,
      organizationId: req.user?.organizationId
    });

    res.status(201).json(video);

    processVideo(video.id, req.file.path);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

import fs from 'fs';
import path from 'path';

export const streamVideo = async (req: AuthRequest, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
        res.status(404).json({ message: 'Video not found' });
        return;
    }
    
    if (video.organizationId.toString() !== req.user?.organizationId.toString()) {
        res.status(403).json({ message: 'Not authorized' });
        return;
    }

    const videoPath = path.join(process.cwd(), 'uploads', video.filename);
    
    if (!fs.existsSync(videoPath)) {
        res.status(404).json({ message: 'Video file missing' });
        return;
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': video.mimetype,
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.mimetype,
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideos = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = { organizationId: req.user?.organizationId };
    if (req.query.status) {
        filter.safetyStatus = req.query.status;
    }
    const videos = await Video.find(filter).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
