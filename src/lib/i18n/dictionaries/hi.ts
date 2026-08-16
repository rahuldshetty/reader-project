import type { TranslationKey } from "./en";

const hi: Record<TranslationKey, string> = {
    "app.name": "Reader-Project",
    "app.version": "v{version}",

    "common.cancel": "रद्द करें",
    "common.save": "सहेजें",
    "common.close": "बंद करें",
    "common.minimize": "छोटा करें",
    "common.maximize": "बड़ा करें",
    "common.search": "खोजें",
    "common.update": "अपडेट करें",
    "common.create": "बनाएँ",
    "common.delete": "हटाएँ",
    "common.edit": "संपादित करें",
    "common.import": "आयात करें",
    "common.refresh": "रीफ़्रेश करें",
    "common.mark_read": "पढ़ा हुआ चिह्नित करें",
    "common.not_found": "नहीं मिला",

    "nav.feeds": "फ़ीड्स",
    "nav.browse": "ब्राउज़ करें",
    "nav.settings": "सेटिंग्स",
    "nav.add": "जोड़ें",
    "nav.about": "परिचय",
    "nav.collapse": "समेटें",
    "nav.posts": "लेख",
    "nav.all_posts": "सभी लेख",
    "nav.my_favourites": "मेरे पसंदीदा",

    "feed.new_folder": "नया फ़ोल्डर बनाएँ",
    "feed.refresh": "फ़ीड रीफ़्रेश करें",
    "feed.refreshing": "फ़ीड रीफ़्रेश हो रहा है...",

    "posts.refreshing": "लेख रीफ़्रेश हो रहे हैं...",
    "posts.filter_unread": "अपठित फ़िल्टर करें",
    "posts.comfortable_view": "आरामदायक दृश्य",
    "posts.compact_view": "कॉम्पैक्ट दृश्य",
    "posts.sort_by": "इसके अनुसार क्रमबद्ध करें",
    "posts.latest_first": "नवीनतम पहले",
    "posts.oldest_first": "सबसे पुराना पहले",

    "content.select_article": "पढ़ने के लिए एक लेख चुनें",
    "content.unable_to_parse":
        "पृष्ठ को पार्स नहीं किया जा सका। कृपया साइट पर सीधे जाएँ।",
    "content.ai_summary": "AI जनित सारांश",
    "content.min_read": "{n} मिनट का पाठ",
    "content.previous_article": "पिछला लेख",
    "content.next_article": "अगला लेख",
    "content.copy_link": "क्लिपबोर्ड पर लिंक कॉपी करें",
    "content.mark_as_read": "पढ़ा हुआ चिह्नित करें",
    "content.mark_favorite": "पसंदीदा चिह्नित करें",
    "content.open_in_browser": "ब्राउज़र में खोलें",

    "browse.title": "ब्राउज़ करें",
    "browse.last_weeks": "पिछले {n} सप्ताह",
    "browse.everything": "पिछले {n} सप्ताहों से यही सब कुछ है",
    "browse.no_articles": "पिछले {n} सप्ताहों में कोई लेख नहीं",
    "browse.read": "पढ़ें",
    "browse.article": "लेख",

    "settings.title": "सेटिंग्स",
    "settings.tab.general": "सामान्य",
    "settings.tab.feeds": "फ़ीड्स",
    "settings.tab.storage": "भंडारण",
    "settings.tab.llm": "LLM",
    "settings.tab.fonts": "फ़ॉन्ट",
    "settings.tab.shortcuts": "शॉर्टकट",

    "settings.language": "भाषा",
    "settings.language.hint": "ऐप इंटरफ़ेस के लिए भाषा चुनें।",
    "settings.theme": "थीम",
    "settings.theme.hint": "अपनी पसंदीदा थीम चुनें।",
    "settings.choose_theme": "थीम चुनें",
    "settings.close_button": "बंद करें बटन",
    "settings.close_button.hint":
        "बंद करें बटन क्लिक करने पर ऐप को ट्रे में छोटा करें।",
    "settings.auto_refresh": "ऑटो-रीफ़्रेश",
    "settings.auto_refresh.hint":
        "लॉन्च पर सभी फ़ीड रीफ़्रेश करें (लॉन्च पर प्रतीक्षा समय बढ़ता है)",
    "settings.export_opml": "OPML निर्यात करें",
    "settings.export_opml.hint":
        "अपने फ़ीड डेटा को OPML के रूप में निर्यात और सहेजें।",

    "settings.refresh_feed": "फ़ीड रीफ़्रेश करें",
    "settings.refresh_feed.hint":
        "समाप्त फ़ीड चुनने पर नवीनतम लेख स्वतः लाएँ।",
    "settings.last_refresh_time": "अंतिम रीफ़्रेश समय (घंटे)",
    "settings.last_refresh_time.hint":
        "नए लेख रीफ़्रेश करने से पहले की समाप्ति अवधि।",
    "settings.auto_read": "ऑटो-रीड",
    "settings.auto_read.hint":
        "लेख चुनने पर वह स्वतः पढ़ा हुआ चिह्नित हो जाता है।",
    "settings.insecure_mode": "असुरक्षित मोड",
    "settings.insecure_mode.hint":
        "असुरक्षित HTTP URL से फ़ीड लाने के लिए यह मोड सक्षम करें।",

    "settings.auto_purge": "स्वतः सफ़ाई",
    "settings.auto_purge.hint":
        "पुराने लेख स्वतः हटाएँ (गैर-पसंदीदा और 100 से अधिक लेखों वाले फ़ीड)।",
    "settings.post_duration": "लेख अवधि",
    "settings.post_duration.hint": "लेख को बनाए रखने के दिनों की संख्या।",

    "settings.enable_llm": "LLM सक्षम करें",
    "settings.enable_llm.hint":
        "LLM सेवा (OpenAI-संगत) का उपयोग करके सामग्री सारांश चलाएँ।",
    "settings.base_url": "बेस URL",
    "settings.base_url.hint": "OpenAI बेस URL",
    "settings.model": "मॉडल",
    "settings.model.hint": "OpenAI मॉडल नाम",
    "settings.token": "टोकन",
    "settings.token.hint": "OpenAI एक्सेस कुंजी",

    "settings.font_family": "फ़ॉन्ट परिवार",
    "settings.font_family.hint": "ऐप के सभी टेक्स्ट के लिए फ़ॉन्ट चुनें।",
    "settings.font_size": "फ़ॉन्ट आकार",
    "settings.font_size.hint":
        "सभी टेक्स्ट के लिए आधार फ़ॉन्ट आकार (पिक्सेल में)।",
    "settings.line_height": "लाइन ऊँचाई",
    "settings.line_height.hint": "टेक्स्ट की पंक्तियों के बीच की दूरी।",
    "settings.letter_spacing": "अक्षर अंतराल",
    "settings.letter_spacing.hint": "अक्षरों के बीच की दूरी (पिक्सेल में)।",
    "settings.paragraph_gap": "अनुच्छेद अंतराल",
    "settings.paragraph_gap.hint": "अनुच्छेदों के बीच की दूरी (पिक्सेल में)।",

    "settings.enable_shortcuts": "शॉर्टकट सक्षम करें",
    "settings.enable_shortcuts.hint":
        "अपने कीबोर्ड से ऐप नेविगेट करें। डिफ़ॉल्ट रूप से अक्षम।",
    "settings.reset_defaults": "डिफ़ॉल्ट पर रीसेट करें",
    "settings.press_keys": "कुंजियाँ दबाएँ… (रद्द करने के लिए Esc)",
    "settings.conflicting_shortcuts": "विरोधाभासी शॉर्टकट:",
    "settings.reassign_or_reset": "सहेजने से पहले पुनः असाइन या रीसेट करें।",

    "shortcut.next_post": "अगला लेख",
    "shortcut.next_post.desc":
        "सूची में अगले लेख पर जाएँ। पढ़ते समय अगला लेख खोलता है।",
    "shortcut.prev_post": "पिछला लेख",
    "shortcut.prev_post.desc":
        "सूची में पिछले लेख पर जाएँ। पढ़ते समय पिछला लेख खोलता है।",
    "shortcut.open_post": "लेख खोलें",
    "shortcut.open_post.desc": "हाइलाइट किया गया लेख खोलें।",
    "shortcut.mark_read": "पढ़ा / अपठित चिह्नित करें",
    "shortcut.mark_read.desc":
        "हाइलाइट या खुले लेख की पठन स्थिति टॉगल करें।",
    "shortcut.mark_fav": "पसंदीदा चिह्नित करें",
    "shortcut.mark_fav.desc":
        "हाइलाइट या खुले लेख की पसंदीदा स्थिति टॉगल करें।",
    "shortcut.open_original": "मूल खोलें",
    "shortcut.open_original.desc":
        "डिफ़ॉल्ट ब्राउज़र में लेख लिंक खोलें।",
    "shortcut.focus_search": "खोज पर फ़ोकस करें",
    "shortcut.focus_search.desc": "फ़ीड खोज बॉक्स पर जाएँ।",
    "shortcut.next_feed": "अगला फ़ीड",
    "shortcut.next_feed.desc":
        "सूची में अगले फ़ीड पर जाएँ और उसे चुनें।",
    "shortcut.prev_feed": "पिछला फ़ीड",
    "shortcut.prev_feed.desc":
        "सूची में पिछले फ़ीड पर जाएँ और उसे चुनें।",

    "modal.add_feed": "फ़ीड जोड़ें",
    "modal.url": "URL",
    "modal.enter_feed_url": "RSS या Atom फ़ीड URL दर्ज करें",
    "modal.skip_data_fetch": "डेटा फ़ेच छोड़ें",
    "modal.skip_data_fetch.hint":
        "यह विकल्प सक्षम करने पर फ़ीड लोड छोड़ दिया जाएगा।",
    "modal.upload_opml": "OPML अपलोड करें",
    "modal.scan_url": "URL स्कैन करें",
    "modal.select_feeds": "आयात करने के लिए फ़ीड चुनें।",
    "modal.select_all": "सभी चुनें",

    "modal.edit_feed": "फ़ीड संपादित करें",
    "modal.edit_folder": "फ़ोल्डर संपादित करें",
    "modal.title": "शीर्षक",
    "modal.folder": "फ़ोल्डर",
    "modal.pick_folder": "फ़ोल्डर चुनें",
    "modal.load_refresh": "लोड पर रीफ़्रेश करें",
    "modal.load_refresh.hint":
        "ऐप लॉन्च होने पर फ़ीड रीफ़्रेश करने के लिए यह विकल्प सक्षम करें।",
    "modal.total": "कुल",
    "modal.posts": "लेख",
    "modal.posts_rate": "लेख दर",
    "modal.posts_per_day": "लेख/दिन",
    "modal.last_refreshed": "अंतिम रीफ़्रेश",

    "modal.mark_read": "पढ़ा हुआ चिह्नित करें",
    "modal.mark_all_read": "\"{name}\" के सभी लेख पढ़े हुए चिह्नित करें?",
    "modal.delete_feed": "फ़ीड हटाएँ",
    "modal.delete_confirm":
        "आप {name} हटाने वाले हैं। क्या आप जारी रखना चाहते हैं?",
    "modal.create_folder": "फ़ोल्डर बनाएँ",
    "modal.enter_folder_name": "फ़ोल्डर का नाम दर्ज करें",

    "modal.about.title": "Reader-Project के बारे में",
    "modal.about.app_logo": "ऐप लोगो",
    "modal.about.description":
        "Reader-Project एक गोपनीयता-केंद्रित RSS एग्रीगेटर है जो Tauri, SvelteKit और Tailwind CSS से बना है। यह ऑफ़लाइन भंडारण, फ़ीड का स्वतः रीफ़्रेश, सामग्री निष्कर्षण, लेख अनुवाद और बहुत कुछ — सभी एक आधुनिक, सुरुचिपूर्ण UI में समर्थित करता है।",
    "modal.about.source_code": "स्रोत कोड",
    "modal.about.license": "लाइसेंस (MIT)",

    "toast.feed_url_insecure":
        "फ़ीड URL असुरक्षित है। असुरक्षित URL से डेटा लाने के लिए असुरक्षित मोड सक्षम करें।",
    "toast.unable_to_fetch": "फ़ीड लाने में असमर्थ :(",
    "toast.folder_created": "फ़ोल्डर बनाया गया",
    "toast.folder_create_failed":
        "फ़ोल्डर नहीं बनाया जा सका। सुनिश्चित करें कि फ़ोल्डर मौजूद नहीं है।",
    "toast.edit_saved": "संपादन सहेजा गया।",
    "toast.edit_failed": "संपादन कार्रवाई विफल रही।",
    "toast.feed_saved": "फ़ीड सफलतापूर्वक सहेजा गया।",
    "toast.invalid_file_path": "कृपया मान्य फ़ाइल पथ प्रदान करें।",
    "toast.conflicting_shortcuts":
        "विरोधाभासी शॉर्टकट। सहेजने से पहले पुनः असाइन या रीसेट करें।",
    "toast.copied_link": "क्लिपबोर्ड पर लिंक कॉपी किया गया",
    "toast.copied_text": "क्लिपबोर्ड पर टेक्स्ट कॉपी किया गया",

    "time.seconds_ago": "{n} सेकंड पहले",
    "time.minutes_ago": "{n} मिनट पहले",
    "time.hours_ago": "{n} घंटे पहले",
    "time.days_ago": "{n} दिन पहले",
    "time.weeks_ago": "{n} सप्ताह पहले",
    "time.months_ago": "{n} महीने पहले",
    "time.years_ago": "{n} वर्ष पहले",
    "time.today": "आज",
    "time.yesterday": "कल",
    "time.this_week": "इस सप्ताह",
    "time.older": "पुराने",

    "loading.logo_alt": "Reader Project",
    "loading.quote":
        "“पाठक मरने से पहले हज़ार जीवन जीता है। जो कभी नहीं पढ़ता वह केवल एक जीवन जीता है।”",
    "loading.quote_author": "- जॉर्ज आर.आर. मार्टिन",
};

export default hi;
