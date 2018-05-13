const { User } = require('../models')

module.exports = {
  index,
  create,
  show,
  update,
  remove,
}

async function index(req, res) {
  const users = await User.find()
  res.json(users)
}

async function create(req, res) {
  req.body.token = User.generateToken()
  const user = await User.create(req.body)
  res.json(user)
}

async function show(req, res) {
  const user = await User.findOne({_id: req.params.id})
  if (user === null) return res.status(404).json({message: 'not found'})
  res.json(user)
}

async function update(req, res) {
  const user = await User.findOne({_id: req.params.id})
  if (user === null) return res.status(404).json({message: 'not found'})
  Object.keys(req.body).forEach(prop => (user[prop] = req.body[prop]))
  await user.save()
  res.json(user)
}

async function remove(req, res) {
  const user = await user.findOne({_id: req.params.id})
  if (user === null) return res.status(404).json({message: 'not found'})
  await user.remove()
  res.json()
}
