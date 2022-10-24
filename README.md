# solana_token_swap
Rust smart contract to swap token on Solana network

# Live web app
A live version is running at: http://54.169.119.246:8080/ <br />
I uploaded it to AWS so you can check it without building a local version <br /> <br />
Contract address: https://explorer.solana.com/address/229mbZhzUCmCV5u7FF7nGPXNvTCgN3Avd4qAvE9GtrV4?cluster=devnet <br />
Token address: https://explorer.solana.com/address/FnzDLQPD8TcE9DmdHnPbDow76ys3HkHeufvrYTF6ijGR?cluster=devnet  <br />

<img width="1271" alt="image" src="https://user-images.githubusercontent.com/24490864/197517977-f754cb97-1acd-4262-a0d1-0e987f2e8846.png">

# Smart Contract Address

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

# Note
Have done with:  <br />
- Swap 1 Sol for 10 Tokens from Program's PDA (Rust) <br />
- Swap 10 Tokens for 1 Sol from Program's PDA (Rust) <br />
- Web3 script to interact with Program (Typescript) <br />
- Web application for UI checking (Html, Javascript) <br />
Not yet finish: <br />
- Unit testing (don't have enough for reseaching Unit test, but it doesn't matter since the Program already worked successfully !)
