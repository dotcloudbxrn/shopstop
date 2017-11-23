const fs = require('fs');
const path = require('path');
const url = require('url');

function getContentType (url) {
  let extension = url.substr(url.length - 3);
  if (extension === 'css') {
    return 'text/css'
  } else if (extension === 'ico') {
    return 'image/x-icon'
  } else if (extension === 'jpg' || extension === 'png' || extension === 'gif') {
    return `image/${extension}`
  }
}

// you EXPORT the actual function that way,
// it's a shorthand notation, syntactic sugar 
// this fag uses.
module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname 
  if (req.pathname.startsWith('/content/') && req.method === 'GET')  {
    let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/plain'
        });

        res.write('Your DAMN resource was not found!')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': getContentType(req.pathname)
      })
      res.write(data);
      res.end();
      
    })
  } else if (req.pathname.endsWith('jpg') && req.method === 'GET') {
    let filePath 
  }else {
    return true
  }
}