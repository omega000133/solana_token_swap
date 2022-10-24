use {
    crate::error::SampleError,
    borsh::BorshDeserialize,
    solana_program::program_error::ProgramError,
};

/// Swap instruction
pub enum SwapInstruction {
    SolToToken { amount: u64 },
    TokenToSol { amount: u64 },
}

/// Generic Payload Deserialization
#[derive(BorshDeserialize)]
struct Payload {
    variant: u8,
    arg1: u64,
}

impl SwapInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let payload = Payload::try_from_slice(input).unwrap();
        match payload.variant {
            0 => Ok(Self::SolToToken {
                amount: payload.arg1,
            }),
            1 => Ok(Self::TokenToSol {
                amount: payload.arg1
            }),
            _ => Err(SampleError::DeserializationFailure.into()),
        }
    }
}