use bolt_lang::*;

declare_id!("7mzf8mMVJ8j2scTrhtkvpvazJB9usdfgUj1jLjNKDaQU");

#[component]
#[derive(Default)]
pub struct Name {
    #[max_len(20)]
    pub value: String,
}