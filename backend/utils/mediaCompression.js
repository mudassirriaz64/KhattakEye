const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
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
const compressMedia = (inputPath, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    // Generate a temporary file path
    const ext = resourceType === 'image' ? '.jpg' : '.mp4';
    const outputPath = path.join(os.tmpdir(), `compressed_${Date.now()}_${path.basename(inputPath, path.extname(inputPath))}${ext}`);

    let command = ffmpeg(inputPath);

    if (resourceType === 'image') {
      // Image compression: scale to max 1200px width/height preserving aspect ratio, output as JPEG with qscale
      command = command
        .outputOptions([
          '-vf scale=\'min(1200,iw)\':\'min(1200,ih)\':force_original_aspect_ratio=decrease',
          '-q:v 5' // Quality scale for JPEG
        ])
        .output(outputPath);
    } else {
      // Video compression: scale, convert to mp4, compress bitrate
      command = command
        .outputOptions([
          '-vf scale=\'min(1080,iw)\':\'min(1080,ih)\':force_original_aspect_ratio=decrease',
          '-c:v libx264',
          '-crf 28', // Constant Rate Factor (0-51, 28 is good compression)
          '-preset veryfast',
          '-c:a aac',
          '-b:a 128k'
        ])
        .output(outputPath);
    }

    command
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Media compression error:', err);
        reject(err);
      })
      .run();
  });
};

module.exports = { compressMedia, getVideoDuration };
