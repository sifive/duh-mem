[![NPM version](https://img.shields.io/npm/v/duh-mem.svg)](https://www.npmjs.org/package/duh-mem)
[![](https://github.com/sifive/duh-mem/workflows/Node%20CI/badge.svg)](https://github.com/sifive/duh-mem/actions)

DUH memory package

## Install

`npm i duh-mem`

## CLI

```
duh-mem fir

generate FIRRTLMem

Options:
      --version            Show version number                         [boolean]
  -v, --verbose                                                 [default: false]
      --help               Show help                                   [boolean]
      --depth              memory array depth                [number] [required]
      --numReadPorts       number of read ports              [number] [required]
      --numWritePorts      number of write ports             [number] [required]
      --numReadWritePorts  number of read/write ports        [number] [required]
      --readLatency        read latency                      [number] [required]
      --writeLatency       write latency                     [number] [required]
      --width              data port width                   [number] [required]
      --moduleName         module name                       [string] [required]
  -o, --output             output path                                  [string]
```
