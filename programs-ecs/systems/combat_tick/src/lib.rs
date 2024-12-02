use bolt_lang::*;
use speed::Speed;
use readyness::Readyness;
use name::Name;

declare_id!("HyEV1NvAifHHcUjUvWEEiHwHDNEv72zzoc5JSdz3LTQv");

#[system]
pub mod combat_tick {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let speed = &mut ctx.accounts.speed;
        let readyness = &mut ctx.accounts.readyness;

        readyness.tick(speed.amount);

        if readyness.is_ready() {
            msg!("{} is ready to strike!", ctx.accounts.name.value);
        }
        else {
            msg!("{} is preparing for combat...", ctx.accounts.name.value);
        }

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub speed: Speed,
        pub readyness: Readyness,
        pub name: Name,
    }

}