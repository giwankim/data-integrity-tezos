const path = require('path');
const { addLog, generateId, checksum } = require('./utils');

async function verify(Tezos, contractAddress, filePath, algorithm) {
    // Get package id and checksum
    const pkgId = generateId(filePath, algorithm);
    const hashSum = checksum(filePath, algorithm);

    // Verify against storage
    console.log(`Verifying ${pkgId} -> ${hashSum} against contract at ${contractAddress}`);
    try {
        const contract = await Tezos.contract.at(contractAddress);
        const storage = await contract.storage();

        let result;
        if (!storage.has(pkgId)) {
            result = false;
        } else {
            const storedHash = storage.get(pkgId);
            result = (hashSum === storedHash);
        }

        // log result
        logDir = path.join(__dirname, '../logs');
        logPath = path.join(logDir, `${contractAddress}.csv`);
        addLog(logPath, filePath, result);

        console.log(`Verification result: ${result}`);
        return result;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

exports.verify = verify;
