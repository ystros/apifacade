'use strict';

var path = require('path');
var fs = require('fs');
var config = require('../../config');
var chai = require('chai');
var like = require('chai-like');
var when = require('when');
var nodefn = require('when/node');
var logger = require('winston');
var filesPath = __dirname;
mongoose.Promise = when;

chai.use(like);
chai.should();

logger.level = 'error';

function load(root, test) {
  test = test || (f => true);
  fs.readdirSync(root).forEach(f => {
    var p = path.join(root, f),
        stat = fs.statSync(p);
    if(stat.isDirectory())
      load(p, test);
    else if(stat.isFile() &&
            test(p) &&
            /(.*)\.(js$|coffee$)/.test(f) &&
            p !== __filename)
      require(p);
  });
}

load(filesPath, f => !/fixtures/.test(f));
