const fs = require('fs');
const path = require('path');
const { MichelsonMap } = require('@taquito/taquito');
const { openLog } = require('./utils');

async function originate(Tezos, contractPath) {
    console.log(`Originating contract: ${contractPath}...`);
    try {
        // Read Michelson contract file
        const codeJSONFile = fs.readFileSync(contractPath, 'utf8');

        const storage = new MichelsonMap();
        const originationOp = await Tezos.contract.originate({
            code: codeJSONFile,
            storage: storage,
        });

        const contractAddress = originationOp.contractAddress;
        console.log(`Waiting for confirmation of origination for ${contractAddress}`);

        const contract = await originationOp.contract();
        console.log(`Origination completed.`);

        // Open log
        logDir = path.join(__dirname, '../logs');
        logPath = path.join(logDir, `${contractAddress}.csv`);
        openLog(logPath);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = { originate };
