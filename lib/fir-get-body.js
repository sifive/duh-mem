'use strict';

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

module.exports = getBody;
