use bolt_lang::*;
use position::Position;

declare_id!("H3NPkyXoHAvNDX8LXoqbRQ6vW6K3orJn1Hszr2XEmqMy");

#[system]
pub mod movement {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let position = &mut ctx.accounts.position;
        position.x += 1;
        position.y += 1;
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub position: Position,
    }

}