#!/usr/bin/env node
require('dotenv').config();
const path = require('path');
const utils = require('./utils');
const kogi = require('./kogi');

async function recordFile(contractAddress, filePath, algorithm = 'sha256') {
    // Get package id and content hash
    const pkgId = utils.generateId(filePath, algorithm);
    const hashSum = utils.checksum(filePath, algorithm);

    // Add id -> hash to storage
    console.log(`Recording ${pkgId} -> ${hashSum} to ${contractAddress}`);
    try {
        const Tezos = await kogi.signerFactory();
        const contract = await Tezos.contract.at(contractAddress);
        const op = await contract.methods.record(pkgId, hashSum).send();

        const confirmation = process.env.CONFIRMATION;
        console.log(`Awaiting ${confirmation} blocks for ${op.hash} to be confirmed...`);
        await op.confirmation(confirmation);

        console.log(`Operation injected: ${process.env.RPC}/${op.hash}`);
    } catch (error) {
        console.error(`Error: ${JSON.stringify(error, null, 2)}`);
    }
}

(async() => {
    // const contractAddress = 'KT1GmLE7QQ9NGAR1wbaD9nEJYqb562bZYqW6';
    const contractAddress = 'KT19sa3bBSXjQ83miwjSQMZjKQ7u9HUT4Xzt';
    const fileName = './utils.js';
    const filePath = path.join(__dirname, fileName);
    await recordFile(contractAddress, filePath);
})();

exports.recordFile = recordFile;
