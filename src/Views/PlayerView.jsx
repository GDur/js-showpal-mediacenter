/**
 * Created by GDur on 02-Apr-17.
 */
/**
 * Created by GDur on 07.03.2017.
 */

import React, {Component} from 'react'
import Slider from 'material-ui/Slider';
import {findDOMNode} from 'react-dom'
import ScreenFull from 'screenfull'
import ReactPlayer from 'react-player'
import Duration from './Duration'
import Level from '../Utilities/leveldb'
import AVPause from 'material-ui/svg-icons/av/pause';
import AVPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AVSkipNext from 'material-ui/svg-icons/av/skip-next';
import AVSkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import AVVolumeOff from 'material-ui/svg-icons/av/volume-off';
import AVVolumeUp from 'material-ui/svg-icons/av/volume-up';
import AVVolumeDown from 'material-ui/svg-icons/av/volume-down';
import NavigationFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';
import {Grid, Row, Col} from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import Mousetrap from 'mousetrap';


let db = new Level()

export default class PlayerView extends Component {
    state = {
        url: null,
        playing: true,
        fullScreen: false,
        volume: 0.5,
        played: 0,
        loaded: 0,
        muted: false,
        duration: 0,
        playbackRate: 1.0,
        firstSlider: .5,
        mouseMovedNotSince: 99999,
        keyRecentlyPressed: false,
    }
    onMouseMove = () => {
        this.setState({mouseMovedNotSince: 0})
    }
    // componentDidMount = () => {
    //     let self = this
    //     if (this.player)
    //         console.log(self.player.player.player)
    // }
    componentWillMount = () => {
        // mouseMovedNotSince
        let self = this
        Mousetrap.bind('space', function (e) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            if(self.state.playing)
                self.showUIForShortTime(<AVPause/>)
            else
                self.showUIForShortTime(<AVPlayArrow/>)
            self.playPause()
        });
        Mousetrap.bind('ctrl+right', function (e) {
            console.log(' c r')
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            self.playNextEpisode()
            self.showUIForShortTime(<AVSkipNext/>)
        });

