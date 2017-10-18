import React from 'react';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import AVPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import IconButton from 'material-ui/IconButton';
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

        let episode = series.episodes.map((episode) => {
            return (<div key={episode.fullFilePath}>
                <FlatButton tabIndex={(this.state.showDetails ? 1 : -1)} onClick={() => {
                    self.state.player.resumeEpisode(series, episode)
                }}
                            icon={<AVPlayArrow/>}
                            style={style}
                            label={episode.getBeautifiedName()}
                />
            </div>)
        })

        return (
            <Paper className="series-container" zDepth={2}>
                <IconButton tabIndex={1} className="expand-button"
                            onClick={this.onExpandChange} tooltip="show episodes" touch={true}
                            tooltipPosition="top-right">
                    {this.state.showDetails ? <NavigationExpandLess/> : <NavigationExpandMore/>}
                </IconButton>
                <FlatButton  tabIndex={1} className="play-series-button" onClick={() => {
                    self.state.player.resumeSeries(series)
                }}
                            icon={<AVPlayArrow/>}
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
