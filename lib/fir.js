'use strict';

const duhVerilog = require('duh-verilog');

const fix = (obj, pre, post) =>
  Object.keys(obj).reduce((res, key) => {
    res[pre + '_' + key + '_' + post] = obj[key];
    return res;
  }, {});

const getDuh = p => {
  const ports = {};
  const busInterfaces = [];
  const addWidth = Math.ceil(Math.log2(p.depth));
  const parameters = [
    {name: 'DW', value: p.width },
    {name: 'AW', value: addWidth },
    {name: 'DEPTH', value: p.depth}
  ];
  for (let i = 0; i < p.numReadPorts; i++) {
    Object.assign(ports, fix({clock: 1, en: 1, addr: 'AW', data: '-DW'}, 'ro', i));
    busInterfaces.push({
      name: 'ro' + i,
      interfaceMode: 'target',
      busType: {vendor: 'sifive.com', library: 'MEM', name: 'RO', version: '0.1.0'},
      abstractionTypes: [{
        viewRef: 'RTLview',
        portMaps: {
          CLK:    'ro_clock_' + i,
          RDEN:   'ro_en_' + i,
          ADDR:   'ro_addr_' + i,
          RDDATA: 'ro_data_' + i
        }
      }]
    });
  }
  for (let i = 0; i < p.numWritePorts; i++) {
    Object.assign(ports, fix({clock: 1, en: 1, addr: 'AW', data: 'DW'}, 'wo', i));
    busInterfaces.push({
      name: 'wo' + i,
      interfaceMode: 'target',
      busType: {vendor: 'sifive.com', library: 'MEM', name: 'WO', version: '0.1.0'},
      abstractionTypes: [{
        viewRef: 'RTLview',
        portMaps: {
          CLK:    'wo_clock_' + i,
          WREN:   'wo_en_' + i,
          ADDR:   'wo_addr_' + i,
          WRDATA: 'wo_data_' + i
        }
      }]
    });
  }
  for (let i = 0; i < p.numReadWritePorts; i++) {
    Object.assign(ports, fix({clock: 1, en: 1, addr: 'AW', wmode: 1, wmask: 1, wdata: 'DW', rdata: '-DW'}, 'rw', i));
    busInterfaces.push({
      name: 'rw' + i,
      interfaceMode: 'target',
      busType: {vendor: 'sifive.com', library: 'MEM', name: 'SPRAM', version: '0.1.0'},
      abstractionTypes: [{
        viewRef: 'RTLview',
        portMaps: {
          CLK:    'rw_clock_' + i,
          WREN:   'rw_wmode_' + i,
          RDEN:   'rw_en_' + i,
          ADDR:   'rw_addr_' + i,
          WRDATA: 'rw_wdata_' + i,
          RDDATA: 'rw_rdata_' + i
        }
      }]
    });
  }
  return {
    component: {
      name: p.moduleName,
      model: {ports},
      busInterfaces,
      parameters
    }
  };
};

const getBody = p => {
  const res = ['reg [DW-1:0] mem [DEPTH-1:0] /* synthesis syn_ramstyle="no_rw_check" */;'];

  if (p.writeLatency !== 1) {
    res.push('// write latency == ' + p.writeLatency + ' is not supported');
    return res;
  }

  if (p.readLatency < 0 || p.readLatency > 1 ) {
    res.push('// read latency == ' + p.readLatency + ' is not supported');
    return res;
  }

  for(let i = 0; i < p.numReadPorts; i++) {
    res.push(`reg [DW-1:0] ro_data_${i};`);
    if (p.readLatency === 1) {
      res.push(`always @(posedge ro_clock_${i}) if(ro_en_${i}) ro_data_${i} <= mem[ro_addr_${i}];`);
    } else { // 0
      res.push(`always @* ro_data_${i} = mem[ro_addr_${i}];`);
    }
  }

  for(let i = 0; i < p.numWritePorts; i++) {
    res.push(`always @(posedge wo_clock_${i}) if(wo_en_${i}) mem[wo_addr_${i}] <= wo_data_${i};`);
  }

  for(let i = 0; i < p.numReadWritePorts; i++) {
    res.push(`reg [DW-1:0] rw_rdata_${i};`);
    res.push(`always @(posedge rw_clock_${i}) if(rw_en_${i}) mem[rw_addr_${i}] <= rw_wdata_${i};`);
    if (p.readLatency === 1) {
      res.push(`always @(posedge rw_clock_${i}) if(rw_en_${i}) rw_rdata_${i} <= mem[rw_addr_${i}];`);
    } else { // 0
      res.push(`always @* rw_rdata_${i} = mem[rw_addr_${i}];`);
    }
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
