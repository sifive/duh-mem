#!/usr/bin/env node
'use strict';

// const fsPromises = require('fs/promises');
const yargs = require('yargs');
const fir = require('../lib/fir');

const handleFir = async opt => {
  // const fname = opt.moduleName + '.v';
  const body = fir(opt);
  console.log(body);
  // await fsPromises.writeFile(fname, body);
};

yargs
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .command({
    command: 'fir',
    desc: 'generate FIRRTLMem',
    handler: handleFir,
    builder: yargs => {
      yargs
        .option('depth', {
          type: 'number',
          desc: 'memory array depth',
          require: true
        })
        .option('numReadPorts', {
          type: 'number',
          desc: 'number of read ports',
          require: true
        })
        .option('numWritePorts', {
          type: 'number',
          desc: 'number of write ports',
          require: true
        })
        .option('numReadWritePorts', {
          type: 'number',
          desc: 'number of read/write ports',
          require: true
        })
        .option('readLatency', {
          type: 'number',
          desc: 'read latency',
          require: true
        })
        .option('writeLatency', {
          type: 'number',
          desc: 'write latency',
          require: true
        })
        .option('width', {
          type: 'number',
          desc: 'data port width',
          require: true
        })
        .option('moduleName', {
          type: 'string',
          desc: 'module name',
          require: true
        });
    }
  })
  .demandCommand()
  .help().argv;
