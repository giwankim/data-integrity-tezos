#!/usr/bin/env node
require('dotenv').config();
const yargs = require('yargs');
const path = require('path');
const kogi = require('./kogi');
// const utils = require('./utils');
const { originate } = require('./originate');
const { record } = require('./record');
const { verify } = require('./verify');

const argv = yargs
    .command('originate', 'Originate smart contract.', {
        path: {
            description: 'Path to compiled Michelson smart contract.',
            alias: 'p',
            type: 'string',
            demand: true,
            default: path.join(__dirname, `../build/${process.env.CONTRACT}`),
        }
    })
    .command('record', 'Record checksum to a smart contract.', {
        contract: {
            description: 'Address to smart contract.',
            alias: 'c',
            type: 'string',
            demand: true,
        },
        path: {
            description: 'Path to the file to be recorded.',
            alias: 'p',
            type: 'string',
            demand: true,
        }
    })
    .command('verify', 'Verify the checksum of a file.', {
        contract: {
            description: 'Address to smart contract.',
            alias: 'c',
            type: 'string',
            demand: true,
        },
        path: {
            description: 'Path to the file to check.',
            alias: 'p',
            type: 'string',
            demand: true,
        }
    })
    .option('url', {
        description: 'Tezos RPC node',
        alias: 'u',
        type: 'string',
        default: 'https://api.tez.ie/rpc/edonet',
    })
    .option('faucet_key_file', {
        description: 'Path to a faucet key JSON file',
        alias: 'f',
        type: 'string',
        default: '../faucet.json',
    })
    .option('secret_key', {
        description: 'Secret key.',
        alias: 's',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

(async() => {
    let Tezos;
    if (argv.faucet_key_file) {
        Tezos = await kogi.faucetSignerFactory();
    } else if (argv.secret_key) {
        Tezos = await kogi.signerFactory();
    } else {
        console.error(`No faucet account or secret key provided.`);
        process.exit(1);
    }

    if (argv._.includes('originate')) {
        originate(Tezos, argv.path);
    } else if (argv._.includes('record')) {
        record(Tezos, argv.contract, argv.path);
    } else if (argv._.includes('verify')) {
        const result = await verify(Tezos, argv.contract, argv.path);
        console.log(result);
        // TODO: log result
    }
})();