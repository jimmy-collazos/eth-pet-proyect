const path      = require('path');
const fs        = require('fs-extra');
const solc      = require('solc');

const buildPath  = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath  = path.resolve(__dirname, 'contracts', 'Campaing.sol');
const source        = fs.readFileSync(contractPath, 'utf-8');
const output        = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

Object.entries(output)
  .map(([name, contract]) => [name.substr(1), contract])
  .map(([name, contract]) => [path.resolve(buildPath, name + '.json'), contract])
  .forEach(([path, contract]) => fs.outputJsonSync(path, contract));