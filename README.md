[![](https://github.com/sifive/duh-mem/workflows/Node%20CI/badge.svg)](https://github.com/sifive/duh-mem/actions)

# duh-mem

DUH memory package

## CLI

```
duh-mem fir

generate FIRRTLMem

Options:
      --version        Show version number                             [boolean]
  -v, --verbose                                                 [default: false]
      --help           Show help                                       [boolean]
      --depth          memory array depth                    [number] [required]
      --numReadPorts   number of read ports                  [number] [required]
      --numWritePorts  number of write ports                 [number] [required]
      --readLatency    read latency                          [number] [required]
      --writeLatency   write latency                         [number] [required]
      --width          data port width                       [number] [required]
      --moduleName     module name                           [string] [required]
```
