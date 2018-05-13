'use strict'

require('fs').readdirSync(__dirname).forEach(e => {
  const name = /^([a-z]+)\.js$/i.test(e) && RegExp.$1
  if (name && name !== 'index') {
    const model = require('./' + name)
    module.exports[model.modelName] = model
  }
})