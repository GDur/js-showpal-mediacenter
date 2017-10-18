/**
 * Created by GDur on 08-Apr-17.
 */

function isVideoFile(filePath) {
    return path.extname(filePath) === '.mkv' ||
        path.extname(filePath) === '.mp4' ||
        path.extname(filePath) === '.mkv' ||
        path.extname(filePath) === '.avi' ||
        path.extname(filePath) === '.flv' ||
        path.extname(filePath) === '.wmv' ||
        path.extname(filePath) === '.mov' ||
        path.extname(filePath) === '.webm' ||
        path.extname(filePath) === '.mpg' ||
        path.extname(filePath) === '.mpeg'
}