const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

module.exports = (app, config) => {
  app.set('view engine', 'pug')
  app.set('views', path.join(config.rootPath,'views'))
  // configure middleware for parsing form data
  app.use(bodyParser.urlencoded({extended: true}))
  // configure public folder
  app.use((req, res, next) => {
    if (req.url.startsWith('/content')) {
      req.url = req.url.replace('/content', '')
    }
    next()
  }, express.static(
    path.normalize(
      path.join(config.rootPath, 'content')
    )
  )
)}