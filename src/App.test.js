import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});


// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = new Level('./mydb')

// 2) put a key & value
//db.put('name', {onClickOnSlider: 4564, arr: [234, 234, 234]}, function (err) {
db.put('name', 'gzuigzu', function (err) {
    if (err)
        return console.log('Ooops!', err) // some kind of I/O error

    //// 3) fetch by key
    db.get('namee', function (err, value) {
        if (err)
            return console.log('Ooops!', err) // likely the key was not found

        // ta da!
        console.log('name=', value)
    })
    db.get('name', function (err, value) {
        if (err)
            return console.log('Ooops!', err) // likely the key was not found

        // ta da!
        console.log('name=', value)
    })
})