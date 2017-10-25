/**
 * Created by GDur on 02-Apr-17.
 */
import React from 'react';
import {findDOMNode} from 'react-dom'
import {Grid, Row, Col} from 'react-flexbox-grid';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SnackBar from 'material-ui/Snackbar';
import ScreenFull from 'screenfull'
import PlayerView from './PlayerView';
import ShowPaper from './ShowPaper';
import Level from '../Utilities/leveldb'
import MediaLibrary from '../main/MediaLibrary'
// import NameBeautifier from "../Utilities/NameBeautifier";
// import path from "path";


let mediaLibrary = new MediaLibrary()


injectTapEventPlugin();

let db = new Level()
// let tVShowFileArrayInterface = new TVShowFileArrayInterface()

export default class ShowOverviewView extends React.Component {
    constructor(props) {
        super(props)
        let self = this
        let lastUpdatedDate = 0
        this.state = {
            series: [],
            videoStreamPath: '',
            message: 'no message',
            open: false,
            firstTimeOpened: true,
        }

        function removeDuplicates(a) {
            let seen = {};
            return a.filter(function (item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        }

        mediaLibrary.startWatchingMediaFolder((data) => {
            // console.log(data , lastUpdatedDate)

            if (new Date(data.lastUpdatedDate) > lastUpdatedDate) {
                lastUpdatedDate = new Date(data.lastUpdatedDate)

                let changedFiles = data.changedFiles.map((file) => {

                    let tmpSplit = file.split('\\')

                    if (tmpSplit.length < 1) {
                        return file
                    }
                    let tmpEpisode = tmpSplit[0]
                    // if (tmpSplit.length > 1) {
                    //     tmpEpisode += " - " + NameBeautifier(tmpSplit[1]).beautifiedName
                    // }
                    return tmpEpisode // + '' +  path.extname(file)
                })
                console.log("Updates: ", changedFiles)
                if (changedFiles.length > 0) {
                    this.setState({
                        open: true,
                        message: `${removeDuplicates(changedFiles).join(', ')} changed`,
                    });

                }
                self.setState({series: data.series})


                if (self.state.firstTimeOpened) {

                    self.setState({firstTimeOpened: false})
                    // this will get the last Played series,
                    // play it for a short time and then pause it
                    // therefore the user can see the video image frozen
                    // and opt in to resume it via the space key
                    db.get('lastPlayed', (err, value) => {
                        if (err) {
                        } else {
                            let series = self.state.series.find((series) => {
                                return series.name === value.playedSeries.name
                            })

                            self.player.resumeSeries(series, () => {
                                setTimeout(() => {
                                    self.player.pauseVideo()
                                }, 300)
                            })
                        }
                    })
                }
            }
        })
        // tVShowFileArrayInterface.requestFileArray((data) => {
        //     self.setState({series: data.series})
        // })

        this.letterStyleSmall = {
            position: "fixed",
            background: "white",
            bottom: 0,
            right: 0,
            width: "300px",
            margin: '110px 20px',
            padding: 2,
            zIndex: 9,
            boxShadow: "1px 1px 12px 4px rgba(0, 0, 0, 0.37)"
        };
        this.letterStyleFullscreen = {
            position: "fixed",
            background: "black",
            width: '100%',
            height: '100%'
        };
    }

    componentDidMount() {

        this.setState({
            playerStyleState: this.letterStyleSmall
        })
    }

    resumeSeries(series, cb) {
        this.player.resumeSeries(series, cb)
    }

    resumeEpisode(series, episode) {
        //this.saveLastSeenEpisodeOfSpecificSeries(series, episode)
        this.player.resumeEpisode(series, episode)
    }

    onClickFullscreen = () => {
        this.setState({
            playerStyleState: this.letterStyleFullscreen
        })
        ScreenFull.request(findDOMNode(this.player))
    }

    render() {
        let self = this
        let l = this.state.series.map((series, i) => {
            series.sortEpisodes()

            return (
                <Col key={series.name} xs={12} sm={6} md={4} lg={3}>
                    <ShowPaper index={i} series={series} player={self.player}/>
                </Col>
            )
        })


        return (
            <div>
                <img className="background" alt="background" src={require('../images/background.png')}/>
                <div className="banner">ShowPal</div>
                <PlayerView
                    ref={player => {
                        this.player = player
                    }}
                />
                {/*<video controls src="streamRequest?tvShow=D:/Downloads/JD/TV Shows/The Expanse/The Expanse - S02E05.mkv&seek=0.5">*/}
                    {/*<track kind="subtitles" label="English subtitles" src="subtitle/" srclang="en" default></track>*/}
                {/*</video>*/}

                <Grid className="series-list" fluid>
                    <Row>
                        {l}
                    </Row>
                </Grid>
                <SnackBar
                    open={this.state.open}
                    message={this.state.message}
                    // action="undo"
                    autoHideDuration={5000}
                    // onRequestClose={this.handleRequestClose}
                />
            </div>
        )
    }
}