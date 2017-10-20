/**
 * Created by GDur on 14.04.2017.
 */


export default class {

    constructor(dbName) {
        this.db = {}
        this.dbName = dbName
        // /leveldb
        this.basePath = `leveldb`
    }

    put(key, value, cb) {
        let path = this.basePath + `/put?key=` + key + '&value=' + JSON.stringify(value)
        //console.log(path)
        return fetch(path, {
            accept: 'application/   json',
            method: "POST"
        }).then(checkStatus).then(parseJSON).then((data) => {
            if (cb)
                cb(data.err)
        });
    }

    get(key, cb) {
        let path = this.basePath + `/get?key=` + key
        //console.log(path)
        return fetch(path, {
            accept: 'application/json',
            method: "POST"
        }).then(checkStatus).then(parseJSON).then((data) => {
            if (data.value)
                data.value = JSON.parse(data.value)
            if (cb)
                cb(data.err, data.value)
        });
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