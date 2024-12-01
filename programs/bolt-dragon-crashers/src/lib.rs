use anchor_lang::prelude::*;

declare_id!("7SEoX1p2qzA3RwJfWDy5Qbr5eUaX7WHiiQS8gQrhwGgJ");

#[program]
pub mod bolt_dragon_crashers {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
