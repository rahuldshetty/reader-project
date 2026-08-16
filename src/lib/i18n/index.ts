import { derived, get } from "svelte/store";
import { local_user_setting } from "$lib/stores/app_store";
import en, { type TranslationKey } from "./dictionaries/en";
export type { TranslationKey } from "./dictionaries/en";
import es from "./dictionaries/es";
import fr from "./dictionaries/fr";
import de from "./dictionaries/de";
import ar from "./dictionaries/ar";
import ja from "./dictionaries/ja";
import hi from "./dictionaries/hi";

// Native names are intentionally shown in their own language (not translated).
export const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English", tag: "en-US", rtl: false },
    { code: "es", label: "Español", tag: "es", rtl: false },
    { code: "fr", label: "Français", tag: "fr", rtl: false },
    { code: "de", label: "Deutsch", tag: "de", rtl: false },
    { code: "ar", label: "العربية", tag: "ar", rtl: true },
    { code: "ja", label: "日本語", tag: "ja", rtl: false },
    { code: "hi", label: "हिन्दी", tag: "hi", rtl: false },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const dictionaries: Record<LanguageCode, Record<TranslationKey, string>> = {
    en,
    es,
    fr,
    de,
    ar,
    ja,
    hi,
};

export const is_rtl_language = (code: string) =>
    SUPPORTED_LANGUAGES.some((l) => l.code === code && l.rtl);

// Normalize a persisted value to a supported language code.
export const normalize_language = (code: unknown): LanguageCode =>
    SUPPORTED_LANGUAGES.some((l) => l.code === code)
        ? (code as LanguageCode)
        : "en";

export const current_language = derived(local_user_setting, ($s) =>
    normalize_language($s.LANGUAGE),
);

// Reactive translate function for use in markup via `$t(key)`.
export const t = derived(current_language, ($lang) => {
    const dict = dictionaries[$lang] ?? dictionaries.en;
    return (
        key: TranslationKey,
        params?: Record<string, string | number>,
    ): string => {
        const template = dict[key] ?? dictionaries.en[key] ?? key;
        if (!params) return template;
        return template.replace(
            /\{(\w+)\}/g,
            (_, name: string) => String(params[name] ?? ""),
        );
    };
});

// Imperative translate for toasts, services, and other non-reactive call sites.
export const translate = (
    key: TranslationKey,
    params?: Record<string, string | number>,
): string => get(t)(key, params);

// Keep the document language/direction in sync with the active locale.
export const apply_document_language = (code: string) => {
    if (typeof document === "undefined") return;
    const lang = normalize_language(code);
    document.documentElement.lang = lang;
    document.documentElement.dir = is_rtl_language(lang) ? "rtl" : "ltr";
};
