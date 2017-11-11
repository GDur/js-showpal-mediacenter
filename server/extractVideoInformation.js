const spawn = require('child_process').spawn,
    path = require('path'),
    TimeConverter = require('./TimeConverter').TimeConverter

const FFMPEG_BIN_PATH =  path.normalize(__dirname) + '/ffmpeg.exe';



exports.extractVideoInformation = function (videoPath, cb) {

    // let myFirstPromise = new Promise((resolve, reject) => {
    //     // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    //     // In this example, we use setTimeout(...) to simulate async code.
    //     // In reality, you will probably be using something like XHR or an HTML5 API.
    //     setTimeout(function () {
    //         resolve("Success!"); // Yay! Everything went well!
    //     }, 250);
    // });
    //
    // myFirstPromise.then((successMessage) => {
    //     // successMessage is whatever we passed in the resolve(...) function above.
    //     // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
    //     console.log("Yay! " + successMessage);
    // });
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
            cb(eData, true, null)
        });
        //
        ffmpeg.stderr.on('exit', function () {
            // console.log('child process exited');
            cb(eData, false, 'There might have been an error')
        });

    } catch (err) {
        // console.log(err)
        cb(eData, false, 'There was an error :/' + err)
    }

}