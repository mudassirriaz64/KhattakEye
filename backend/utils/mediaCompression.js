const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Set the path to the ffmpeg & ffprobe binaries
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

/**
 * Probes a video file to retrieve its exact duration in seconds.
 * @param {string} inputPath - Path to the video file
 * @returns {Promise<number>} - Duration in seconds
 */
const getVideoDuration = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata?.format?.duration;
      if (duration === undefined || isNaN(Number(duration))) {
        return reject(new Error('Unable to determine video duration'));
      }
      resolve(Number(duration));
    });
  });
};

/**
 * Compresses an image or video file using ffmpeg.
 * @param {string} inputPath - Path to the original file
 * @param {string} resourceType - Type of resource (image or video)
 * @returns {Promise<string>} - Path to the compressed temporary file
 */
const compressMedia = async (inputPath, resourceType = 'image') => {
  const ext = resourceType === 'image' ? '.jpg' : '.mp4';
  const outputPath = path.join(os.tmpdir(), `compressed_${Date.now()}_${path.basename(inputPath, path.extname(inputPath))}${ext}`);

  if (resourceType === 'image') {
    // Use sharp for images - handles HEIC/HEIF, EXIF auto-rotation, and resizing
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    return outputPath;
  }

  // Use ffmpeg for videos
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .outputOptions([
        '-vf scale=\'min(1080,iw)\':\'min(1080,ih)\':force_original_aspect_ratio=decrease',
        '-c:v libx264',
        '-crf 28',
        '-preset veryfast',
        '-c:a aac',
        '-b:a 128k'
      ])
      .output(outputPath);

    command
      .on('end', () => resolve(outputPath))
      .on('error', (err) => {
        console.error('Media compression error:', err);
        reject(err);
      })
      .run();
  });
};

module.exports = { compressMedia, getVideoDuration };
