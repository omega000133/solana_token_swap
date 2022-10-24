import { start_server } from './server';
import {
  establishConnection,
  establishPayer,
  checkProgram,
  swapToken,
  reportBalances,
  createStoreAccount,
} from './solana_test';
import { SwapInstruction } from './utils';

async function main() {

  // Establish connection to the cluster
  await establishConnection();

  // Determine who pays for the fees
  await establishPayer();

  // Check if the program has been deployed
  await checkProgram();

  // Create Store account
  await createStoreAccount();
  await reportBalances();

  // // Swap Token
  // await swapToken(SwapInstruction.TokenToSol, 100);

  // // Find out how many times that account has been greeted
  // await reportBalances();

  console.log('Success');
}

main().then(
  () => {
    start_server();
  },
  err => {
    console.error(err);
    process.exit(-1);
  },
);
