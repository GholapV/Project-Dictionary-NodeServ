const express = require('express')
const app = express()

require('express-async-errors')
require('dotenv').config()

const Router = require('./router')

const ConnectionDB = require('./mongoDB/connection')

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10000, // limit each IP to 100 requests per windowMs
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
    res.send('HOME PAGE')
})
app.use('/api/v1', Router)

const port = process.env.PORT || 5000

async function Start() {
    try {
        await ConnectionDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`listening to the port on ${port}`))
    } catch (err) {
        console.log({ ConnectionERR: err.message })
    }
}

Start()