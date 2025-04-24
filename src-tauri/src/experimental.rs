use tauri::{AppHandle, Manager, State};

use rust_translate::{translate, translate_from_english};
use rust_translate::supported_languages::get_languages;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub async fn translate_text(text: String, target_language: String) -> String {
    let translated_text = translate_from_english(text.as_str(), target_language.as_str()).await.unwrap();
   return translated_text;
}

