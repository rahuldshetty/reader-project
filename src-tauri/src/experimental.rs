use rust_translate::translate_from_english;

#[tauri::command]
pub async fn translate_text(text: String, target_language: String) -> String {
    let translated_text = translate_from_english(text.as_str(), target_language.as_str())
        .await
        .unwrap();
    return translated_text;
}
