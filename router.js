const express = require('express')
const router = express.Router()
const ControllerOne = require('./controllers/controllerOne')
const { Wordlist, DeleteWord } = require('./controllers/controllerTwo')

router.route('/dictionary/:wordId').get(ControllerOne)
router.route('/favorites/:id').delete(DeleteWord)
router.route('/favorites').get(Wordlist)

module.exports = router;