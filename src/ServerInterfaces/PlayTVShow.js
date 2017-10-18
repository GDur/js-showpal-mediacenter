/**
 * Created by GDur on 05-Apr-17.
 */

export default function (query, cb) {
    let p = `streamRequest`
    if (query.tvShow) {
        p += `&tvShow=` + query.tvShow
    }
    console.log(p, query);
    return fetch(p, {accept: 'application/json'}).then(checkStatus).then(parseJSON).then(cb);
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
