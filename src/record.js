#!/usr/bin/env node
require('dotenv').config()

const path = require('path');
const { TezosToolkit, MichelsonMap } = require('@taquito/taquito');
const { InMemorySigner } = require('@taquito/signer');

const utils = require('./utils');

const contractAddress = 'KT1GmLE7QQ9NGAR1wbaD9nEJYqb562bZYqW6'

async function recordFile(filePath, algorithm = 'sha256') {
    // Generate package id and content hash
    let pkgId, hashSum;
    try {
        pkgId = utils.generateId(filePath, algorithm);
        hashSum = utils.checksum(filePath, algorithm);
    } catch (error) {
        console.error(`Error generating package id or content hash: ${error.message}`);
        process.exit(1);
    }

    const Tezos = new TezosToolkit(process.env.RPC);
    Tezos.setProvider({ signer: new InMemorySigner(process.env.KEY), })

    Tezos.contract
        .at(contractAddress)
        .then((contract) => {
            console.log(`Recording...`);
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
    const fileName = './utils.js';
    const filePath = path.join(__dirname, fileName);
    await recordFile(filePath);
})();
