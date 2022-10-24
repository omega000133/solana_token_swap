/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

import {
  Account,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import fs from 'mz/fs';
import path from 'path';
import * as borsh from 'borsh';

import {getPayer, getRpcUrl, createKeypairFromFile, SwapInstruction, PayloadSchema, Payload} from './utils';

/**
 * Connection to the network
 */
let connection: Connection;

/**
 * Keypair associated to the fees' payer
 */
export let payer: Keypair;
export let payerAta: PublicKey;
export let mint: PublicKey;
export let store: PublicKey;
export let storeAta: PublicKey;

/**
 * Program id
 */
let programId: PublicKey;

/**
 * Path to program files
 */
const PROGRAM_PATH = path.resolve(__dirname, '../../dist/program');

/**
 * Path to program shared object file which should be deployed on chain.
 * This file is created when running either:
 *   - `npm run build:program-c`
 *   - `npm run build:program-rust`
 */
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'solana_test.so');

/**
 * Path to the keypair of the deployed program.
 * This file is created when running `solana program deploy dist/program/solana_test.so`
 */
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'solana_test-keypair.json');

/**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<void> {
  const rpcUrl = await getRpcUrl();
  connection = new Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);
}

/**
 * Establish an account to pay for everything
 */
export async function establishPayer(): Promise<void> {
  if (!payer) {
    payer = await getPayer();
  }

  let lamports = await connection.getBalance(payer.publicKey);

  console.log(
    'Using account',
    payer.publicKey.toBase58(),
    'containing',
    lamports / LAMPORTS_PER_SOL,
    'SOL to pay for fees',
  );
}

/**
 * Check if the solana_test BPF program has been deployed
 */
export async function checkProgram(): Promise<void> {
  // Read program id from keypair file
  try {
    const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
    programId = programKeypair.publicKey;
  } catch (err) {
    const errMsg = (err as Error).message;
    throw new Error(
      `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/solana_test.so\``,
    );
  }

  // Check if the program has been deployed
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    if (fs.existsSync(PROGRAM_SO_PATH)) {
      throw new Error(
        'Program needs to be deployed with `solana program deploy dist/program/solana_test.so`',
      );
    } else {
      throw new Error('Program needs to be built and deployed');
    }
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);
}

export async function createStoreAccount(): Promise<void> {
  // Mint
  mint = new PublicKey("FnzDLQPD8TcE9DmdHnPbDow76ys3HkHeufvrYTF6ijGR");
  console.log("mint = ", mint.toBase58());

  // Payer Associated Token Account
  payerAta = (await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey,
    true
  )).address;
  console.log("payerAta = ", payerAta.toBase58());

  // Store
  const [storeAddress] = await PublicKey.findProgramAddress(
    [Buffer.from("store"), mint.toBuffer()],
    programId
  );
  store = storeAddress;
  console.log("store = ", store.toBase58());

  // Store Associated Token Account
  storeAta = (await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    store,
    true
  )).address;
  console.log("storeAta = ", storeAta.toBase58());

  // Mint to Store 10,000 Token at the beginning
  // let res = await mintTo(
  //   connection,
  //   payer,
  //   mint,
  //   storeAta,
  //   payer,
  //   1000 * LAMPORTS_PER_SOL
  // );
  // console.log("res = ", res);
}

/**
 * Swap Token
 */
export async function swapToken(type: SwapInstruction, sending_amount: number): Promise<string> {

  const payload = new Payload({
    id: type,
    amount: sending_amount * LAMPORTS_PER_SOL,
  });

  const payloadSerBuf = Buffer.from(borsh.serialize(PayloadSchema, payload));

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: true },
      { pubkey: store, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: payerAta, isSigner: false, isWritable: true },
      { pubkey: storeAta, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data: payloadSerBuf,
  });

  return await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer],
  );
}

/**
 * Report balances
 */
export async function reportBalances(): Promise<void> {
  // Payer
  console.log("Payer balance = ",  await get_balance(payer.publicKey));

  console.log("Payer Token balance = ", await get_token(payerAta));

  // Store
  console.log("Store balance = ",  await get_balance(store));
  console.log("Store Token balance = ", await get_token(storeAta));

  // Mint = FnzDLQPD8TcE9DmdHnPbDow76ys3HkHeufvrYTF6ijGR
}

export async function get_balance(pubkey: PublicKey) {
  return await connection.getBalance(pubkey) / LAMPORTS_PER_SOL;
}

export async function get_token(pubkey: PublicKey) {
  const web3 = require("@solana/web3.js");
  let res: any;
  await (async () => {
    const solana = new web3.Connection("https://api.devnet.solana.com");
    res = await solana.getTokenAccountBalance(pubkey);
  })();

  return res.value.uiAmount;
}
