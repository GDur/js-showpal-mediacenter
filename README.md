# js-showpal-mediacenter

## Requirements
- Node.js [https://nodejs.org/]
- Optional (enables video converter): FFmpeg [https://www.ffmpeg.org/]

## Setup
- download and install dependencies:
```bash
git clone git@github.com:GDur/js-showpal-mediacenter.git
cd js-showpal-mediacenter
npm install
```
- rename **./src/config.json.dist** to **./src/config.json**
- open **./src/config.json** with a text editor and adjust the **tvShowPath** variable
- start server: **start-server.bat**
- start mediacenter **start.bat**
- load url **localhost:3000**
- Optional: download the **ffmpeg.exe** and move it to **./server/**

## todo
- prioritize converted videos over unconverted
- suggest conversion only for videos with wrong format
- indicate last/first video playing (disable skip to next/previous video button)
- indicate end of series reached
- indicate active video
- in list: indicate progress in watched videos
- a click on the snackbar change hint should show the changed files
- add button which opens the folder containing the media file

## done
- allow conversion of files in case they are not playable by the html5 player
- show specific visual clue when hotkey was pressed
- scrollbar should not skew layout
