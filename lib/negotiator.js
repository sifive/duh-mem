'use strict';

const update = require('immutability-helper');

const negotiator = kits =>
  duh => {
    const comp = duh.component;

    const kit = kits.find(e => e.processNode === comp.props.processNode);

    console.log(kits);

    const comp1 = update(comp, {
      model: {
        ports: {$set: kit.getPorts(comp)}
      }
    });

    const comp2 = /* getRWportMaps */ comp1;
    //

    return {component: comp2};
  };

module.exports = negotiator;
