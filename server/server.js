const fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    level = require('level'),
    leftPad = require('left-pad')
const util = require('util'),
    EventEmitter = require('events').EventEmitter,
    child_process = require('child_process'),
    spawn = require('child_process').spawn,
    readline = require('readline'),
    os = require('os');


process.env['FFMPEG_BIN_PATH'] = path.normalize(__dirname) + '/ffmpeg.exe';

const FFMPEG_BIN_PATH = process.env.FFMPEG_BIN_PATH || 'ffmpeg';
const express = require('express'),
    glob = require('glob'),
    config = require('../src/config.json'),
    ffmpegWrapper = require('../src/Utilities/ffmpeg-wrapper').ffmpegWrapper

const FFMPEG = new ffmpegWrapper()


const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
const db = new level('./showpal-db')

app.post('/leveldb/put', function (req, res) {
    db.put(req.query.key, req.query.value, function (err) {
        if (err)
            res.json({err: err.message})
        else
            res.json({err: null})
    })
})
app.post('/leveldb/get', function (req, res) {
    db.get(req.query.key, function (err, value) {
        if (err)
            res.json({err: err.message})
        else
            res.json({err: null, value: value})
    })
})
// let dirName = __dirname + '/public'
let basePath = config.tvShowPath

let cachedFiles = []
let folderHasChanged = false
let changedFiles = []
let lastUpdatedDate = 0

fs.watch(basePath, {
    encoding: 'utf-8',
    'recursive': true
}, (eventType, filename) => {
    if ('rename' === eventType && filename) {
        console.log('folderHasChanged:', eventType, filename);
        folderHasChanged = true
        changedFiles.push(filename)
    }
});

app.get('/getFileArrayFromTvShowFolder', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (lastUpdatedDate === 0 || folderHasChanged) {
        console.log('sending new list')
        // .{mkv,mp4,avi,flv,wmv,mov,webm,mpg,mpeg, part}
        glob(basePath + '/**/*', function (err, files) {
            if (files) {
                files = files.filter((filePath) => {
                    return path.extname(filePath) === '.mkv' ||
                        path.extname(filePath) === '.mp4' ||
                        path.extname(filePath) === '.mkv' ||
                        path.extname(filePath) === '.avi' ||
                        path.extname(filePath) === '.flv' ||
                        path.extname(filePath) === '.wmv' ||
                        path.extname(filePath) === '.mov' ||
                        path.extname(filePath) === '.webm' ||
                        path.extname(filePath) === '.mpg' ||
                        path.extname(filePath) === '.ogg' ||
                        path.extname(filePath) === '.part' || // important for in download progress shows
                        path.extname(filePath) === '.mpeg'
                });
                cachedFiles = files

                lastUpdatedDate = new Date();

                sendCachedFiles(res)
                changedFiles = []
            }

        });
    } else {
        console.log('sending cached list')
        sendCachedFiles(res)
    }
    folderHasChanged = false
})


function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds //+ "." + leftPad(milliseconds, 3, 0);
}


app.get('/conversionRequest', function (req, res) {

    let reqResource = req.query.tvShow;
    let videoPath = reqResource.replace(/%20/gi, ' ').replace(/\//gi, '/')
    // const spawnCommand = 'ffmpeg -i \'' + videoPath + '\' -c:a libvorbis -c:v copy test_s03E09.mkv'

    //ffmpeg -i '' -c:a libvorbis -c:v copy test_s03E09.mkv
    try {
        const ffmpeg = spawn(FFMPEG_BIN_PATH, [
            '-accurate_seek',
            '-i', videoPath,
            '-acodec', 'libvorbis',
            '-vcodec', 'h264', // or copy
            '-f', 'mkv',
            videoPath + '.mkv']);


        ffmpeg.stderr.on('data', function (data) {
            console.log(data.toString());
            // ffmpeg.stdin.write('q')
        });

        ffmpeg.stderr.on('end', function () {
            console.log('file has been converted succesfully');
            // ffmpeg.stdin.write('q')
        });

        ffmpeg.stderr.on('exit', function () {
            console.log('child process exited');
            // ffmpeg.stdin.write('q')
        });

        ffmpeg.stderr.on('close', function () {
            // ffmpeg.stdin.write('q')
            console.log('...closing time! bye');
        });
    } catch (err) {
        console.log(err)
    }
})
app.get('/streamRequest', function (req, res) {
    let reqResource = req.query.tvShow;
    // let seekPositionPercentage = req.query.seek || 0;
    console.log(reqResource)

    let videoPath = reqResource.replace(/%20/gi, ' ').replace(/\//gi, '/')
    let stat = fs.statSync(videoPath);
    let total = stat.size;

    let range = req.headers.range

    let parts = range.replace(/bytes=/, "").split("-")
    let partialStart = parts[0]
    let partialEnd = parts[1]

    let start = parseInt(partialStart, 10)
    let end = partialEnd ? parseInt(partialEnd, 10) : total - 1

    let file = fs.createReadStream(videoPath, {start: start, end: end});

    res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4'
    });
    file.pipe(res);

})


function sendCachedFiles(res) {
    console.log(changedFiles);
    res.json({
        basePath: basePath.split(path.sep).join('/'),
        files: cachedFiles,
        lastUpdatedDate: lastUpdatedDate,
        changedFiles: changedFiles
    })
}

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})