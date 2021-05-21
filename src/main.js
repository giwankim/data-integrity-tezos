#!/usr/bin/env node
require("dotenv").config();
const yargs = require("yargs");
const path = require("path");
const { signerFactory, faucetSignerFactory } = require("./kogi");
const { originate } = require("./originate");
const { recordFile, recordDirectory } = require("./record");
const { verifyFile, verifyDirectory } = require("./verify");

const argv = yargs
  .command("originate", "Originate smart contract.", {
    path: {
      description: "Path to compiled Michelson smart contract.",
      alias: "c",
      type: "string",
      demand: true,
      default: path.join(__dirname, "../build/Simpler.michelson"),
    },
  })
  .command("record", "Record checksum to a smart contract.", {
    contract: {
      description: "Address to smart contract.",
      alias: "c",
      type: "string",
      demand: true,
    },
    path: {
      description: "Path to the file to be recorded.",
      alias: "p",
      type: "string",
    },
    directory: {
      description: "Path to directory to be recorded.",
      alias: "d",
      type: "string",
    },
  })
  .command("verify", "Verify the checksum of a file.", {
    contract: {
      description: "Address to smart contract.",
      alias: "c",
      type: "string",
      demand: true,
    },
    path: {
      description: "Path to the file to verify.",
      alias: "p",
      type: "string",
    },
    directory: {
      description: "Path to directory to verify.",
      alias: "d",
      type: "string",
    },
  })
  .option("url", {
    description: "Tezos RPC node",
    alias: "u",
    type: "string",
    default: "https://api.tez.ie/rpc/florencenet",
  })
  .option("faucet_key_file", {
    description: "Path to a faucet key JSON file",
    alias: "f",
    type: "string",
    default: path.join(__dirname, "../faucet.json"),
  })
  .option("secret_key", {
    description: "Secret key.",
    alias: "s",
    type: "string",
  })
  .option(`algorithm`, {
    description: "Algorithm used to generate hash digests.",
    alias: "a",
    type: "string",
    default: "sha256",
  })
  .option(`confirmations`, {
    description: "Number of confirmations.",
    alias: "b",
    type: "int",
    default: 1,
  })
  .help()
  .alias("help", "h").argv;

(async () => {
  // Taquito toolkit for interacting with Tezos
  let Tezos;
  if (argv.secret_key) {
    Tezos = await signerFactory(argv.url, argv.secret_key);
  } else if (argv.faucet_key_file) {
    Tezos = await faucetSignerFactory(argv.url, argv.faucet_key_file);
  } else {
    console.error(`Please provide a faucet account or secret key.`);
    process.exit(1);
  }

  // Route to appropriate function
  if (argv._.includes("originate")) {
    originate(Tezos, argv.path);
  } else if (argv._.includes("record")) {
    if (argv.directory) {
      recordDirectory(
        Tezos,
        argv.contract,
        argv.directory,
        argv.algorithm,
        argv.confirmations
      );
    } else if (argv.path) {
      await recordFile(
        Tezos,
        argv.contract,
        argv.path,
        argv.algorithm,
        argv.confirmations
      );
    } else {
      console.error(`Please specify either a directory or file to record.`);
      process.exit(1);
    }
  } else if (argv._.includes("verify")) {
    if (argv.directory) {
      verifyDirectory(Tezos, argv.contract, argv.directory, argv.algorithm);
    } else if (argv.path) {
      verifyFile(Tezos, argv.contract, argv.path, argv.algorith);
    } else {
      console.error(`Please specify either a directory or file to verify.`);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
})();

