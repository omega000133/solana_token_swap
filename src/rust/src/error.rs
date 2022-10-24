use solana_program::{
    program_error::ProgramError,
};
use thiserror::Error;

#[derive(Error, Debug, Clone, Copy)]
pub enum SampleError {
    #[error("Deserialization Failure")]
    DeserializationFailure,
    #[error("Insufficient Funds For Transaction")]
    InsufficientFundsForTransaction,
    #[error("Invalid Account address.")]
    InvalidAccountAddress,
}

impl From<SampleError> for ProgramError {
    fn from(e: SampleError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
