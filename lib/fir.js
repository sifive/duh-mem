'use strict';

const duhVerilog = require('duh-verilog');
const getDuh = require('./fir-get-duh.js');
const getBody = require('./fir-get-body.js');

const fir = opt => {
  // console.log(opt);
  const duh = getDuh(opt);
  const body = getBody(opt);
  const res = duhVerilog.generate(duh, body.join('\n'));
  return res;
};

module.exports = fir;