        Mousetrap.bind('ctrl+left', function (e) {

            console.log(' cl')
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            self.playPreviousEpisode()
            self.showUIForShortTime(<AVSkipPrevious/>)
        });
        Mousetrap.bind('up', function (e) {

            console.log('up')
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            self.volumeUp()
            self.showUIForShortTime(<AVVolumeUp/>)
        });
        Mousetrap.bind('down', function (e) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            self.volumeDown()
            self.showUIForShortTime(<AVVolumeDown/>)
        });

        Mousetrap.bind('f11', function (e) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            if(self.state.fullScreen)
                self.showUIForShortTime(<NavigationFullscreenExit/>)
            else
                self.showUIForShortTime(<NavigationFullscreen/>)
            self.onClickFullscreen()
        });
        Mousetrap.bind('plus', function (e) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            self.setPlaybackRate(self.state.playbackRate + .25)
            self.showUIForShortTime('x' + self.state.playbackRate)
        });
        let intervalRewind;
        let fakeNegativeSpeed = 0;
        Mousetrap.bind('-', function (e) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }

            if (self.state.playbackRate - .25 >= 0) {
                self.setPlaybackRate(self.state.playbackRate - .25)
                console.log(self.state.playbackRate, "playbackrate 0")

                clearInterval(intervalRewind);
            } else {
                console.log(self.state.playbackRate, "playbackrate negative")
                fakeNegativeSpeed -= .25
                intervalRewind = setInterval(function () {
                    self.setPlaybackRate(1)
                    // duration * played
                    if (self.state.played === 0) {
                        clearInterval(intervalRewind);
                        self.pause();
                    }
                    else {
                        self.setState({played: self.state.played - 0.001});
                    }
                }, 300);
            }
            self.showUIForShortTime('x' + self.state.playbackRate)
        });

        db.get('volume', (err, volume) => {
            if (!err && volume)
                self.setVolume(null, parseFloat(volume))
        })
        setInterval(() => {
            self.setState({mouseMovedNotSince: self.state.mouseMovedNotSince + 500})


            if (this.state.mouseMovedNotSince < 0) {
                self.setState({
                    keyRecentlyPressed: false
                })
            }
        }, 500)
    }

    showUIForShortTime = (stringToShow) => {
        let self = this
        if (stringToShow)
            self.setState({
                pulseText: stringToShow,
                pulseAnimation: true
            })

        setTimeout(() => {
            self.setState({
                pulseAnimation: false
            })
        }, 500)
        // <i className="lard material-icons">assignment_turned_in</i>
        self.setState({
            keyRecentlyPressed: true,
            mouseMovedNotSince: 0
        })
    }

    load = (url, cb) => {
        this.setState({
            url,
            played: 0,
            playing: true,
            loaded: 0
        })
        this.showUIForShortTime()
        if (cb)
            cb()
    }

    getActiveEpisodeOfSeries = (series, cb) => {
        if (!series || !series.name)
            return

        let key = 'activeEpisode-' + series.name

        db.get(key, (err, activeEpisodeValue) => {

            if (err) {
                activeEpisodeValue = series.episodes[0].getValue()
                db.put(key, {
                    'activeEpisode': activeEpisodeValue
                })
            }

            let activeEpisode = series.episodes.find((episode) => {
                return episode.getValue() === activeEpisodeValue.activeEpisode
            })

            if (!activeEpisode)
                activeEpisode = series.episodes[0]

            cb(activeEpisode)
        })
    }

    getProgressOfEpisode = (series, episode) => {

    }

    resumeEpisode = (series, episode, playedTimeOverride, cb) => {
        let self = this
        let key = 'activeEpisodePlaytime-' + series.name + '-' + episode.getValue()
        let playedTime = 0

        let key2 = 'activeEpisode-' + series.name

        db.put(key2, {
            'activeEpisode': episode.getValue()
        })

        db.get(key, (err, progress) => {
            if (err) {
                db.put(key, {
                    'playedTime': 0
                })
            } else {
                playedTime = progress.playedTime
            }
            if (playedTimeOverride !== undefined)
                playedTime = playedTimeOverride

            this.setState({
                activeSeries: series,
                activeEpisode: episode,
                playedTime: playedTime
            })
            let p = `streamRequest?tvShow=` + episode.fullFilePath + '&seek=' + this.state.firstSlider
            self.load(p, cb)
        })
    }

    resumeSeries = (series, cb) => {
        let self = this
        this.getActiveEpisodeOfSeries(series, (activeEpisode) => {
            self.resumeEpisode(series, activeEpisode, undefined, cb)
        })
        self.showUIForShortTime()
    }

    resetPlayTime = () => {
        let key = 'activeEpisodePlaytime-' + this.state.activeSeries.name + '-' + this.state.activeEpisode.getValue()
        db.put(key, {
            'playedTime': 0
        })
    }

    getNextEpisode = (cb) => {
        let self = this
        self.resetPlayTime()
        let episodeList = this.state.activeSeries.episodes

        for (let i = 0; i < episodeList.length; i++) {
            if (episodeList[i].getValue() > this.state.activeEpisode.getValue()) {
                cb(episodeList[i])
                return
            }
        }
    }

    getPreviousEpisode = (cb) => {
        let self = this
        self.resetPlayTime()

        let episodeList = this.state.activeSeries.episodes

        for (let i = episodeList.length - 1; i >= 0; i--) {
            if (episodeList[i].getValue() < this.state.activeEpisode.getValue()) {
                cb(episodeList[i])
                return
            }
        }
    }

    onStart = () => {
        if (this.state.playedTime)
            this.player.seekTo(this.state.playedTime)
    }

    playNextEpisode = () => {
        let self = this
        self.getNextEpisode((episode) => {
            self.resumeEpisode(this.state.activeSeries, episode, 0)
        })
    }

    playPreviousEpisode = () => {
        let self = this
        self.getPreviousEpisode((episode) => {
            self.resumeEpisode(this.state.activeSeries, episode, 0)
        })
    }

    onProgress = state => {
        let self = this
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
            // if video was played 1 === 100%
            if (this.state.played === 1) {
                self.resetPlayTime()
                self.playNextEpisode()
            } else {
                // console.log(state, this.state.played)

                let key = 'activeEpisodePlaytime-' + this.state.activeSeries.name + '-' + this.state.activeEpisode.getValue()
                db.put(key, {
                    'playedTime': this.state.played
                })
                db.put('lastPlayed', {
                    'playedSeries': this.state.activeSeries,
                    'playedEpisode': this.state.activeEpisode
                })
            }
        }
    }
    playPause = () => {
        this.setState({playing: !this.state.playing})
    }
    pauseVideo = () => {
        this.setState({playing: false})
    }
    stop = () => {
        this.setState({url: null, playing: false})
    }
    setVolume = (e, v) => {
        this.setState({volume: parseFloat(v)})
        db.put('volume', parseFloat(v))
    }

    volumeUp = () => {
        if (this.state.volume + .05 <= 1) {
            this.setVolume(null, parseFloat(this.state.volume + .1))
        }
    }
    volumeDown = () => {
        if (this.state.volume - .05 >= 0)
            this.setVolume(null, parseFloat(this.state.volume - .1))

    }
    muteUnmutePlayer = e => {

        this.player.player.player.muted = !this.player.player.player.muted
        if (this.player.player.player.muted !== undefined)
            this.setState({muted: this.player.player.player.muted})
    }
    setPlaybackRate = e => {
        console.log(e)
        // console.log(parseFloat(e.target.value))
        this.setState({playbackRate: e})
    }
    getBeautifiedName = () => {
        if (this.state.activeEpisode)
            return this.state.activeSeries.name + ' ' + this.state.activeEpisode.getBeautifiedName()

        return "ready to play"
    }
    onSeekMouseDown = (e) => {
        this.setState({seeking: true})
    }
    onSeekChange = (e, v) => {
        this.setState({played: parseFloat(v)})
    }
    onSeekMouseUp = (e) => {
        this.setState({seeking: false})
        this.player.seekTo(this.state.played)
    }
    onClickFullscreen = () => {
        ScreenFull.toggle(findDOMNode(this.player))
    }
    onConfigSubmit = () => {
        let config
        try {
            config = JSON.parse(this.configInput.value)
        } catch (error) {
            config = {}
            console.error('Error setting config:', error)
        }
        this.setState(config)
    }
    renderLoadButton = (url, label) => {
        return (
            <button onClick={() => this.load(url)}>
                {label}
            </button>
        )
    }

    handleFirstSlider = (event, value) => {
        this.setState({firstSlider: value});
    }
    onClickOnSlider = (event, value) => {
        console.log("§ds", this.state.firstSlider)
        // this.playPause()
        // this.playPause()
    }

    render() {
        const {
            url, playing, volume,
            played, duration,
            playbackRate,
            soundcloudConfig,
            vimeoConfig,
            youtubeConfig,
            fileConfig
        } = this.state

        return (
            <div className={'player ' + (url ? 'show' : 'hide')}>
                <div
                    className={'player-wrapper ' + (this.state.mouseMovedNotSince < 4000 ? 'show-cursor' : 'hide-cursor')}
                    onMouseMove={() => this.onMouseMove()}
                    onDoubleClick={this.onClickFullscreen}
                    onTouchEnd={() => {
                        if (!ScreenFull.isFullscreen)
                            this.onClickFullscreen()
                    }}>
                    <ReactPlayer
                        className={'react-player '}

                        ref={player => {
                            this.player = player
                        }}
                        // controls
                        crossorigin="anonymous"
                        width='100%'
                        height='100%'
                        url={url}
                        playing={playing}
                        playbackRate={playbackRate}
                        volume={volume}
                        soundcloudConfig={soundcloudConfig}
                        vimeoConfig={vimeoConfig}
                        youtubeConfig={youtubeConfig}
                        fileConfig={fileConfig}
                        onReady={() => {
                            // console.log(this.player.player)
                            // console.log(this.player.player.player)
                            // let trackNode = document.createElement("track");
                            // trackNode.setAttribute('label', 'englisch')
                            // trackNode.setAttribute('kind', 'subtitles')
                            // trackNode.setAttribute('srclang', 'en')
                            // trackNode.setAttribute('src', 'http://localhost:3001/subtitles.vtt')
                            // this.player.player.player.appendChild(trackNode);
                        }}
                        onStart={() => this.onStart()}
                        onPlay={() => this.setState({playing: true})}
                        onPause={() => this.setState({playing: false})}
                        onBuffer={() => console.log('onBuffer')}
                        onEnded={() => this.setState({playing: false})}
                        onError={e => console.log('onError', e)}
                        onProgress={this.onProgress}
                        onDuration={duration => this.setState({duration})}
                    />
                </div>
                <div className={'pulse ' + (this.state.pulseAnimation ? 'bigger' : '')}> {this.state.pulseText} </div>
                <div
                    onMouseMove={() => this.onMouseMove()}
                    className={'overlay top-tool-bar ' + ((this.state.keyRecentlyPressed || ScreenFull.isFullscreen) && this.state.mouseMovedNotSince < 4000 ? 'show' : 'hide')}>
                    <h1>{this.getBeautifiedName()}</h1>
                </div>
                <div
                    onMouseMove={() => this.onMouseMove()}
                    className={'overlay bottom-tool-bar ' + ((this.state.keyRecentlyPressed || ScreenFull.isFullscreen) && this.state.mouseMovedNotSince < 4000 ? 'show' : 'hide')}>

                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} className="progress-slider-container">
                                <Duration className="played-time" seconds={duration * played}/>
                                <Slider className="progress-slider"
                                        style={{width: '100%'}}
                                        min={0} max={1}
                                        value={played}
                                        onMouseDown={this.onSeekMouseDown}
                                        onChange={this.onSeekChange}
                                        onMouseUp={this.onSeekMouseUp}
                                        tabIndex={-1}
                                /><Duration className="played-time" seconds={duration}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>

                                <IconButton tabIndex={-1} className="left" onClick={this.playPause} tooltip="play/pause"
                                            touch={false}
                                            tooltipPosition="bottom-right">
                                    {playing ? <AVPause/> : <AVPlayArrow/>}
                                </IconButton>
                                <IconButton tabIndex={-1} className="left" onClick={this.playPreviousEpisode}
                                            tooltip="previous"
                                            touch={true}
                                            tooltipPosition="bottom-right">
                                    <AVSkipPrevious/>
                                </IconButton>
                                <IconButton tabIndex={-1} className="left" onClick={this.playNextEpisode}
                                            tooltip="previous"
                                            touch={true}
                                            tooltipPosition="bottom-right">
                                    <AVSkipNext/>
                                </IconButton>
                                {/*</Col>*/}
                                {/*<Col xs={6} sm={6} className="right-player-buttons">*/}
                                <Slider tabIndex={-1} className="volume-slider right"
                                        min={0} max={1}
                                        value={volume}
                                        onChange={this.setVolume}
                                />


                                <IconButton tabIndex={-1} className="right" onClick={this.muteUnmutePlayer}
                                            tooltip="mute/unmute"
                                            touch={true}
                                            tooltipPosition="bottom-right">
                                    {this.state.muted ? <AVVolumeOff/> : <AVVolumeUp/>}
                                </IconButton>
                                <IconButton tabIndex={-1} className="right" onClick={this.onClickFullscreen}
                                            tooltip="toggle fullscreen"
                                            touch={true}
                                            tooltipPosition="bottom-right">
                                    {ScreenFull.isFullscreen ? <NavigationFullscreenExit/> :
                                        <NavigationFullscreen/>}
                                </IconButton>
                            </Col>
                        </Row>
                    </Grid>
                    <div className="player-buttons">

                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(.5)*/}
                        {/*}}>.5x</FlatButton>*/}
                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(1)*/}
                        {/*}}>1x</FlatButton>*/}
                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(1.5)*/}
                        {/*}}>1.5x</FlatButton>*/}
                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(2)*/}
                        {/*}}>2x</FlatButton>*/}
                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(4)*/}
                        {/*}}>4x</FlatButton>*/}
                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(8)*/}
                        {/*}}>8x</FlatButton>*/}
                        {/*<FlatButton onClick={() => {*/}
                        {/*this.setPlaybackRate(16)*/}
                        {/*}}>16x</FlatButton>*/}


                    </div>
                </div>
            </div>
        )
    }
}
