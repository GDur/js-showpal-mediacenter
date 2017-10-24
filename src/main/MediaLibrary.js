/**
 * Created by GDur on 10.07.2017.
 */

import TVShowFileArrayInterface from '../ServerInterfaces/TVShowFileArrayInterface.js';
let tVShowFileArrayInterface = new TVShowFileArrayInterface()

export default function MediaLibrary() {
    const self = this
    // constuctor

    // definitions
    self.startWatchingMediaFolder = (cb) => {
        self.scan(cb)
        setInterval(() => {
            self.scan(cb)
        }, 25000)
    }

    self.scan = function (cb) {
        tVShowFileArrayInterface.requestFileArray((data) => {
            // console.log(data)
            if(cb)
                cb(data)
        })
    }
}
