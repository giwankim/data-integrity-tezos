require("dotenv").config();
const { mnemonic, secret, password, email } = require("./faucet.json");
const { alice } = require("./scripts/sandbox/accounts");

module.exports = {
  networks: {
    development: {
      host: "http://localhost",
      port: 8732,
      secretKey: "",
    },
    edonet: {
      host: "https://api.tez.ie/rpc/edonet",
      port: 443,
      secret,
      mnemonic,
      password,
      email,
    },
    florencenet: {
      host: "https://api.tez.ie/rpc/florencenet",
      port: 443,
      secret,
      mnemonic,
      password,
      email,
    },
    mainnet: {
      host: "https://mainnet.",
      port: 443,
    },
  },
};
