require("dotenv").config();
const fs = require("fs");
const path = require("path");
const utils = require("./utils");

async function recordFile(
  Tezos,
  contractAddress,
  filePath,
  algorithm,
  confirmations
) {
  // Package id and checksum
  const pkgId = utils.generateId(filePath, algorithm);
  const hashSum = utils.checksum(filePath, algorithm);

  // Add (id, hash) to storage
  console.log(
    `Recording ${path.basename(
      filePath
    )} (${pkgId} -> ${hashSum}) to ${contractAddress}`
  );
  try {
    const contract = await Tezos.contract.at(contractAddress);

    const op = await contract.methods.record(hashSum, pkgId).send();
    console.log(
      `Awaiting ${confirmations} block(s) for ${op.hash} to be confirmed...`
    );

    await op.confirmation(confirmations);
    console.log(`Operation injected: ${op.hash}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function recordDirectory(
  Tezos,
  contractAddress,
  dirPath,
  algorithm,
  confirmations
) {
  const dir = await fs.promises.opendir(dirPath);
  for await (const entry of dir) {
    if (entry.isFile()) {
      const filePath = path.join(dirPath, entry.name);
      await recordFile(
        Tezos,
        contractAddress,
        filePath,
        algorithm,
        confirmations
      );
      console.log();
    }
  }
}

module.exports = { recordFile, recordDirectory };
