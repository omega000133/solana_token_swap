import {
  establishConnection,
  establishPayer,
  checkProgram,
  swapToken,
  reportBalances,
  createStoreAccount,
} from './solana_test';

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

  // Swap Token
  await swapToken();

  // Find out how many times that account has been greeted
  await reportBalances();

  console.log('Success');
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);
