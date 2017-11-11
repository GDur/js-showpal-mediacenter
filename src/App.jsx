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

        // function checkStatus(response) {
        //     if (response.status >= 200 && response.status < 300) {
        //         console.log(response)
        //         return response;
        //     }
        //     let error = new Error(`HTTP Error ${response.statusText}`);
        //     error.status = response.statusText;
        //     error.response = response;
        //     // console.log(error); // eslint-disable-line no-console
        //     throw error;
        // }
        //
        //
        // function parseJSON(response) {
        //     return response.json();
        // }
        // //
        // fetch('http://api.tvmaze.com/singlesearch/shows?q=rick%20and%20morty&embed=episodes', {
        //     accept: 'application/json'
        // }).then(checkStatus).then(parseJSON).then(function(data){
        //     console.log('wad', JSON.stringify(data))
        // });
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
