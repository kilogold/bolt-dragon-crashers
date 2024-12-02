use bolt_lang::*;

declare_id!("HcSHqsdjd27qnALpigeyAYTP63Ek666ifg4yYDVxSGbs");

#[component]
#[derive(Default)]
pub struct Health {
    pub amount: u64,
}