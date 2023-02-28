const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const filepath = (id) => (path.join(exports.dataDir, `${id}.txt`));

// Public API - Fix these CRUD functions ////////////////////////////////////////

exports.create = (text, callback) => {
  var updateItems = (err, id) => {
    fs.writeFile( filepath(id), text, (err) => {
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
    callback(null, data);
  };
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading directory in index.js readAll');
    } else {
      formatFileData(null, files);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(filepath(id), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(filepath(id), (err) => {
    if (err) {
      callback(new Error('Todo file does not exist'));
    } else {
      fs.writeFile( filepath(id), text, (err) => {
        if (err) {
          callback(new Error('error updating todo file'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(filepath(id), (err) => {
    if (err) {
      callback(new Error('No file to delete'));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
