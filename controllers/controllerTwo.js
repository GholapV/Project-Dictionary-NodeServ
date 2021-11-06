const Model = require('../modal-schema')

async function Wordlist(req, res) {
    const favorites = await Model.find({})
    res.status(200).json(favorites)
}

async function DeleteWord(req, res) {
    const { id } = req.params
    await Model.deleteOne({ _id: id })
    res.status(200).send('deleted')
}

module.exports = { Wordlist, DeleteWord }