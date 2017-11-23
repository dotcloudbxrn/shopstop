const fs = require('fs');

var database = {

};

function put (key, value) {  
  if(database.hasOwnProperty(key) || typeof(key) !== 'string') {
    throw new Error('Use unique names for the key');
  }
  database[key] = value;
}

function get (key) {
  if(!database.hasOwnProperty(key)) {
    throw new Error('Key not found');
  }
  if(typeof(key) !== 'string') {
    throw new Error('Type of value is not string');
  }
  return database[key];
}

function update (key, value) {
  if(!database.hasOwnProperty(key) || typeof(key) !== 'string') {
    throw new Error('Please provide valid key');
  }
  database[key] = value;
}

function deleteItem (key) {
  if(!database.hasOwnProperty(key) || typeof(key) !== 'string') {
    throw new Error('Please provide valid key');
  }
  delete database[key];
}

function clear () {
  for(prop in database) {
    delete database[prop]
  }
}

function save (callback) {
  fs.writeFile('somefile.txt', JSON.stringify(database), (err) => {
    if (err) {
      console.log(err);
      return;
    }
    callback();
  });
}

function load (callback) {
  fs.readFile('somefile.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    var database = JSON.parse(data);
    callback();
  });
}

module.exports = {put, get, update, delete : deleteItem, clear, save, load};