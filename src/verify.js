const fs = require("fs");
const path = require("path");
const { MichelsonMap } = require("@taquito/taquito");
const { addLog, generateId, checksum } = require("./utils");

async function verifyFile(Tezos, contractAddress, filePath, algorithm) {
  // Package id and checksum
  const pkgId = generateId(filePath, algorithm);
  const hashSum = checksum(filePath, algorithm);

  console.log(
    `Verifying ${pkgId} -> ${hashSum} against contract at ${contractAddress}`
  );

  try {
    // Get storage from contract
    const contract = await Tezos.contract.at(contractAddress);
    const storage = await contract.storage();

    // Verify against storage
    let result;
    const storedHash = await storage.get(pkgId);
    if (!storedHash) {
      result = false;
    } else {
      result = hashSum === storedHash;
    }

    // Log result
    logDir = path.join(__dirname, '..', "logs");
    logPath = path.join(logDir, `${contractAddress}.csv`);
    addLog(logPath, filePath, result);
    console.log(
      `Verification result for ${path.basename(filePath)}: ${result}`
    );

    return result;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function verifyDirectory(Tezos, contractAddress, dirPath, algorithm) {
  const dir = await fs.promises.opendir(dirPath);
  for await (const entry of dir) {
    if (entry.isFile()) {
      const filePath = path.join(dirPath, entry.name);
      await verifyFile(Tezos, contractAddress, filePath, algorithm);
      console.log();
    }
  }
}

module.exports = { verifyFile, verifyDirectory };
