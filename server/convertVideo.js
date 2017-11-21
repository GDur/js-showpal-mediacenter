const spawn = require('child_process').spawn,
    path = require('path'),
    TimeConverter = require('./TimeConverter').TimeConverter


const FFMPEG_BIN_PATH = path.normalize(__dirname) + '/ffmpeg.exe';


function convertVideo(videoPath, cb) {
    let duration;
    let progress;
    try {
        let options = [
            '-i', videoPath,
            '-c:a', 'libvorbis',
            '-c:v', 'copy',
            '-y',
            videoPath + '.converted.mkv']

        console.log(options.join(', '))
        const ffmpeg = spawn(FFMPEG_BIN_PATH, options);


        ffmpeg.stderr.on('data', function (data) {
            let durationRegEx = new RegExp('Duration: (.*), st')
            let foundA = data.toString().match(durationRegEx);
            if (foundA)
                duration = TimeConverter.timeToMs(foundA[1])

            let progressTimeRegEx = new RegExp('time=(.*) bit')
            let foundB = data.toString().match(progressTimeRegEx);
            if (foundB)
                progress = TimeConverter.timeToMs(foundB[1])

            if (progress && duration) {
                cb(progress, duration, false, null)
            }
        });

        ffmpeg.stderr.on('end', function () {
            // success
            cb(progress, duration, true, null)
        });

        ffmpeg.stderr.on('exit', function () {
            // console.log('child process exited');
            cb(progress, duration, false, 'There might have been an error')
        });

        ffmpeg.stderr.on('close', function () {
            cb(progress, duration, true, null)
            // console.log('...closing time! bye');
        });
    } catch (err) {
        // console.log(err)
        cb(null, null, false, 'There was an error :/' + err)
    }

}


exports.convertVideo = convertVideo