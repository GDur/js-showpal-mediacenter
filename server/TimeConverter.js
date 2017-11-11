/**
 * This Class can convert Milliseconds to a time string and vise versa.
 * Eg.: 5030 => 00:00:06:30, 00:00:06:30 => 5030
 * @constructor
 */
exports.TimeConverter = new function () {
    this.msToTime = function (duration) {
        let milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds //+ "." + leftPad(milliseconds, 3, 0);
    }

    this.timeToMs = function (tmeString) {
        let durationRegEx = new RegExp('(\\d\\d):(\\d\\d):(\\d\\d).(\\d+)')
        let foundA = tmeString.toString().match(durationRegEx);
        if (foundA && foundA.length === 5) {
            return (foundA[1] * 60 * 60 * 1000) + (foundA[2] * 60 * 1000) + (foundA[3] * 1000) + foundA[4]
        }
        console.error('The time string was not as expected:', foundA)
        return 0
    }
}