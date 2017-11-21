/**
 * Created by GDur on 05-Apr-17.
 */

export default function (query, cb) {
    if (query.tvShow) {
        let url = `streamRequest&tvShow=` + query.tvShow
        console.log(url, query);
        if (cb)
            return fetch(url, {accept: 'application/json'})
                .then(checkStatus)
                .then(parseJSON)
                .then(cb);
        else {
            console.info('Please specify the callback-function')
        }
    } else {
        console.info('Please specify the "?tvShow" parameter')
    }
}

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
