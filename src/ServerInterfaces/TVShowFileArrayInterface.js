/**
 * Created by GDur on 02-Apr-17.
 */
/* eslint-disable */

import path from 'path';
import NameBeautifier from '../Utilities/NameBeautifier';

export default class TVShowFileArrayInterface {

    requestFileArray(cb) {
        let action = 'getFileArrayFromTvShowFolder'

        function checkStatus(response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            let error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            // console.log(error); // eslint-disable-line no-console
            throw error;
        }


        function parseJSON(response) {
            return response.json();
        }

        // fetch('http://api.tvmaze.com/singlesearch/shows?q=rick%20and%20morty&embed=episodes', {
        //     accept: 'application/json'
        // }).then(checkStatus).then(parseJSON).then(function(data){
        //     console.log('wad', data)
        // });


        return fetch(action, {accept: 'application/json'}).then(checkStatus).then(parseJSON).then(this.beautifyData).then(cb);
    }


    beautifyData(data) {

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
                path.extname(filePath) === '.ogg' ||
                path.extname(filePath) === '.part' || // important for in download progress shows 
                path.extname(filePath) === '.mpeg'
        }

        let tvShowFileArray = data.files
        let basePath = data.basePath

        // console.log(data)


        function Series(name, list) {
            this.name = name || 'undefined'
            this.episodes = list || []
            this.addEpisode = (e) => {
                this.episodes.push(e)
            }
            this.sortEpisodes = () => {
                this.episodes = this.episodes.sort((x, y) => {
                    return x.getValue() - y.getValue()
                })
            }
        }


        function Episode(fullFilePath) {
            this.fullFilePath = fullFilePath || 'undefined'
            this.values = NameBeautifier(path.basename(this.fullFilePath))
            this.getBeautifiedName = function () {
                return this.values.beautifiedName
            }
            this.getValue = function () {
                return this.values.value
            }
        }


        let convertedSeries = []
        // create new series if it not already exists
        let series = [];
        for (let i = 0; i < tvShowFileArray.length; i++) {
            let fullFilePath = tvShowFileArray[i]
            let filePath = path.relative(basePath, fullFilePath)

            if (fullFilePath.indexOf('.converted.mkv') >= 0) {
                convertedSeries.push(fullFilePath)
            }
            let seriesName = filePath.split('/').shift()

            let seriesExists = false
            for (let j = 0; j < series.length; j++) {
                if (series[j].name === seriesName) {
                    seriesExists = true
                    break
                }
            }
            if (!seriesExists)
                series.push(new Series(seriesName))

        }
        console.log(convertedSeries, 'ztest')

        // add episodes to Series
        return tvShowFileArray.reduce((acc, fullFilePath) => {
            let filePath = path.relative(basePath, fullFilePath)
            let seriesName = filePath.split('/').shift()

            series.filter((series) => {
                if (series.name === seriesName) {
                    if (convertedSeries.indexOf(fullFilePath + '.converted.mkv') < 0)
                        series.addEpisode(new Episode(fullFilePath))
                }
            })


            return acc
        }, {
            series: series,
            lastUpdatedDate: data.lastUpdatedDate,
            changedFiles: data.changedFiles
        })
    }
}