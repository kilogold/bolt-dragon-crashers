use bolt_lang::*;

declare_id!("2R2rw36VaaBYtu9xdKq7Voxg8J2L9ZhJV5Fi1yHJqBSH");

#[component]
#[derive(Default)]
pub struct Readyness {
    pub counter: u64,
}

impl Readyness {
    pub const MAX_COUNTER: u64 = 12;

    pub fn reset(&mut self) {
        self.counter = Self::MAX_COUNTER;
    }

    pub fn tick(&mut self, amount: u64) {
        self.counter = self.counter.saturating_sub(amount);
    }

    pub fn is_ready(&self) -> bool {
        self.counter == 0
    }
}