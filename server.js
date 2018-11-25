const express = require('express')
const ah = require('async_hooks')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// 非同期I/O, タイマー, Promiseなどのトレース
Error.stackTraceLimit = 20 // スタックトレース行を増やす
const w = v => fs.writeSync(process.stdout.fd, v)
ah.createHook({
  init(id, type, triggerId) {
    const e = {}
    Error.captureStackTrace(e) // -> 'at AsyncHook init'
    e.stack.split(require('os').EOL).filter(v => // ユーザーランドのスタックトレースのみに
      v.includes(' (/') && !v.includes('at AsyncHook.init'))
    w(`${type} ${id} created in ${triggerId}\n`)
  },
  before(id) {
    w(`before ${id} callback in ${ah.executionAsyncId()}\n`)
  },
  after(id) {
    w(`after ${id} callback in ${ah.executionAsyncId()}\n`)
  },
  destroy(id) {
    w(`${id} destroy in ${ah.executionAsyncId()}\n`)
  },
  promiseResolve(id) {
    w(`PROMISE ${id} resolved\n`)
  },
}).enable()

// 各エンドポイントのハンドラ関数(Promiseで返る前提)にcatchを足す
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(err => {
  console.error(err)
  if (!res.headersSent) {
    res.status(500).json({message: 'Internal Server Error'})
  }
})
process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))

app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.post('/api/user', upload.single('image'), wrap(async (req, res) => {
  console.log(req.body)
  console.log(req.file)
  res.json({image: req.file, ...req.body, members: JSON.parse(req.body.members)})
}))

app.listen(9090, () => {
  console.log('Access to http://localhost:9090')
})