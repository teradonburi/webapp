const express = require('express')
const bodyParser = require('body-parser')
const app = express()

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/api', (req, res) => {
  res.json(req.body.data)
})

app.listen(5000, () => {
  console.log('Access to http://localhost:5000')
})

