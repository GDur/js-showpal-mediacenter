import React, {Component} from 'react';
import './App.css';
import './App.css'
import config from './config.json'
import ShowOverviewView from './Views/ShowOverviewView.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Scrollbars} from 'react-custom-scrollbars';

let log = console.log.bind(console)
log('started')

/**
 * TODO:
 * - Hotkeys for everything, but mostly the player
 * - switch automatically to next episode on end (or hotkey) (press right: asking: really next episode? Escape=no, Right=yes)
 * - show all episodes if need be (and play specific one)
 * -
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            tvShows: [],
            path: config.tvShowPath
        }
    }

    handleToggle = () => this.setState({
        open: !this.state.open
    });

    componentDidMount() {
        // this.fetchTVShows()
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <Scrollbars
                    style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0}}
                    renderThumbVertical={ props => <div {...props} className="thumb-vertical"/>}
                    autoHide
                    >
                    <ShowOverviewView/>
                </Scrollbars>
            </MuiThemeProvider>
        );
    }
}

export default App;
