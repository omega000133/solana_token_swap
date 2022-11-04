# solana_token_swap
Rust smart contract to swap token on Solana network

# Smart Contract Address
Contract address: https://explorer.solana.com/address/229mbZhzUCmCV5u7FF7nGPXNvTCgN3Avd4qAvE9GtrV4?cluster=devnet <br />
Token address: https://explorer.solana.com/address/FnzDLQPD8TcE9DmdHnPbDow76ys3HkHeufvrYTF6ijGR?cluster=devnet  <br />

# Local web app
If you want to build a local version, pls prepare **NodeJs** version >= 14: https://nodejs.org/en/ <br />
Go to project and run this command to install dependencies packages
```
npm install
```
Then run this command to start the app
```
npm run start
```
The app will be available at: http://localhost:8080

# Done
- Create new Token on Solana Devnet
- Swap 1 Sol for 10 Tokens with Contract Program's PDA (Rust) <br />
- Swap 10 Tokens for 1 Sol with Contract Program's PDA (Rust) <br />
- Web3 script to interact with Contract Program (Typescript) <br />
- Web application for UI checking (Html, Javascript) <br />
# Not yet finish
- Unit testing (need more time for reseaching Unit test, but it doesn't matter since the Program already worked successfully !)
