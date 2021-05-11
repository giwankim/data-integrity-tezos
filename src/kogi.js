require('dotenv').config();
const fs = require('fs');
const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner, importKey } = require('@taquito/signer');

async function signerFactory() {
    try {
        const Tezos = new TezosToolkit(process.env.RPC);
        const signer = await InMemorySigner.fromSecretKey(process.env.KEY);
        await Tezos.setProvider({ signer: signer });
        return Tezos;
    } catch (error) {
        console.error(`Error importing secret key: ${error.message}`);
    }
}

async function getFaucetKey(faucetPath) {
    try {
        const faucetData = await fs.promises.readFile(faucetPath);
        return JSON.parse(faucetData);
    } catch (error) {
        console.error(`Error reading faucet key file: ${error.message}`);
    }
}

async function faucetSignerFactory(faucetPath) {
    const Tezos = new TezosToolkit(process.env.RPC);
    const { email, password, mnemonic, secret } = await getFaucetKey(faucetPath);
    try {
        await importKey(
            Tezos,
            email,
            password,
            mnemonic.join(' '),
            secret
        )
        return Tezos;
    } catch (error) {
        console.error(`Error importing importing faucet key: ${error.message}`);
    }
}

module.exports = {
    signerFactory: signerFactory,
    faucetSignerFactory: faucetSignerFactory,
};
