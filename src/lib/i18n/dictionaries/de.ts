import type { TranslationKey } from "./en";

const de: Record<TranslationKey, string> = {
    "app.name": "Reader-Project",
    "app.version": "v{version}",

    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.close": "Schließen",
    "common.minimize": "Minimieren",
    "common.maximize": "Maximieren",
    "common.search": "Suchen",
    "common.update": "Aktualisieren",
    "common.create": "Erstellen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.import": "Importieren",
    "common.refresh": "Neu laden",
    "common.mark_read": "Als gelesen markieren",
    "common.not_found": "Nicht gefunden",

    "nav.feeds": "Feeds",
    "nav.browse": "Durchsuchen",
    "nav.settings": "Einstellungen",
    "nav.add": "Hinzufügen",
    "nav.about": "Über",
    "nav.collapse": "Einklappen",
    "nav.posts": "Beiträge",
    "nav.all_posts": "Alle Beiträge",
    "nav.my_favourites": "Meine Favoriten",

    "feed.new_folder": "Neuen Ordner erstellen",
    "feed.refresh": "Feed aktualisieren",
    "feed.refreshing": "Feed wird aktualisiert...",

    "posts.refreshing": "Beiträge werden aktualisiert...",
    "posts.filter_unread": "Ungelesene filtern",
    "posts.comfortable_view": "Komfortable Ansicht",
    "posts.compact_view": "Kompakte Ansicht",
    "posts.sort_by": "Sortieren nach",
    "posts.latest_first": "Neueste zuerst",
    "posts.oldest_first": "Älteste zuerst",

    "content.select_article": "Wählen Sie einen Artikel zum Lesen",
    "content.unable_to_parse":
        "Seite kann nicht analysiert werden. Bitte greifen Sie direkt auf die Website zu.",
    "content.ai_summary": "KI-generierte Zusammenfassung",
    "content.min_read": "{n} Min. Lesezeit",
    "content.previous_article": "Vorheriger Artikel",
    "content.next_article": "Nächster Artikel",
    "content.copy_link": "Link in die Zwischenablage kopieren",
    "content.mark_as_read": "Als gelesen markieren",
    "content.mark_favorite": "Als Favorit markieren",
    "content.open_in_browser": "Im Browser öffnen",

    "browse.title": "Durchsuchen",
    "browse.last_weeks": "Letzte {n} Wochen",
    "browse.everything": "Das ist alles aus den letzten {n} Wochen",
    "browse.no_articles": "Keine Artikel in den letzten {n} Wochen",
    "browse.read": "Lesen",
    "browse.article": "Artikel",

    "settings.title": "Einstellungen",
    "settings.tab.general": "Allgemein",
    "settings.tab.feeds": "Feeds",
    "settings.tab.storage": "Speicher",
    "settings.tab.llm": "LLM",
    "settings.tab.fonts": "Schriftarten",
    "settings.tab.shortcuts": "Tastenkürzel",

    "settings.language": "Sprache",
    "settings.language.hint":
        "Wählen Sie die Sprache der Anwendungsoberfläche.",
    "settings.theme": "Design",
    "settings.theme.hint": "Wählen Sie Ihr bevorzugtes Design.",
    "settings.choose_theme": "Design wählen",
    "settings.close_button": "Schließen-Schaltfläche",
    "settings.close_button.hint":
        "Beim Klicken auf die Schließen-Schaltfläche die App in die Taskleiste minimieren.",
    "settings.auto_refresh": "Auto-Aktualisierung",
    "settings.auto_refresh.hint":
        "Alle Feeds beim Start aktualisieren (erhöht die Wartezeit beim Start)",
    "settings.export_opml": "OPML exportieren",
    "settings.export_opml.hint":
        "Exportieren und speichern Sie Ihre Feeds als OPML.",

    "settings.refresh_feed": "Feed aktualisieren",
    "settings.refresh_feed.hint":
        "Neueste Beiträge automatisch abrufen, wenn ein abgelaufener Feed ausgewählt wird.",
    "settings.last_refresh_time": "Letzte Aktualisierungszeit (Stunden)",
    "settings.last_refresh_time.hint":
        "Ablaufzeit vor dem Aktualisieren neuer Beiträge.",
    "settings.auto_read": "Auto-Gelesen",
    "settings.auto_read.hint":
        "Das Auswählen eines Beitrags markiert ihn automatisch als gelesen.",
    "settings.insecure_mode": "Unsicherer Modus",
    "settings.insecure_mode.hint":
        "Diesen Modus aktivieren, um Feeds von ungesicherten HTTP-URLs abzurufen.",

    "settings.auto_purge": "Automatische Bereinigung",
    "settings.auto_purge.hint":
        "Ältere Beiträge automatisch löschen (keine Favoriten & Feeds mit mehr als 100 Beiträgen).",
    "settings.post_duration": "Beitragsdauer",
    "settings.post_duration.hint":
        "Anzahl der Tage, die ein Beitrag gespeichert bleibt.",

    "settings.enable_llm": "LLM aktivieren",
    "settings.enable_llm.hint":
        "Inhaltszusammenfassung über den LLM-Dienst ausführen (OpenAI-kompatibel).",
    "settings.base_url": "Basis-URL",
    "settings.base_url.hint": "OpenAI-Basis-URL",
    "settings.model": "Modell",
    "settings.model.hint": "OpenAI-Modellname",
    "settings.token": "Token",
    "settings.token.hint": "OpenAI-Zugriffsschlüssel",

    "settings.font_family": "Schriftfamilie",
    "settings.font_family.hint":
        "Wählen Sie die Schriftart für den gesamten Text der App.",
    "settings.font_size": "Schriftgröße",
    "settings.font_size.hint":
        "Grundschriftgröße für den gesamten Text (in Pixeln).",
    "settings.line_height": "Zeilenhöhe",
    "settings.line_height.hint": "Abstand zwischen Textzeilen.",
    "settings.letter_spacing": "Zeichenabstand",
    "settings.letter_spacing.hint": "Abstand zwischen Zeichen (in Pixeln).",
    "settings.paragraph_gap": "Absatzabstand",
    "settings.paragraph_gap.hint": "Abstand zwischen Absätzen (in Pixeln).",

    "settings.enable_shortcuts": "Tastenkürzel aktivieren",
    "settings.enable_shortcuts.hint":
        "Navigieren Sie mit der Tastatur durch die App. Standardmäßig deaktiviert.",
    "settings.reset_defaults": "Auf Standard zurücksetzen",
    "settings.press_keys": "Tasten drücken… (Esc zum Abbrechen)",
    "settings.conflicting_shortcuts": "Konfliktbehaftete Tastenkürzel:",
    "settings.reassign_or_reset":
        "Vor dem Speichern neu zuweisen oder zurücksetzen.",

    "shortcut.next_post": "Nächster Beitrag",
    "shortcut.next_post.desc":
        "Zum nächsten Beitrag in der Liste wechseln. Öffnet beim Lesen den nächsten Beitrag.",
    "shortcut.prev_post": "Vorheriger Beitrag",
    "shortcut.prev_post.desc":
        "Zum vorherigen Beitrag in der Liste wechseln. Öffnet beim Lesen den vorherigen Beitrag.",
    "shortcut.open_post": "Beitrag öffnen",
    "shortcut.open_post.desc": "Den hervorgehobenen Beitrag öffnen.",
    "shortcut.mark_read": "Gelesen / ungelesen markieren",
    "shortcut.mark_read.desc":
        "Lesestatus des hervorgehobenen oder geöffneten Beitrags umschalten.",
    "shortcut.mark_fav": "Als Favorit markieren",
    "shortcut.mark_fav.desc":
        "Favoritenstatus des hervorgehobenen oder geöffneten Beitrags umschalten.",
    "shortcut.open_original": "Original öffnen",
    "shortcut.open_original.desc":
        "Beitragslink im Standardbrowser öffnen.",
    "shortcut.focus_search": "Suche fokussieren",
    "shortcut.focus_search.desc": "Zum Feed-Suchfeld springen.",
    "shortcut.next_feed": "Nächster Feed",
    "shortcut.next_feed.desc":
        "Zum nächsten Feed in der Liste wechseln und ihn auswählen.",
    "shortcut.prev_feed": "Vorheriger Feed",
    "shortcut.prev_feed.desc":
        "Zum vorherigen Feed in der Liste wechseln und ihn auswählen.",

    "modal.add_feed": "Feed hinzufügen",
    "modal.url": "URL",
    "modal.enter_feed_url": "RSS- oder Atom-Feed-URL eingeben",
    "modal.skip_data_fetch": "Datenabruf überspringen",
    "modal.skip_data_fetch.hint":
        "Diese Option überspringt das Laden des Feeds.",
    "modal.upload_opml": "OPML hochladen",
    "modal.scan_url": "URL scannen",
    "modal.select_feeds": "Wählen Sie die zu importierenden Feeds aus.",
    "modal.select_all": "Alle auswählen",

    "modal.edit_feed": "Feed bearbeiten",
    "modal.edit_folder": "Ordner bearbeiten",
    "modal.title": "Titel",
    "modal.folder": "Ordner",
    "modal.pick_folder": "Ordner auswählen",
    "modal.load_refresh": "Beim Laden aktualisieren",
    "modal.load_refresh.hint":
        "Diese Option aktivieren, um den Feed beim Start der App zu aktualisieren.",
    "modal.total": "Gesamt",
    "modal.posts": "Beiträge",
    "modal.posts_rate": "Beitragsrate",
    "modal.posts_per_day": "Beiträge/Tag",
    "modal.last_refreshed": "Zuletzt aktualisiert",

    "modal.mark_read": "Als gelesen markieren",
    "modal.mark_all_read": "Alle Beiträge in „{name}“ als gelesen markieren?",
    "modal.delete_feed": "Feed löschen",
    "modal.delete_confirm":
        "Sie sind dabei, {name} zu löschen. Möchten Sie wirklich fortfahren?",
    "modal.create_folder": "Ordner erstellen",
    "modal.enter_folder_name": "Ordnernamen eingeben",

    "modal.about.title": "Über Reader-Project",
    "modal.about.app_logo": "App-Logo",
    "modal.about.description":
        "Reader-Project ist ein datenschutzorientierter RSS-Aggregator, erstellt mit Tauri, SvelteKit und Tailwind CSS. Er unterstützt Offline-Speicherung, automatische Feed-Aktualisierung, Inhaltsextraktion, Artikelübersetzung und mehr – alles in einer eleganten, modernen Oberfläche.",
    "modal.about.source_code": "Quellcode",
    "modal.about.license": "Lizenz (MIT)",

    "toast.feed_url_insecure":
        "Feed-URL unsicher. Aktivieren Sie den unsicheren Modus, um Daten von unsicheren URLs abzurufen.",
    "toast.unable_to_fetch": "Feed konnte nicht abgerufen werden :(",
    "toast.folder_created": "Ordner erstellt",
    "toast.folder_create_failed":
        "Ordner konnte nicht erstellt werden. Stellen Sie sicher, dass der Ordner nicht bereits existiert.",
    "toast.edit_saved": "Bearbeitung gespeichert.",
    "toast.edit_failed": "Bearbeitungsvorgang fehlgeschlagen.",
    "toast.feed_saved": "Feed erfolgreich gespeichert.",
    "toast.invalid_file_path": "Bitte geben Sie einen gültigen Dateipfad an.",
    "toast.conflicting_shortcuts":
        "Tastenkürzel im Konflikt. Vor dem Speichern neu zuweisen oder zurücksetzen.",
    "toast.copied_link": "Link in die Zwischenablage kopiert",
    "toast.copied_text": "Text in die Zwischenablage kopiert",

    "time.seconds_ago": "vor {n} Sekunden",
    "time.minutes_ago": "vor {n} Minuten",
    "time.hours_ago": "vor {n} Stunden",
    "time.days_ago": "vor {n} Tagen",
    "time.weeks_ago": "vor {n} Wochen",
    "time.months_ago": "vor {n} Monaten",
    "time.years_ago": "vor {n} Jahren",
    "time.today": "Heute",
    "time.yesterday": "Gestern",
    "time.this_week": "Diese Woche",
    "time.older": "Älter",

    "loading.logo_alt": "Reader Project",
    "loading.quote":
        "„Ein Leser lebt tausend Leben, bevor er stirbt. Der Mann, der nie liest, lebt nur eines.“",
    "loading.quote_author": "- George R.R. Martin",
};

export default de;
