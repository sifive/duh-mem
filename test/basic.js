#!/usr/bin/env node
'use strict';

const chai = require('chai');

const {readDuh, validateSchema, aVLNV} = require('duh-core');

const expect = chai.expect;

const lib = require('../lib/index.js');

const kits = [
  {
    processNode: 'sky130',

    getPorts: comp => ({
      clk: 1,
      wren: 1,
      rden: 1,
      addr: comp.props.addrWidth,
      wrdata: comp.props.dataWidth,
      rddata: -comp.props.dataWidth
    }),

    getRWportMap: () => ({
      CLK: 'clk',
      WREN: 'wren',
      RDEN: 'rden',
      ADDR: 'addr',
      WRDATA: 'wrdata',
      RDDATA: 'rddata'
    })
  }
];

describe('basic', () => {

  it('lib', async () => {
    expect(lib).to.be.an('object');
  });

  it('availability', async () => {
    const duh = await readDuh({filename: './test/catalog.json5'});
    await validateSchema(duh);

    const catalog = duh.catalog;
    expect(catalog).to.be.an('object');
    for (const duh1 of catalog.components) {
      await validateSchema(duh1);
      // list all componnets in the catalog
      console.log('component:', aVLNV(duh1.component));
      // const duh2 = lib.negotiator(kits)(duh1);
      // await validateSchema(duh2);
      // console.log(JSON.stringify(duh2, null, 2));
    }
  });

});

/* eslint-env mocha */
