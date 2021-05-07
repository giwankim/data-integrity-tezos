const { TezosToolkit } = require('@taquito/taquito');
const { InMemorySigner, importKey } = require('@taquito/signer');

async function signerFactory(rpcUrl, secretKey) {
    const Tezos = new TezosToolkit(rpcUrl);
    await Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(secretKey) });
    return Tezos;
}

async function getFaucetKey(faucetPath) {
    try {
        const faucetData = await fs.promises.readFile(faucetPath);
        return JSON.parse(faucetData);
    } catch (error) {
        console.error(`Error trying to read faucet key: ${error.message}`);
    }
}

async function faucetSignerFactory(rpcUrl, faucetPath) {
    const Tezos = new TezosToolkit(rpcUrl);
    const { email, password, mnemonic, secret } = await getFaucetKey(faucetPath);
    await importKey(
        Tezos,
        email,
        password,
        mnemonic.join(' '),
        secret
    )
    .catch((error) => {
        console.error(`Error importing importing faucet key: ${error.message}`);
    });
}

module.exports = {
    signerFactory: signerFactory,
    faucetSignerFactory: faucetSignerFactory,
};
