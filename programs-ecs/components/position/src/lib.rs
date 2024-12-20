use bolt_lang::*;

declare_id!("9CgPjx11JvDGFW2E4NLVRq2bP9PKVaX6uwpznEToucqE");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}