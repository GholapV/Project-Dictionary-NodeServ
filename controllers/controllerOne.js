const https = require("https");
const Model = require('../modal-schema')

async function Controller(req, res) {
    const wordId = req.params['wordId']

    const options = {
        host: 'od-api.oxforddictionaries.com',
        port: '443',
        path: `/api/v2/entries/en-gb/${wordId}?fields=definitions%2Cexamples%2Cetymologies&strictMatch=false`,
        method: "GET",
        headers: {
            'app_id': "2b6fef90",
            'app_key': "80a549758ebb93623c22274df21bac72"
        }
    };
    await https.get(options, async (resp) => {
        let body = '';
        resp.on('data', (chunk) => {
            body += chunk;
        });
        resp.on('end', async () => {
            let parsed = JSON.parse(body);

            if (parsed.error === undefined) {

                let [results] = parsed.results

                let extracted = results.lexicalEntries.map((item, iteration) => {
                    let { entries, lexicalCategory } = item
                    let { etymologies = [''], senses } = entries[0]
                    let { definitions, examples } = senses[0]
                    examples = examples.map(item => item.text)

                    return {
                        _id: iteration,
                        type: lexicalCategory.text,
                        etymologies: etymologies[0],
                        definitions: definitions[0],
                        examples
                    }
                })

                try {
                    const inserted = await Model.create({
                        wordId,
                        extracted
                    })
                    res.status(200).json(inserted)
                } catch (err) {
                    if (err.code === 11000) res.json({ msg: 'Word already exists on list' })
                    else res.json({ msg: 'Something went wrong' })
                }

            }
            else res.json({ msg: 'Not found' })
        })
    })
}

module.exports = Controller