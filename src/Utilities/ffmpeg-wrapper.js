/**
 * Created by GDur on 08-Apr-17.
 */

const util = require('util'),
    spawn = require('child_process').spawn

let FFMPEG_BIN_PATH = process.env.FFMPEG_BIN_PATH || 'ffmpeg';

exports.ffmpegWrapper = function () {

    let _parseDuration = function (duration) {
        let d = duration.split(/[:.]/);
        return parseInt(d[0]) * 60 * 60 * 1000
            + parseInt(d[1]) * 60 * 1000
            + parseInt(d[2]) * 1000
            + parseInt(d[3])
    }

    this.getVideoInformation = function (videoFilePath, cb) {
        let self = this
        let child = spawn(FFMPEG_BIN_PATH, ['-i', '"' + videoFilePath + '"', '2>&1'], {shell: true});
        child.stdout.on('data', (data) => {
            data = data.toString()
            if (data) {
                const information = {
                    duration: self.extractVideoDuration(data),
                    audio: self.extractAudioCodec(data),
                    video: self.extractVideoCodec(data),
                    type: self.extractFileType(data)
                }
                cb(information)
            }
        });
        child.stderr.on('data', (data) => {
            console.error("error", data.toString());
        });
    }

    this.extractFileType = function (data) {
        data = data.toString()
        let d = /Input #0,(.*), from/gi.exec(data);

        if (d) {
            return d[1]
        }
    }
    this.extractAudioCodec = function (data) {
        data = data.toString()
        let d = /audio: (.*) /gi.exec(data);

        if (d) {
            return d[1]
        }
    }
    this.extractVideoCodec = function (data) {
        data = data.toString()
        let d = /video: (.*) /gi.exec(data);

        if (d) {
            return d[1]
        }
    }
    this.extractVideoDuration = function (data) {
        data = data.toString()
        let d = /duration: (\d+:\d+:\d+.\d+)/gi.exec(data);

        if (d) {
            return _parseDuration(d[1])
        }
    }

}

