const fs = require("fs");
const { TezosToolkit } = require("@taquito/taquito");
const { InMemorySigner, importKey } = require("@taquito/signer");

async function signerFactory(rpcUrl, secretKey) {
  try {
    const Tezos = new TezosToolkit(rpcUrl);
    const signer = await InMemorySigner.fromSecretKey(secretKey);
    await Tezos.setProvider({ signer: signer });
    return Tezos;
  } catch (error) {
    console.error(`Error importing secret key: ${error.message}`);
  }
}

async function faucetSignerFactory(rpcUrl, faucetPath) {
  const Tezos = new TezosToolkit(rpcUrl);
  const { email, password, mnemonic, secret } = await getFaucetKey(faucetPath);
  try {
    await importKey(Tezos, email, password, mnemonic.join(" "), secret);
    return Tezos;
  } catch (error) {
    console.error(`Error importing importing faucet key: ${error.message}`);
  }
}

async function getFaucetKey(faucetPath) {
  try {
    const faucet = await fs.promises.readFile(faucetPath);
    return JSON.parse(faucet);
  } catch (error) {
    console.error(`Error reading faucet key file: ${error.message}`);
  }
}

module.exports = {
  signerFactory: signerFactory,
  faucetSignerFactory: faucetSignerFactory,
};
