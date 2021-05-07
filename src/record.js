#!/usr/bin/env node
require('dotenv').config()
const path = require('path');
const utils = require('./utils');
const kogi = require('./kogi');

async function recordFile(contractAddress, filePath, algorithm = 'sha256') {
    // Generate package id and content hash
    const pkgId = utils.generateId(filePath, algorithm);
    const hashSum = utils.checksum(filePath, algorithm);

    // Add id -> hash to contract storage map
    const Tezos = await kogi.signerFactory(process.env.RPC, process.env.KEY);
    Tezos.contract
        .at(contractAddress)
        .then((contract) => {
            console.log(`Recording ${pkgId} -> ${hashSum} to ${contractAddress}`);
            return contract.methods.record(pkgId, hashSum).send();
        })
        .then((op) => {
            console.log(`Awaiting for ${op.hash} to be confirmed...`);
            return op.confirmation(3).then(() => op.hash);
        })
        .then((hash) => {
            console.log(`Operation injected: ${process.env.RPC}/${hash}`);
        })
        .catch((error) => {
            console.error(`Error: ${JSON.stringify(error, null, 2)}`);
            process.exit(1);
        });
}

(async() => {
    const contractAddress = 'KT1GmLE7QQ9NGAR1wbaD9nEJYqb562bZYqW6';
    const fileName = './utils.js';
    const filePath = path.join(__dirname, fileName);
    await recordFile(contractAddress, filePath);
})();

exports.recordFile = recordFile;
