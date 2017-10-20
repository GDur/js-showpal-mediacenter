/**
 * Created by GDur on 15.07.2017.
 */
const level = require('level')


module.exports = function (app) {
    const self = this

    //1) Create our database, supply location and options.
    //   This will create or open the underlying LevelDB store.
    let db = new level('./showpal-db')

    self.put = (cb)=> {
        app.post('/leveldb/put', function (req, res) {
            db.put(req.query.key, req.query.value, function (err) {
                if (err)
                    res.json({err: err.message})
                else
                    res.json({err: null})

                cb()
            })
        })
    }
    self.get = (cb)=> {
        app.post('/leveldb/get', function (req, res) {
            db.get(req.query.key, function (err, value) {
                if (err)
                    res.json({err: err.message})
                else
                    res.json({err: null, value: value})


                cb()
            })
        })
    }

}