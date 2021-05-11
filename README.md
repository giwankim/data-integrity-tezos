# data-integrity-tezos
Data integrity on Tezos
## Installation
### Node Version Manager (NVM)
To install `nvm`:
```bash
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
Running the above command downloads a a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
Then, run one of the commands below for different shells on the command line:  
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
To install the static Linux binary that runs on most Linux distributions running on x86 architecture:
```bash
$ wget https://ligolang.org/bin/linux/ligo
$ chmod +x ./ligo
$ sudo cp ./ligo /usr/local/bin
```
Note that it is also possible to use a Dockerized container to compile:
```bash
$ docker run --rm -v "$PWD":"$PWD" -w "$PWD" ligolang/ligo:0.15.0
```
Please see https://ligolang.org/docs/intro/installation/ for further instructions on installing LIGO.

## Dependencies
Install `yarn` as the package manager:
 ```bash
 $ npm install -g yarn
 ```
 To install dependencies:
 ```bash
 $ yarn install
 ```
## Environments
### Test network
You can either use `faucet.json` included in the repository or create an account with https://faucet.tzalpha.net/. Then use nodes like https://api.tez.ie/rpc/edonet.
### Local sandbox
To run a local sandbox for development and testing using Tezos-flavored `ganache-cli`:
```bash
$ yarn start-sandbox
```
### Environment variables
You should create an `.env` file at the project root that sets the name of the contract, URL for the Tezos RPC node, location of the faucet key file, and number of confirmation blocks. For example,
```bash
CONTRACT=EvenSimpler.michelson
RPC=https://api.tez.ie/rpc/edonet
FAUCET_KEY=/home/ec2-user2/workspace/data-integrity-tezos/faucet.json
CONFIRMATION=3
```
is the content of the `.env` file used during development.
## Usage
```bash
$ yarn run help

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
  -f, --faucet_key_file  Path to a faucet key JSON file
                                            [string] [default: "../faucet.json"]
  -s, --secret_key       Secret key.                                    [string]
  -h, --help             Show help                                     [boolean]
Done in 0.54s.
```
### Originate
```bash
$ yarn orginate

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

Verifying 07ef68236147ce513dec19a3f7dd2bde41cc3d5b11a84fd855da78064162822e -> 52cbef0bfbfdb83732a292297ec179f7c9771166075f7e4e502c2f1a142e10ba against contract at KT1Myej55KpN56bu6EmtRZbPJYEnBEzppK4Q
true
Done in 5.10s.
```
