const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MeaningSchema = new Schema({
    wordId: {
        type: String,
        unique: true
    },
    extracted: {
        type: Array
    }
})

module.exports = mongoose.model('meaning', MeaningSchema)