#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { MichelsonMap } = require('@taquito/taquito');
const kogi = require('./kogi');

async function originate(contractPath) {
    console.log(`Originating of contract at ${contractPath}...`);
    try {
        const codeJSONFile = fs.readFileSync(contractPath, 'utf8');

        const Tezos = await kogi.faucetSignerFactory();

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

(async() => {
    const contractFile = '../build/EvenSimpler.michelson';
    const contractPath = path.join(__dirname, contractFile);
    await originate(contractPath);
})();

exports.originate = originate;
