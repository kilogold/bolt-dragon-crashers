use bolt_lang::*;
use readyness::Readyness;
use name::Name;
declare_id!("ETKsaGsmpG5Sm7MnnYEgTTosZCcnZmDmqUvtNg4gEMeC");

#[system]
pub mod combat_action {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let readyness = &mut ctx.accounts.readyness;

        let name = &ctx.accounts.name;
        if readyness.is_ready() {
            readyness.reset();
            msg!("{} is ready to attack", name.value);
        }

        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub readyness: Readyness,
        pub name: Name,
    }

}