const homeHandler = require('./home');
const filesHandler = require('./static-files');
const productsHandler = require('./product');
const category = require('./category')

module.exports = [ homeHandler, category, filesHandler, productsHandler]
