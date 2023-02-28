const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ////////////////////////////////////////

exports.create = (text, callback) => {
  var updateItems = (err, id) => {
    items[id] = text;
    let pathname = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile( pathname, text, (err) => {
      if (err) {
        throw ('error writing todo file');
      } else {
        callback(null, { id, text });
      }
    });
  };

  counter.getNextUniqueId(updateItems);

};

exports.readAll = (callback) => {
  var formatFileData = (err, files) => {
    var data = files.map(id => {
      id = id.slice(0, -4);
      return {id: id, text: id};
    });
    // console.log('formatted file data object: ', data);
    callback(null, data);
    // that look like this: { id, id }
    // at the end, call callback(err, files);
  };
  // use readdir with pathname and formatFileData(err, files)
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading directory in index.js readAll');
    } else {
      formatFileData(null, files);
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  let pathname = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathname, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
