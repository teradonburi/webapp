const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: String,
  token: String,
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, m) => {
      delete m.__v
      delete m._id
      return m
    },
  },
})


const crypto = require('crypto')
schema.static('generateToken', function() {
  const length = 32
  const chars = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789_-'
  const rnd = crypto.randomBytes(length)
  const ret = []
  for (let i = 0; i < length; i++) {
    ret.push(chars[rnd[i] % chars.length])
  }
  return ret.join('')
})


module.exports = mongoose.model('User', schema)