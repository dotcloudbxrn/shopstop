const mongoose = require('mongoose')
mongoose.PromiseProvider = global.Promise

module.exports = (config) => {
  mongoose.connect(config.connectionString,{
    useMongoClient: true
  })

  let database = mongoose.connection

  database.once('open', (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('db connected!')
  })

  require('../models/Product')
  require('../models/Category')
}