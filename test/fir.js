#!/usr/bin/env node
'use strict';

const fs = require('fs');
const chai = require('chai');
const lib = require('../lib/index.js');

const expect = chai.expect;

const cases = {
  rw1: {
    source: {
      depth: 300,
      numReadPorts: 0,
      numWritePorts: 0,
      numReadWritePorts: 1,
      readLatency: 1,
      writeLatency: 1,
      width: 128,
      moduleName: 'rw1'
    },
    result:
`module rw1 #(
  parameter DW    = 128,
  parameter AW    = 9,
  parameter DEPTH = 300
) (
  input           rw_clock_0,
  input           rw_en_0,
  input  [AW-1:0] rw_addr_0,
  input           rw_wmask_0,
  input  [DW-1:0] rw_wdata_0,
  output [DW-1:0] rw_rdata_0
);
reg [DW-1:0] mem [DEPTH-1:0] /* synthesis syn_ramstyle="no_rw_check" */;
reg [DW-1:0] rw_rdata_0;
always @(posedge rw_clock_0) if(rw_en_0) mem[rw_addr_0] <= rw_wdata_0;
always @(posedge rw_clock_0) if(rw_en_0) rw_rdata_0 <= mem[rw_addr_0];
endmodule // rw1
`
  },
  r1: {
    source: {
      depth: 42,
      numReadPorts: 1,
      numWritePorts: 0,
      numReadWritePorts: 0,
      readLatency: 1,
      writeLatency: 1,
      width: 32,
      moduleName: 'r1'
    },
    result:
`module r1 #(
  parameter DW    = 32,
  parameter AW    = 6,
  parameter DEPTH = 42
) (
  input           ro_clock_0 /* ro0:CLK */,
  input           ro_en_0    /* ro0:RDEN */,
  input  [AW-1:0] ro_addr_0  /* ro0:ADDR */,
  output [DW-1:0] ro_data_0  /* ro0:RDDATA */
);
reg [DW-1:0] mem [DEPTH-1:0] /* synthesis syn_ramstyle="no_rw_check" */;
reg [DW-1:0] ro_data_0;
always @(posedge ro_clock_0) if(ro_en_0) ro_data_0 <= mem[ro_addr_0];
endmodule // r1
`
  },
  w1: {
    source: {
      depth: 130,
      numReadPorts: 0,
      numWritePorts: 1,
      numReadWritePorts: 0,
      readLatency: 1,
      writeLatency: 1,
      width: 11,
      moduleName: 'w1'
    },
    result:
`module w1 #(
  parameter DW    = 11,
  parameter AW    = 8,
  parameter DEPTH = 130
) (
  input           wo_clock_0 /* wo0:CLK */,
  input           wo_en_0    /* wo0:WREN */,
  input  [AW-1:0] wo_addr_0  /* wo0:ADDR */,
  input  [DW-1:0] wo_data_0  /* wo0:WRDATA */
);
reg [DW-1:0] mem [DEPTH-1:0] /* synthesis syn_ramstyle="no_rw_check" */;
always @(posedge wo_clock_0) if(wo_en_0) mem[wo_addr_0] <= wo_data_0;
endmodule // w1
`
  },
  zoo: {
    source: {
      depth: 42,
      numReadPorts: 1,
      numWritePorts: 1,
      numReadWritePorts: 1,
      readLatency: 0,
      writeLatency: 1,
      width: 32,
      moduleName: 'zoo'
    },
    result:
`module zoo #(
  parameter DW    = 32,
  parameter AW    = 6,
  parameter DEPTH = 42
) (
  input           ro_clock_0 /* ro0:CLK */,
  input           ro_en_0    /* ro0:RDEN */,
  input  [AW-1:0] ro_addr_0  /* ro0:ADDR */,
  output [DW-1:0] ro_data_0  /* ro0:RDDATA */,
  input           wo_clock_0 /* wo0:CLK */,
  input           wo_en_0    /* wo0:WREN */,
  input  [AW-1:0] wo_addr_0  /* wo0:ADDR */,
  input  [DW-1:0] wo_data_0  /* wo0:WRDATA */,
  input           rw_clock_0,
  input           rw_en_0,
  input  [AW-1:0] rw_addr_0,
  input           rw_wmask_0,
  input  [DW-1:0] rw_wdata_0,
  output [DW-1:0] rw_rdata_0
);
reg [DW-1:0] mem [DEPTH-1:0] /* synthesis syn_ramstyle="no_rw_check" */;
reg [DW-1:0] ro_data_0;
always @* ro_data_0 = mem[ro_addr_0];
always @(posedge wo_clock_0) if(wo_en_0) mem[wo_addr_0] <= wo_data_0;
reg [DW-1:0] rw_rdata_0;
always @(posedge rw_clock_0) if(rw_en_0) mem[rw_addr_0] <= rw_wdata_0;
always @* rw_rdata_0 = mem[rw_addr_0];
endmodule // zoo
`
  }
};

describe('fir', () => {
  Object.keys(cases).map(key => {
    it(key, async () => {
      const result = lib.fir(cases[key].source);
      const fname = key + '.v';
      await fs.promises.writeFile(fname, result);
      expect(result).to.eq(cases[key].result);
    });
  });
});

/* eslint-env mocha */
