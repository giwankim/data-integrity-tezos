const fs = require('fs');
const path = require('path');
const { MichelsonMap } = require('@taquito/taquito');
const kogi = require('./kogi');

async function originate(Tezos, contractPath) {
    console.log(`Originating contract at ${contractPath}...`);
    try {
        const codeJSONFile = fs.readFileSync(contractPath, 'utf8');
        const storage = new MichelsonMap();
        const originationOp = await Tezos.contract.originate({
            code: codeJSONFile,
            storage: storage,
        });
        const contractAddress = originationOp.contractAddress;
        console.log(`Waiting for confirmation of origination for ${contractAddress}`);
        console.log(`Origination completed.`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

exports.originate = originate;
