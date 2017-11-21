const spawn = require('child_process').spawn,
    path = require('path'),
    TimeConverter = require('./TimeConverter').TimeConverter

const FFMPEG_BIN_PATH =  path.normalize(__dirname) + '/ffmpeg.exe';

exports.extractVideoInformation = function (videoPath) {
    return new Promise((resolve, reject) => {
        let eData = {};
        try {
            let options = [
                '-i', videoPath
            ]

            const ffmpeg = spawn(FFMPEG_BIN_PATH, options)

            ffmpeg.stderr.on('data', function (data) {
                let dataString = data.toString()
                // console.log('================================', dataString)

                let v = dataString.match(new RegExp('Video: (.+?)? '));
                if (v && v[1])
                    eData.video = v[1]

                let a = dataString.match(new RegExp('Audio: (.+?)? '))
                if (a && a[1])
                    eData.audio = a[1]

                let e = dataString.match(new RegExp('encoder *: (.*)', 'gi'))
                if (e && e[0])
                    eData.encoding = e[0].split(': ')[1]

                let d = dataString.match(new RegExp('Duration: (.*?)?,'))
                if (d && d[1]) {
                    eData.duration = TimeConverter.timeToMs(d[1])
                }
            });

            ffmpeg.stderr.on('end', function () {
                // success
                // cb(eData, true, null)
                resolve(eData);
            });

            ffmpeg.stderr.on('exit', function () {
                // console.log('child process exited');
                // cb(eData, false, 'There might have been an error')
                reject('There might have been an error');
            });
        } catch (err) {
            // console.log(err)
            reject(err);
            // cb(eData, false, 'There was an error :/' + err)
        }
    })
}