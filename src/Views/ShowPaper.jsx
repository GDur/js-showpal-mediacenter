import React from 'react';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AVPlayArrowIcon from 'material-ui/svg-icons/av/play-arrow';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';

import MovieFilterIcon from 'material-ui/svg-icons/image/movie-filter';

// import ActionGrade from 'material-ui/svg-icons/action/grade';

const style = {
    margin: 12,
};

export default class ShowPaper extends React.Component {
    constructor(props) {
        super(props)
        // console.log("gfh", props)
        this.state = {
            showDetails: false,
            player: props.player,
        }
    }

    onExpandChange = () => {
        this.setState({showDetails: !this.state.showDetails})
    }

    render() {
        const self = this
        let series = this.props.series

        function checkStatus(response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            const error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            console.log(error); // eslint-disable-line no-console
            throw error;
        }

        function parseJSON(response) {
            return response.json();
        }

        let episode = series.episodes.map((episode) => {
            return (<div key={episode.fullFilePath}>
                <FlatButton tabIndex={(this.state.showDetails ? 1 : -1)} onClick={() => {
                    self.state.player.resumeEpisode(series, episode)
                }}
                            icon={<AVPlayArrowIcon/>}
                            style={style}
                            label={episode.getBeautifiedName()}
                />
                <IconButton tabIndex={1}
                            className="expand-button"
                            onClick={() => {
                                let path = '/conversionRequest?videoPath=' + episode.fullFilePath

                                return fetch(path, {
                                    accept: 'application/json'
                                }).then(checkStatus)
                                    .then(parseJSON)
                                    .then((data) => {
                                        console.log(data)
                                    });
                            }}
                            tooltip="convert episode"
                            touch={true}
                            tooltipPosition="bottom-right">
                    <MovieFilterIcon/>
                </IconButton>
            </div>)
        })

        return (
            <Paper className="series-container" zDepth={2}>
                <IconButton tabIndex={1} className="expand-button"
                            onClick={this.onExpandChange} tooltip="show episodes" touch={true}
                            tooltipPosition="top-right">
                    {this.state.showDetails ? <NavigationExpandLessIcon/> : <NavigationExpandMoreIcon/>}
                </IconButton>
                <FlatButton tabIndex={1} className="play-series-button" onClick={() => {
                    self.state.player.resumeSeries(series)
                }}
                            icon={<AVPlayArrowIcon/>}
                            style={style}
                            label={series.name}
                />

                <div className={'details ' + (this.state.showDetails ? 'show-details' : 'hide-details')}
                    // style={this.state.showDetails ? on_show_styles : on_hide_styles}
                >{episode}</div>
            </Paper>
        )
    }
}
