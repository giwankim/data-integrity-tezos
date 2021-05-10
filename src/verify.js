#!/usr/bin/env node
const path = require('path');
const utils = require('./utils');
const kogi = require('./kogi');

async function verify(contractAddress, filePath, algorithm = 'sha256') {
    // Get package id and checksum
    const pkgId = utils.generateId(filePath, algorithm);
    const hashSum = utils.checksum(filePath, algorithm);

    // Verify against storage
    console.log(`Verifying ${pkgId} -> ${hashSum} against contract at ${contractAddress}`);
    try {
        const Tezos = await kogi.signerFactory();
        const contract = await Tezos.contract.at(contractAddress);
        const storage = await contract.storage();

        if (!storage.has(pkgId)) {
            return false;
        } else {
            const storedHash = storage.get(pkgId);
            return hashSum == storedHash;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

(async() => {
    const contractAddress = 'KT19sa3bBSXjQ83miwjSQMZjKQ7u9HUT4Xzt';
    const filePath = path.join(__dirname, './utils.js');
    const result = await verify(contractAddress, filePath);
    console.log(result);
})();

exports.verify = verify;
