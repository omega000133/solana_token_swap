use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    system_instruction,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program::invoke_signed,
    pubkey::Pubkey,
};
use crate::instruction::SwapInstruction;
use crate::error::SampleError;

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Swap Token Rust program entrypoint");

    let instruction = SwapInstruction::unpack(_instruction_data)?;
    match instruction {
        SwapInstruction::SolToToken { amount } => {
            msg!("Swap SOL to token, amount = {}", amount);
            transfer_sol(program_id, accounts, amount, true);
            transfer_token(program_id, accounts, amount * 10, true); // 1 SOL = 10 Token
        }
        SwapInstruction::TokenToSol { amount } => {
            msg!("Swap token to SOL, amount = {}", amount);
            transfer_sol(program_id, accounts, amount / 10, false); // 10 Token = 1 SOL
            transfer_token(program_id, accounts, amount, false);
        }
    }

    Ok(())
}

fn transfer_sol(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    transfer_amount: u64,
    is_sol_to_token: bool
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let from_account: &AccountInfo;
    let to_account: &AccountInfo;

    if is_sol_to_token == true {
        from_account = next_account_info(accounts_iter)?;
        to_account = next_account_info(accounts_iter)?;
    } else {
        to_account = next_account_info(accounts_iter)?;
        from_account = next_account_info(accounts_iter)?;
    }

    let mint = next_account_info(accounts_iter)?;

    // Instruction
    let instruction = &system_instruction::transfer(&from_account.key, &to_account.key, transfer_amount);
    // Account list
    let account_list = &[from_account.clone(), to_account.clone()];

    if is_sol_to_token == true {
        invoke(instruction, account_list)?;
    } else {
        let (store_pda, store_seed) = Pubkey::find_program_address(&[b"store", mint.key.as_ref()], program_id);
        invoke_signed(instruction, account_list, &[&[b"store", mint.key.as_ref(), &[store_seed]]])?;
    }

    Ok(())
}

fn transfer_token(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    transfer_amount: u64,
    is_sol_to_token: bool,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let from_token_account: &AccountInfo;
    let to_token_account: &AccountInfo;
    let signer_account: &AccountInfo;

    let from_account = next_account_info(accounts_iter)?;
    let to_account = next_account_info(accounts_iter)?;
    let mint = next_account_info(accounts_iter)?;
    if is_sol_to_token == true {
        to_token_account = next_account_info(accounts_iter)?;
        from_token_account = next_account_info(accounts_iter)?;
        signer_account = to_account;
    } else {
        from_token_account = next_account_info(accounts_iter)?;
        to_token_account = next_account_info(accounts_iter)?;
        signer_account = from_account;
    }
    let token_program = next_account_info(accounts_iter)?;

    // Instruction
    let instruction = &spl_token::instruction::transfer(
        &token_program.key,
        &from_token_account.key,
        &to_token_account.key,
        &signer_account.key,
        &[],
        transfer_amount,
    )?;

    // Account list
    let account_list = &[
        token_program.clone(),
        from_token_account.clone(),
        to_token_account.clone(),
        signer_account.clone(),
    ];

    if is_sol_to_token == false {
        invoke(instruction, account_list)?;
    } else {
        let (store_pda, store_seed) = Pubkey::find_program_address(&[b"store", mint.key.as_ref()], program_id);
        invoke_signed(instruction, account_list, &[&[b"store", mint.key.as_ref(), &[store_seed]]])?;
    }

    Ok(())
}
