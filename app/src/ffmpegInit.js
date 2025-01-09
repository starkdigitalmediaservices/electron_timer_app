const path = require('path');
const fs = require('fs');
const ffmpegStatic = require('ffmpeg-static');

function initializeFFmpeg() {
  if (process.platform === 'win32') {
    const ffmpegPath = ffmpegStatic.replace('app.asar', 'app.asar.unpacked');
    const ffmpegDestPath = path.join(process.resourcesPath, 'ffmpeg.exe');

    if (!fs.existsSync(ffmpegDestPath)) {
      fs.copyFileSync(ffmpegPath, ffmpegDestPath);
    }

    process.env.FFMPEG_PATH = ffmpegDestPath;
  } else {
    process.env.FFMPEG_PATH = ffmpegStatic;
  }
}

module.exports = { initializeFFmpeg };

