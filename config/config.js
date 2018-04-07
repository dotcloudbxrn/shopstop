const path = require('path')

module.exports = {
  development: {
    connectionString: 'mongodb://localhost:27017/ShopStopDatabase',
    rootPath: path.normalize(path.join(__dirname, '../'))
  },
  production: {
    connectionString: process.env.MONGODB_URI,
    rootPath: path.normalize(path.join(__dirname, '../'))
  }
}