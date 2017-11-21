const extractVideoInformation = require('./extractVideoInformation').extractVideoInformation,
    assert = require('assert')

extractVideoInformation(
    'D:\\Downloads\\JD\\TV Shows\\The Last Man On Earth\\The Last Man On Earth S03E15\\The Last Man On Earth S03E16 HDTV x264-RBB.mp4')
    .then((data) => {
        console.log('FINISHED:', data)
        assert.deepEqual(data, {
            encoding: 'Lavf56.32.100',
            duration: '126300060',
            video: 'h264',
            audio: 'aac'
        })
    })

extractVideoInformation(
    'D:\\Downloads\\JD\\TV Shows\\Brooklyn Nine Nine\\Brooklyn nine-nine s05\\Brooklyn Nine Nine S05E01 PROPER 720p HDTV x264 BATV mkv.mp4')
    .then((data) => {
        console.log('FINISHED:', data)
        assert.deepEqual(data, {
            video: 'h264',
            encoding: 'Lavf57.44.100',
            duration: '128300035',
            audio: 'aac'
        })
    })
