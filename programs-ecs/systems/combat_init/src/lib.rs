use bolt_lang::*;
use name::Name;
use readyness::Readyness;
use speed::Speed;
use health::Health;

declare_id!("6YjSmdFeVvH4upAPTfQtVRhLv9QMtkKf6HP53hxF3RQp");

#[system]
pub mod combat_init {

    pub fn execute(ctx: Context<Components>, _args_p: String) -> Result<Components> {
        let name = &mut ctx.accounts.name;
        name.value = _args_p;

        let readyness = &mut ctx.accounts.readyness;
        readyness.reset();

        let speed = &mut ctx.accounts.speed;
        speed.amount = 1;

        let health = &mut ctx.accounts.health;
        health.amount = 100;

        msg!("{} is ready to fight!", name.value);

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub name: Name,
        pub readyness: Readyness,
        pub speed: Speed,
        pub health: Health,
    }

}