//
// PS F:\Downloads\JD\tmp\TV Shows\Fargo\Season 02> ffmpeg -i '.\Fargo - S02E09.mkv'
// ffmpeg version N-86911-gb664d1f Copyright (c) 2000-2017 the FFmpeg developers
// built with gcc 7.1.0 (GCC)
// configuration: --enable-gpl --enable-version3 --enable-cuda --enable-cuvid --enable-d3d11va --enable-dxva2 --enable-libmfx --enable-nvenc --enable-avisynth --enable-bzlib --enable-fontconfig --enable-frei0r --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libfreetype --enable-libgme --enable-libgsm --enable-libilbc --enable-libmodplug --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopus --enable-librtmp --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvo-amrwbenc --enable-libvorbis --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxavs --enable-libxvid --enable-libzimg --enable-lzma --enable-zlib
// libavutil      55. 69.100 / 55. 69.100
// libavcodec     57.102.100 / 57.102.100
// libavformat    57. 76.100 / 57. 76.100
// libavdevice    57.  7.100 / 57.  7.100
// libavfilter     6. 95.100 /  6. 95.100
// libswscale      4.  7.101 /  4.  7.101
// libswresample   2.  8.100 /  2.  8.100
// libpostproc    54.  6.100 / 54.  6.100
// Input #0, matroska,webm, from '.\Fargo - S02E09.mkv':
// Metadata:
//     encoder         : mkvmerge v6.1.0 ('Old Devil') built on Mar  2 2013 14:32:37
// Duration: 00:46:59.73, start: 0.000000, bitrate: 4009 kb/s
// Stream #0:0(eng): Video: h264 (High), yuv420p(progressive), 1280x720, SAR 1:1 DAR 16:9, 23.98 fps, 23.98 tbr, 1k tbn, 47.95 tbc (default)
// Stream #0:1(eng): Audio: ac3, 48000 Hz, 5.1(side), fltp, 384 kb/s (default)
// Stream #0:2(eng): Subtitle: subrip (default)
// Metadata:
//     title           : English
// At least one output file must be specified
// PS F:\Downloads\JD\tmp\TV Shows\Fargo\Season 02> ffmpeg -i '.\Fargo - S02E01.mkv'
// ffmpeg version N-86911-gb664d1f Copyright (c) 2000-2017 the FFmpeg developers
// built with gcc 7.1.0 (GCC)
// configuration: --enable-gpl --enable-version3 --enable-cuda --enable-cuvid --enable-d3d11va --enable-dxva2 --enable-libmfx --enable-nvenc --enable-avisynth --enable-bzlib --enable-fontconfig --enable-frei0r --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libfreetype --enable-libgme --enable-libgsm --enable-libilbc --enable-libmodplug --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopus --enable-librtmp --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvo-amrwbenc --enable-libvorbis --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxavs --enable-libxvid --enable-libzimg --enable-lzma --enable-zlib
// libavutil      55. 69.100 / 55. 69.100
// libavcodec     57.102.100 / 57.102.100
// libavformat    57. 76.100 / 57. 76.100
// libavdevice    57.  7.100 / 57.  7.100
// libavfilter     6. 95.100 /  6. 95.100
// libswscale      4.  7.101 /  4.  7.101
// libswresample   2.  8.100 /  2.  8.100
// libpostproc    54.  6.100 / 54.  6.100
// Input #0, matroska,webm, from '.\Fargo - S02E01.mkv':
// Metadata:
//     encoder         : libebml v1.3.0 + libmatroska v1.4.1
// creation_time   : 2015-10-13T03:06:48.000000Z
// Duration: 00:48:28.90, start: 0.000000, bitrate: 2574 kb/s
// Stream #0:0(eng): Video: h264 (High), yuv420p(tv, bt709/unknown/unknown, progressive), 1280x720, SAR 1:1 DAR 16:9, 23.98 fps, 23.98 tbr, 1k tbn, 47.95 tbc (default)
// Stream #0:1: Audio: ac3, 48000 Hz, 5.1(side), fltp, 384 kb/s (default)
// At least one output file must be specified
// PS F:\Downloads\JD\tmp\TV Shows\Fargo\Season 02> ffmpeg -i '.\Fargo - S02E03.mp4'
// ffmpeg version N-86911-gb664d1f Copyright (c) 2000-2017 the FFmpeg developers
// built with gcc 7.1.0 (GCC)
// configuration: --enable-gpl --enable-version3 --enable-cuda --enable-cuvid --enable-d3d11va --enable-dxva2 --enable-libmfx --enable-nvenc --enable-avisynth --enable-bzlib --enable-fontconfig --enable-frei0r --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libfreetype --enable-libgme --enable-libgsm --enable-libilbc --enable-libmodplug --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopus --enable-librtmp --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvo-amrwbenc --enable-libvorbis --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxavs --enable-libxvid --enable-libzimg --enable-lzma --enable-zlib
// libavutil      55. 69.100 / 55. 69.100
// libavcodec     57.102.100 / 57.102.100
// libavformat    57. 76.100 / 57. 76.100
// libavdevice    57.  7.100 / 57.  7.100
// libavfilter     6. 95.100 /  6. 95.100
// libswscale      4.  7.101 /  4.  7.101
// libswresample   2.  8.100 /  2.  8.100
// libpostproc    54.  6.100 / 54.  6.100
// Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '.\Fargo - S02E03.mp4':
// Metadata:
//     major_brand     : isom
// minor_version   : 1
// compatible_brands: isom
// creation_time   : 2011-09-08T11:43:25.000000Z
// Duration: 00:46:18.07, start: 0.000000, bitrate: 873 kb/s
// Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709/unknown/unknown), 720x404 [SAR 1:1 DAR 180:101], 735 kb/s, 23.98 fps, 23.98 tbr, 24k tbn, 47.95 tbc (default)
// Metadata:
//     creation_time   : 2011-09-08T11:43:25.000000Z
// encoder         : x264
// Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 131 kb/s (default)
// Metadata:
//     creation_time   : 2011-09-08T11:43:25.000000Z
// At least one output file must be specified
// PS F:\Downloads\JD\tmp\TV Shows\Fargo\Season 02> ffmpeg -i '.\Fargo - S02E02.mp4'
// ffmpeg version N-86911-gb664d1f Copyright (c) 2000-2017 the FFmpeg developers
// built with gcc 7.1.0 (GCC)
// configuration: --enable-gpl --enable-version3 --enable-cuda --enable-cuvid --enable-d3d11va --enable-dxva2 --enable-libmfx --enable-nvenc --enable-avisynth --enable-bzlib --enable-fontconfig --enable-frei0r --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libfreetype --enable-libgme --enable-libgsm --enable-libilbc --enable-libmodplug --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopus --enable-librtmp --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvo-amrwbenc --enable-libvorbis --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxavs --enable-libxvid --enable-libzimg --enable-lzma --enable-zlib
// libavutil      55. 69.100 / 55. 69.100
// libavcodec     57.102.100 / 57.102.100
// libavformat    57. 76.100 / 57. 76.100
// libavdevice    57.  7.100 / 57.  7.100
// libavfilter     6. 95.100 /  6. 95.100
// libswscale      4.  7.101 /  4.  7.101
// libswresample   2.  8.100 /  2.  8.100
// libpostproc    54.  6.100 / 54.  6.100
//     .\Fargo - S02E02.mp4: No such file or directory
// PS F:\Downloads\JD\tmp\TV Shows\Fargo\Season 02> ffmpeg -i '.\Fargo - S02E02.mkv'
// ffmpeg version N-86911-gb664d1f Copyright (c) 2000-2017 the FFmpeg developers
// built with gcc 7.1.0 (GCC)
// configuration: --enable-gpl --enable-version3 --enable-cuda --enable-cuvid --enable-d3d11va --enable-dxva2 --enable-libmfx --enable-nvenc --enable-avisynth --enable-bzlib --enable-fontconfig --enable-frei0r --enable-gnutls --enable-iconv --enable-libass --enable-libbluray --enable-libbs2b --enable-libcaca --enable-libfreetype --enable-libgme --enable-libgsm --enable-libilbc --enable-libmodplug --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopus --enable-librtmp --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libtheora --enable-libtwolame --enable-libvidstab --enable-libvo-amrwbenc --enable-libvorbis --enable-libvpx --enable-libwavpack --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxavs --enable-libxvid --enable-libzimg --enable-lzma --enable-zlib
// libavutil      55. 69.100 / 55. 69.100
// libavcodec     57.102.100 / 57.102.100
// libavformat    57. 76.100 / 57. 76.100
// libavdevice    57.  7.100 / 57.  7.100
// libavfilter     6. 95.100 /  6. 95.100
// libswscale      4.  7.101 /  4.  7.101
// libswresample   2.  8.100 /  2.  8.100
// libpostproc    54.  6.100 / 54.  6.100
// Input #0, matroska,webm, from '.\Fargo - S02E02.mkv':
// Metadata:
//     encoder         : libebml v1.3.0 + libmatroska v1.4.1
// creation_time   : 2015-10-20T03:18:47.000000Z
// Duration: 00:58:18.18, start: 0.000000, bitrate: 2687 kb/s
// Stream #0:0(eng): Video: h264 (High), yuv420p(tv, bt709/unknown/unknown, progressive), 1280x720, SAR 1:1 DAR 16:9, 23.98 fps, 23.98 tbr, 1k tbn, 47.95 tbc (default)
// Stream #0:1: Audio: ac3, 48000 Hz, 5.1(side), fltp, 384 kb/s (default)