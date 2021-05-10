require('dotenv').config();
const path = require('path');
const utils = require('./utils');
const kogi = require('./kogi');

async function record(Tezos, contractAddress, filePath, algorithm = 'sha256') {
    // Get package id and checksum
    const pkgId = utils.generateId(filePath, algorithm);
    const hashSum = utils.checksum(filePath, algorithm);

    // Add id -> hash to storage
    console.log(`Recording ${pkgId} -> ${hashSum} to ${contractAddress}`);
    try {
        const contract = await Tezos.contract.at(contractAddress);
        const op = await contract.methods.record(hashSum, pkgId).send();

        const confirmation = process.env.CONFIRMATION;
        console.log(`Awaiting ${confirmation} blocks for ${op.hash} to be confirmed...`);
        await op.confirmation(confirmation);

        console.log(`Operation injected: ${process.env.RPC}/${op.hash}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

exports.record = record;
