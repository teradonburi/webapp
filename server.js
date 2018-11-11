const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))

app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/api/user', upload.single('image'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.json({image: req.file, ...req.body, members: JSON.parse(req.body.members)})
})

app.listen(9090, () => {
  console.log('Access to http://localhost:9090')
})