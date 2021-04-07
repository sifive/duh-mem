'use strict';

const duhVerilog = require('duh-verilog');

const fix = (obj, pre, post) =>
  Object.keys(obj).reduce((res, key) => {
    res[pre + '_' + key + '_' + post] = obj[key];
    return res;
  }, {});

const getDuh = p => {
  const ports = {};
  const addWidth = Math.ceil(Math.log2(p.depth));
  const parameters = [
    {name: 'DW', value: p.width },
    {name: 'AW', value: addWidth },
    {name: 'DEPTH', value: p.depth}
  ];
  for (let i = 0; i < p.numReadPorts; i++) {
    Object.assign(ports, fix({clock: 1, en: 1, addr: 'AW', data: '-DW'}, 'ro', i));
  }
  for (let i = 0; i < p.numWritePorts; i++) {
    Object.assign(ports, fix({clock: 1, en: 1, addr: 'AW', data: 'DW'}, 'wo', i));
  }
  for (let i = 0; i < p.numReadWritePorts; i++) {
    Object.assign(ports, fix({clock: 1, en: 1, addr: 'AW', wmask: 1, wdata: 'DW', rdata: '-DW'}, 'rw', i));
  }
  return {
    component: {
      name: p.moduleName,
      model: {ports},
      parameters
    }
  };
};

const getBody = p => {
  let res = [];

  if (p.numReadPorts === 0 && p.numWritePorts === 0 && p.numReadWritePorts === 1) {
    res = res.concat([
      'reg [DW-1:0] rw_rdata_0;',
      'reg [DW-1:0] mem [DEPTH-1:0] /* synthesis syn_ramstyle="no_rw_check" */;',
      'always @(posedge rw_clock_0) if(rw_en_0) mem[rw_addr_0] <= rw_wdata_0;',
      'always @(posedge rw_clock_0) if(rw_en_0) rw_rdata_0 <= mem[rw_addr_0];'
    ]);
    return res;
  }

  return res;
};

const fir = opt => {
  // console.log(opt);
  const duh = getDuh(opt);
  const body = getBody(opt);
  const res = duhVerilog.generate(duh, body.join('\n'));
  return res;
};

module.exports = fir;
