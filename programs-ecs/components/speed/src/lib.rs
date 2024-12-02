use bolt_lang::*;

declare_id!("3ZvC3WF9r5kj3nW2rSbYBwkkxTn47R7EnAbWH29xJBr5");

#[component]
#[derive(Default)]
pub struct Speed {
    pub amount: u64,
}