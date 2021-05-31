const fs = require("fs");
const path = require("path");

const { MichelsonMap } = require("@taquito/taquito");

const { generateId, checksum } = require("./utils");

async function estimateOrigination(Tezos, contractPath) {
  console.log(
    `Estimating contract origination of ${path.basename(contractPath)}...`
  );
  try {
    const codeJSONFile = fs.readFileSync(contractPath, "utf8");

    const estimationOp = await Tezos.estimate.originate({
      code: codeJSONFile,
      storage: new MichelsonMap(),
    });

    // number of Mutez that will be burned for the storage of the operation
    const burnFeeMutez = estimationOp.burnFeeMutez;

    // limit on the amount of gas a given operation can consume
    const gasLimit = estimationOp.gasLimit;

    // minimum fee for the operation according to baker defaults
    const minimalFeeMutez = estimationOp.minimalFeeMutez;

    // limit on the amount of storage an operation can use
    const storageLimit = estimationOp.storageLimit;

    // suggested fee for the operation includes a minimal fee and a small buffer
    const suggestedFeeMutez = estimationOp.suggestedFeeMutez;

    // totalCost = minimalFeeMutez + burnFeeMutez
    const totalCost = estimationOp.totalCost;

    // fees according to your specified base fee will ensure that at least
    // minimum fees are used
    const usingBaseFeeMutez = estimationOp.usingBaseFeeMutez;

    console.log(`burnFeeMutez: ${burnFeeMutez}`);
    console.log(`gasLimit: ${gasLimit}`);
    console.log(`minimalFeeMutez: ${minimalFeeMutez}`);
    console.log(`storageLimit: ${storageLimit}`);
    console.log(`suggestedFeeMutez : ${suggestedFeeMutez}`);
    console.log(`totalCost : ${totalCost}`);
    console.log(`usingBaseFeeMutez : ${usingBaseFeeMutez}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function estimateRecordFile(Tezos, contractAddress, filePath, algorithm) {
  // Package id and checksum
  const pkgId = generateId(filePath, algorithm);
  const hashSum = checksum(filePath, algorithm);

  try {
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methods
      .record(hashSum, pkgId)
      .toTransferParams({});
    const estimationOp = await Tezos.estimate.transfer(op);

    const burnFeeMutez = estimationOp.burnFeeMutez;
    const gasLimit = estimationOp.gasLimit;
    const minimalFeeMutez = estimationOp.minimalFeeMutez;
    const storageLimit = estimationOp.storageLimit;
    const suggestedFeeMutez = estimationOp.suggestedFeeMutez;
    const totalCost = estimationOp.totalCost;
    const usingBaseFeeMutez = estimationOp.usingBaseFeeMutez;

    console.log(`burnFeeMutez: ${burnFeeMutez}`);
    console.log(`gasLimit: ${gasLimit}`);
    console.log(`minimalFeeMutez: ${minimalFeeMutez}`);
    console.log(`storageLimit: ${storageLimit}`);
    console.log(`suggestedFeeMutez : ${suggestedFeeMutez}`);
    console.log(`totalCost : ${totalCost}`);
    console.log(`usingBaseFeeMutez : ${usingBaseFeeMutez}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function estimateRecordDirectory(
  Tezos,
  contractAddress,
  directoryPath,
  algorithm
) {}

module.exports = {
  estimateOrigination,
  estimateRecordFile,
  estimateRecordDirectory,
};
