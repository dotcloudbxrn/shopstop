const fs = require('fs');
const path = require('path');

const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports.addGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('product/add', {categories: categories})
  })
}

module.exports.addPost = (req, res) => {
  let productObj = req.body

  if (!productObj.image) {
    productObj.image = "https://www.2checkout.com/upload/images/graphic_product_tangible.png"
  } else {
    // Don't understand why but following the tutorial on this one, since I couldn't figure it out on my own
    productObj.image = '\\' + req.file.path
  }

  Product.create(productObj).then((product) => {
    Category.findById(product.category).then((category) => {
      category.products.push(product._id)
      category.save()
    })
    res.redirect('/')
  })
}

module.exports.editGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then((product) => {
    if (!product) {
      res.sendStatus(404)
      res.end()
      return
    }

    Category.find().then((categories) => {
      res.render('product/edit', {
        product,
        categories
      })
    })
  })
}

module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedProduct = req.body

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(
        `/?error=${encodeURIComponent('error=Product was not found!')}`
      )
      return
    }

    product.name = editedProduct.name
    product.description = editedProduct.description
    product.price = editedProduct.price
    if (req.file) {
      product.image = '\\' + req.file.path
    }

    if (product.category.toString() !== editedProduct.category) {
      Category.findById(product.category).then((currentCategory) => {
        Category.findById(editedProduct.category).then((nextCategory) => {
          let index = currentCategory.products.indexOf(product._id)
          if (index >= 0) {
            currentCategory.products.splice(index, 1)
          }
          currentCategory.save()
          nextCategory.products.push(product._id)
          nextCategory.save()

          product.category = editedProduct.category
          product.save().then(() => {
            res.redirect(
              `/?success=${encodeURIComponent('Product was editted successfully')}`
            )
          })
        })
      })
    } else {
      product.save().then(() => {
        res.redirect(
          `/?success=${encodeURIComponent('Product was editted successfully')}`
        )
      })
    }
  })
}

module.exports.deleteGet = (req, res) => {
  let id = req.params.id

  Product.findById(id).then((product) => {
    if (!product) {
      res.sendStatus(404)
      res.end()
      return
    }

    res.render('product/delete', {product: product})
  })
}

module.exports.deletePost = (req, res) => {
  let id = req.params.id
  let deletedProduct = req.body

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(
        `/?error=${encodeURIComponent('Error: Product not found!')}`
      )
      return
    }

    Category.findById(product.category).then((productCategory) => {
      let index = productCategory.products.indexOf(product._id)
      if (index >= 0) {
        productCategory.products.splice(index, 1)
      }
      productCategory.save()
    })

    // remove image
    let weirdHack = product.image.substr(1)
    let imagePath = path.normalize(path.join(__dirname, '..', weirdHack))
    console.log(imagePath)

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log('I could not delete image')
        console.log(err)
        return
      }
    })
  })

  Product.findByIdAndRemove(id).then((product) => {
    if (!product) {
      console.log('I could not find product by ID so I can remove it')
      res.sendStatus(404)
      res.end()
    }
    res.redirect(
      `/?success=${encodeURIComponent('Successfully removed product!')}`
    )
  })
}

module.exports.buyGet = (req, res) => {
  let id = req.params.id

  Product.findById(id).then((product) => {
    if (!product) {
      res.redirect(
        `/?error=${encodeURIComponent('error=Product was not found!')}`
      )
      return
    }
    res.render('product/buy', {
      product
    })
    res.end()
  })
}

module.exports.buyPost = (req, res) => {
  let id = req.params.id

  Product.findByIdAndRemove(id).then((product) => {
    if (!product) {
      res.redirect(
        `/?error=${encodeURIComponent('error=Product was not found!')}`
      )
      return
    }
    res.redirect(
      `/?success=${encodeURIComponent('Transaction complete - thank you for shopping!')}`
    )
    res.end()
  })
}