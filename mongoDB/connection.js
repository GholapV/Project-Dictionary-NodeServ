const mongoose = require('mongoose')

function Connection(uri) {
    return mongoose.connect(uri).then(() => console.log('connected to mongoDB...'))
}

module.exports = Connection