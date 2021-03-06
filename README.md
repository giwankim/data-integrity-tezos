# data-integrity-tezos
Data integrity on Tezos
## Install
### Node Version Manager (NVM)
To install `nvm`:
```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
The command above downloads a script and runs it. It clones nvm repository to `~/.nvm`, then attempts to add the lines below to an appropriate profile file.
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
Run one of the commands below to source the above:  
*bash*: `source ~/.bashrc`  
*zsh*: `source ~/.zshrc`  
*ksh*: `source ~/.profile`  
### Node.js
Install LTS version (currently, 14.16.1) of Node.js by running:
```bash
$ nvm install --lts
```
To check that Node.js has been correctly installed:
```bash
$ node -v
v14.16.1
```
### LIGO
Install the static binary that runs on most Linux distributions running on x86 architecture:
```bash
$ wget https://ligolang.org/bin/linux/ligo
$ chmod +x ./ligo
$ sudo cp ./ligo /usr/local/bin
```
Note that it is also possible to use a Docker container to compile. To do so, replace `ligo` with the following commmand in the `compile` script in `package.json`:
```bash
docker run --rm -v "$PWD":"$PWD" -w "$PWD" ligolang/ligo:0.15.0
```
See https://ligolang.org/docs/intro/installation/ for more information on installing LIGO and https://docs.docker.com/engine/install/ for installing Docker.
## Dependencies
Install `yarn` as the package manager,
 ```bash
 $ npm install -g yarn
 ```
and install project dependencies by running
 ```bash
 $ yarn install
 ```
## Environments
### Test network
You can either use the `faucet.json` file included in the repository or create a new test account with https://faucet.tzalpha.net/. There is a list of available RPC nodes at https://tezostaquito.io/docs/rpc_nodes.
### Local sandbox
To run a local sandbox for local development and testing:
```bash
$ yarn start-sandbox
```
Note that the local sandbox (`ganache-cli@tezos`) requires Docker to run.
### Environment variables
Create an `.env` file at the root of the project to set the name of the contract, URL for the RPC node, and the number of confirmation blocks. For example, the `.env` file to test against Edonet as follows:
```bash
CONTRACT=EvenSimpler.michelson
RPC=https://api.tez.ie/rpc/edonet
CONFIRMATION=3
```
To deploy to Mainnet, a secret key for an account should be set by adding the following line:
```bash
KEY=<your_secret_key_that_starts_with_edsk>
```
## Usage
```bash
$ yarn run help
```
```bash
yarn run v1.22.10
$ node ./src/main.js --help
main.js [command]

Commands:
  main.js originate  Originate smart contract.
  main.js record     Record checksum to a smart contract.
  main.js verify     Verify the checksum of a file.

Options:
      --version          Show version number                           [boolean]
  -u, --url              Tezos RPC node
                             [string] [default: "https://api.tez.ie/rpc/edonet"]
  -f, --faucet_key_file  Path to a faucet key JSON file       [string] [default:
                   "/home/ec2-user2/workspace/data-integrity-tezos/faucet.json"]
  -s, --secret_key       Secret key.                                    [string]
  -a, --algorithm        Algorithm used to generate hash digests.
                                                    [string] [default: "sha256"]
  -h, --help             Show help                                     [boolean]
Done in 0.35s.
```
### Originate
```bash
$ yarn originate [-p path_to_file]
```
```bash
yarn run v1.22.10
$ node ./src/main.js originate
Originating contract at /home/ec2-user2/workspace/data-integrity-tezos/build/EvenSimpler.michelson...
Waiting for confirmation of origination for KT1Myej55KpN56bu6EmtRZbPJYEnBEzppK4Q
Origination completed.
Done in 13.16s.
```
### Record
```bash
$ yarn record -c <contract_address> -p <path_to_file>
```
```bash
yarn run v1.22.10
$ node ./src/main.js record -c KT1Myej55KpN56bu6EmtRZbPJYEnBEzppK4Q -p ./package.json
Recording 07ef68236147ce513dec19a3f7dd2bde41cc3d5b11a84fd855da78064162822e -> 52cbef0bfbfdb83732a292297ec179f7c9771166075f7e4e502c2f1a142e10ba to KT1Myej55KpN56bu6EmtRZbPJYEnBEzppK4Q
Awaiting 3 blocks for ooSgTbhT9tuVZtK3EdyJbXb7uXRrdEZnnAnaRbWzYQo2QremVWy to be confirmed...
Operation injected: https://api.tez.ie/rpc/edonet/ooSgTbhT9tuVZtK3EdyJbXb7uXRrdEZnnAnaRbWzYQo2QremVWy
Done in 115.98s.
```
### Verify
```bash
$ yarn verify -c <contract_address> -p <path_to_file>
```
```bash
Verifying 07ef68236147ce513dec19a3f7dd2bde41cc3d5b11a84fd855da78064162822e -> 52cbef0bfbfdb83732a292297ec179f7c9771166075f7e4e502c2f1a142e10ba against contract at KT1Myej55KpN56bu6EmtRZbPJYEnBEzppK4Q
Verification result: true
Done in 5.10s.
```
The verification result is logged to a csv file corresponding to the contract address: in the above example, the result is logged to `logs/KT1Myej55KpN56bu6EmtRZbPJYEnBEzppK4Q.csv`.
