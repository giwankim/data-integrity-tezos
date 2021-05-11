const path = require('path');
const utils = require('./utils');
const kogi = require('./kogi');

async function verify(Tezos, contractAddress, filePath, algorithm) {
    // Get package id and checksum
    const pkgId = utils.generateId(filePath, algorithm);
    const hashSum = utils.checksum(filePath, algorithm);

    // Verify against storage
    console.log(`Verifying ${pkgId} -> ${hashSum} against contract at ${contractAddress}`);
    try {
        const contract = await Tezos.contract.at(contractAddress);
        const storage = await contract.storage();

        if (!storage.has(pkgId)) {
            return false;
        } else {
            const storedHash = storage.get(pkgId);
            return hashSum === storedHash;
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

exports.verify = verify;
