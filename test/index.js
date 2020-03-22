import "core-js/stable";
import "regenerator-runtime/runtime";

import './Decorator';
import './DutyChains';
import './FlyWeight';
import './Mediator';
import './PublishSubscribe';
import './Single';
import './State';

// import Mocha from 'mocha';
// import fs from 'fs';
// import path from 'path';
// const Mocha = require('mocha');
// const fs = require('fs');
// const path = require('path');

// let mocha = new Mocha();

// fs.readdirSync(__dirname)
//   .filter(function(file) {
//     return fs.statSync(path.join(__dirname, file)).isDirectory()
//     // return path.extname(file) === '.js';
//   })
//   .forEach(function(file) {
//     mocha.addFile(path.join(__dirname, file, 'index.js'));
//   });

//   mocha.run(function(failures) {
//     process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
//   });