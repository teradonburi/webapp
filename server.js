const express = require('express')
const bodyParser = require('body-parser')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express()

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(err => {
  console.error(err)
  if (!res.headersSent) {
    res.status(500).json({message: 'Internal Server Error'})
  }
})
process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
process.on('SIGINT', () => process.exit(1))

app.use(express.static('dist'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/api', (req, res) => {
  res.json(req.body.data)
})

app.post('/upload', upload.single('image'), wrap(async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.json({image: req.file, ...req.body})
}))

app.listen(5000, () => {
  console.log('Access to http://localhost:5000')
})

