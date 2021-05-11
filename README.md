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
### Sandbox
### Originate
### Record
### Verify
