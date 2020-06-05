#!/usr/bin/env node
'use strict';

const chai = require('chai');

const {readDuh, validateSchema, aVLNV} = require('duh-core');

const expect = chai.expect;

describe('basic', () => {
  it('availability', async () => {
    const duh = await readDuh({filename: './test/catalog.json5'});
    await validateSchema(duh);

    const catalog = duh.catalog;
    expect(catalog).to.be.an('object');
    catalog.components.map(e => {
      const c = e.component;
      expect(c).to.be.an('object');
      // list all componnets in the catalog
      console.log('component:', aVLNV(c));
    });
  });

});

/* eslint-env mocha */
