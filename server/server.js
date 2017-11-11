const fs = require('fs'),
    path = require('path'),
    level = require('level'),
    express = require('express'),
    glob = require('glob'),
    config = require('../src/config.json'),
    convertVideo = require('./convertVideo').convertVideo,
    extractVideoInformation = require('./extractVideoInformation').extractVideoInformation

const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/conversionRequest', function (req, res) {

    let reqResource = req.query.videoPath;
    let videoPath = reqResource.replace(/%20/gi, ' ').replace(/\//gi, '/')

    extractVideoInformation(videoPath, (data, hasFinished, error) => {
        if (error) {
            console.log("ERROR:", error)
            return
        }
        if (hasFinished) {
            console.log('FINISHED:', (data))
        }
    })
    convertVideo(videoPath, (progress, duration, hasFinished, error) => {
        if (error) {
            console.log("ERROR:", error)
            // res.json({
            //     error: error
            // })
            return
        }
        if (hasFinished) {
            console.log('FINISHED')
            // res.json({
            //     finished: true
            // })
            return
        }
        if (progress && duration) {
            let data = {
                progress: progress,
                duration: duration,
                percent: progress / duration * 100
            }
            // res.json()
            console.log('PROGRESS:',
                data.progress + 'ms',
                data.duration + 'ms',
                data.percent + '%'
            )
        }
    })
})


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



app.get('/streamRequest', function (req, res) {
    let reqResource = req.query.tvShow;
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

