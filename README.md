# js-showpal-mediacenter

## description
This is a minimalistic mediacenter build with ReactJS.

## Requirements
- NodeJS
- Git

## Setup
- download and install dependencies
```cmd
git clone git@github.com:GDur/js-showpal-mediacenter.git
cd js-showpal-mediacenter
npm install
```
- rename *./src/config.json.dist* to *./src/config.json*
- open *./src/config.json* with a text editor and adjust the *tvShowPath* variable
- start server: *start-server.bat*
- start mediacenter *start.bat*
- load url *localhost:3000*


## todo
- a click on the snackbar change hint should show the changed files
- mark active episode in serieslist or/and show last episode index next to resume series button
- allow conversion of files in case they are not playable by the html5 player
