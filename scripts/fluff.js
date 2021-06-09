const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const { faucetSignerFactory } = require("../src/kogi");

async function estimateRecordTest(Tezos, contractAddress, pkgId, cntHash) {
  try {
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methods
      .record(cntHash, pkgId)
      .toTransferParams({});
    const estimationOp = await Tezos.estimate.transfer(op);

    const burnFeeMutez = estimationOp.burnFeeMutez;
    const gasLimit = estimationOp.gasLimit;
    const minimalFeeMutez = estimationOp.minimalFeeMutez;
    const storageLimit = estimationOp.storageLimit;
    const suggestedFeeMutez = estimationOp.suggestedFeeMutez;
    const totalCost = estimationOp.totalCost;
    const usingBaseFeeMutez = estimationOp.usingBaseFeeMutez;

    return {
      burnFeeMutez: burnFeeMutez,
      gasLimit: gasLimit,
      minimalFeeMutez: minimalFeeMutez,
      storageLimit: storageLimit,
      suggestedFeeMutez: suggestedFeeMutez,
      totalCost: totalCost,
      usingBaseFeeMutez: usingBaseFeeMutez,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function recordFile(
  Tezos,
  contractAddress,
  pkgId,
  cntHash,
  confirmations
) {
  try {
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methods.record(cntHash, pkgId).send();
    await op.confirmation(confirmations);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function run_trials(num_trials, address) {
  // generate test data
  let test_data = [];
  for (let i = 0; i < num_trials; i++) {
    const id_data = i.toString();
    const cnt_data = (2 * (i + 1)).toString();
    const id = crypto.createHash("sha256").update(id_data).digest("hex");
    const cnt = crypto.createHash("sha256").update(cnt_data).digest("hex");
    test_data.push([id, cnt]);
  }

  const Tezos = await faucetSignerFactory(
    "https://florencenet.smartpy.io",
    path.join(__dirname, "..", "faucet.json")
  );

  let estimates = [];
  let count = 1;
  for (let data of test_data) {
    console.log(count++);
    const pkgId = data[0];
    const cntHash = data[1];

    // get estimates
    const estimate = await estimateRecordTest(Tezos, address, pkgId, cntHash);
    estimates.push(estimate);

    // record to contract
    await recordFile(Tezos, address, pkgId, cntHash, 3);
  }

  // record results to file
  try {
    fs.writeFileSync(
      path.join(__dirname, '..', `experiments/experiment${num_trials}.json`),
      JSON.stringify(estimates)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

(async () => {
  // trials = [10, 100, 1000];
  // addresses = [
  //   "KT1LCamXN18MrXfstzpp42xG6cNNf9Jz1mED",
  //   "KT197xNBxMJMdTivRREPP5MiDX8zirQTNPcE",
  //   "KT1HQA8hBGQLvxftgeBMAWPCwRi3LvQ5Nf8H",
  // ];

  // for (let i = 0; i < trials.length; i++) {
  //   const num_trials = trials[i];
  //   const address = addresses[i];
  //   console.log(`Running ${num_trials} trials`);
  //   await run_trials(num_trials, address);
  // }

  const address = "KT1SFRXb2kNtKmAaAeXzTNYiBNU9wkveffHF";
  const num_trials = 10_000;
  console.log(`Running ${num_trials} trials`);
  await run_trials(num_trials, address);
})();

