const convertVideo = require('./convertVideo').convertVideo

convertVideo(
    "D:\\Downloads\\JD\\TV Shows\\" +
    "Brooklyn Nine Nine\\Brooklyn nine-nine s05\\Brooklyn Nine Nine S05E01 PROPER 720p HDTV x264 BATV mkv.mp4", (progress, duration, hasFinished, error) => {
        if (error) {
            console.log("ERROR:", error)
            return
        }
        if (hasFinished) {
            console.log('FINISHED')
            return
        }
        if (progress && duration) {
            console.log('PROGRESS:', timeToMs(progress) + 'ms', timeToMs(duration) + 'ms', (timeToMs(progress) / timeToMs(duration) * 100 ) + '%')
        }
    })