import type { TranslationKey } from "./en";

const fr: Record<TranslationKey, string> = {
    "app.name": "Reader-Project",
    "app.version": "v{version}",

    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.close": "Fermer",
    "common.minimize": "Réduire",
    "common.maximize": "Agrandir",
    "common.search": "Rechercher",
    "common.update": "Mettre à jour",
    "common.create": "Créer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.import": "Importer",
    "common.refresh": "Actualiser",
    "common.mark_read": "Marquer comme lu",
    "common.not_found": "Introuvable",

    "nav.feeds": "Flux",
    "nav.browse": "Parcourir",
    "nav.settings": "Paramètres",
    "nav.add": "Ajouter",
    "nav.about": "À propos",
    "nav.collapse": "Réduire",
    "nav.posts": "Publications",
    "nav.all_posts": "Toutes les publications",
    "nav.my_favourites": "Mes favoris",

    "feed.new_folder": "Créer un nouveau dossier",
    "feed.refresh": "Actualiser le flux",
    "feed.refreshing": "Actualisation du flux...",

    "posts.refreshing": "Actualisation des publications...",
    "posts.filter_unread": "Filtrer les non lus",
    "posts.comfortable_view": "Vue confortable",
    "posts.compact_view": "Vue compacte",
    "posts.sort_by": "Trier par",
    "posts.latest_first": "Plus récents d'abord",
    "posts.oldest_first": "Plus anciens d'abord",

    "content.select_article": "Sélectionnez un article à lire",
    "content.unable_to_parse":
        "Impossible d'analyser la page. Veuillez accéder directement au site.",
    "content.ai_summary": "Résumé généré par l'IA",
    "content.min_read": "{n} min de lecture",
    "content.previous_article": "Article précédent",
    "content.next_article": "Article suivant",
    "content.copy_link": "Copier le lien dans le presse-papiers",
    "content.mark_as_read": "Marquer comme lu",
    "content.mark_favorite": "Marquer comme favori",
    "content.open_in_browser": "Ouvrir dans le navigateur",

    "browse.title": "Parcourir",
    "browse.last_weeks": "Dernières {n} semaines",
    "browse.everything": "C'est tout ce qu'il y a des {n} dernières semaines",
    "browse.no_articles": "Aucun article au cours des {n} dernières semaines",
    "browse.read": "Lire",
    "browse.article": "Article",

    "settings.title": "Paramètres",
    "settings.tab.general": "Général",
    "settings.tab.feeds": "Flux",
    "settings.tab.storage": "Stockage",
    "settings.tab.llm": "LLM",
    "settings.tab.fonts": "Polices",
    "settings.tab.shortcuts": "Raccourcis",

    "settings.language": "Langue",
    "settings.language.hint":
        "Choisissez la langue de l'interface de l'application.",
    "settings.theme": "Thème",
    "settings.theme.hint": "Choisissez votre thème préféré.",
    "settings.choose_theme": "Choisir le thème",
    "settings.close_button": "Bouton Fermer",
    "settings.close_button.hint":
        "Réduire l'application dans la zone de notification en cliquant sur le bouton Fermer.",
    "settings.auto_refresh": "Actualisation auto",
    "settings.auto_refresh.hint":
        "Actualiser tous les flux au lancement (augmente le temps d'attente au démarrage)",
    "settings.export_opml": "Exporter OPML",
    "settings.export_opml.hint":
        "Exportez et enregistrez vos flux au format OPML.",

    "settings.refresh_feed": "Actualiser le flux",
    "settings.refresh_feed.hint":
        "Récupérer automatiquement les derniers articles lors de la sélection d'un flux expiré.",
    "settings.last_refresh_time": "Dernier délai d'actualisation (heures)",
    "settings.last_refresh_time.hint":
        "Délai d'expiration avant l'actualisation des nouveaux articles.",
    "settings.auto_read": "Lecture auto",
    "settings.auto_read.hint":
        "La sélection d'un article le marque automatiquement comme lu.",
    "settings.insecure_mode": "Mode non sécurisé",
    "settings.insecure_mode.hint":
        "Activez ce mode pour récupérer des flux à partir d'URL HTTP non sécurisées.",

    "settings.auto_purge": "Purge automatique",
    "settings.auto_purge.hint":
        "Supprimer automatiquement les anciens articles (non favoris et flux de plus de 100 articles).",
    "settings.post_duration": "Durée des articles",
    "settings.post_duration.hint": "Nombre de jours de conservation d'un article.",

    "settings.enable_llm": "Activer le LLM",
    "settings.enable_llm.hint":
        "Exécuter la synthèse de contenu via le service LLM (compatible OpenAI).",
    "settings.base_url": "URL de base",
    "settings.base_url.hint": "URL de base OpenAI",
    "settings.model": "Modèle",
    "settings.model.hint": "Nom du modèle OpenAI",
    "settings.token": "Jeton",
    "settings.token.hint": "Clé d'accès OpenAI",

    "settings.font_family": "Famille de polices",
    "settings.font_family.hint":
        "Choisissez la police pour tout le texte de l'application.",
    "settings.font_size": "Taille de police",
    "settings.font_size.hint":
        "Taille de police de base pour tout le texte (en pixels).",
    "settings.line_height": "Hauteur de ligne",
    "settings.line_height.hint": "Espacement entre les lignes de texte.",
    "settings.letter_spacing": "Espacement des lettres",
    "settings.letter_spacing.hint": "Espacement entre les caractères (en pixels).",
    "settings.paragraph_gap": "Espacement des paragraphes",
    "settings.paragraph_gap.hint": "Espace entre les paragraphes (en pixels).",

    "settings.enable_shortcuts": "Activer les raccourcis",
    "settings.enable_shortcuts.hint":
        "Naviguez dans l'application au clavier. Désactivé par défaut.",
    "settings.reset_defaults": "Réinitialiser les valeurs par défaut",
    "settings.press_keys": "Appuyez sur les touches… (Échap pour annuler)",
    "settings.conflicting_shortcuts": "Raccourcis en conflit :",
    "settings.reassign_or_reset":
        "Réattribuez ou réinitialisez avant d'enregistrer.",

    "shortcut.next_post": "Article suivant",
    "shortcut.next_post.desc":
        "Passer à l'article suivant de la liste. Ouvre l'article suivant pendant la lecture.",
    "shortcut.prev_post": "Article précédent",
    "shortcut.prev_post.desc":
        "Passer à l'article précédent de la liste. Ouvre l'article précédent pendant la lecture.",
    "shortcut.open_post": "Ouvrir l'article",
    "shortcut.open_post.desc": "Ouvrir l'article en surbrillance.",
    "shortcut.mark_read": "Marquer lu / non lu",
    "shortcut.mark_read.desc":
        "Basculer l'état de lecture de l'article en surbrillance ou ouvert.",
    "shortcut.mark_fav": "Marquer comme favori",
    "shortcut.mark_fav.desc":
        "Basculer l'état de favori de l'article en surbrillance ou ouvert.",
    "shortcut.open_original": "Ouvrir l'original",
    "shortcut.open_original.desc":
        "Ouvrir le lien de l'article dans le navigateur par défaut.",
    "shortcut.focus_search": "Focus recherche",
    "shortcut.focus_search.desc": "Aller au champ de recherche de flux.",
    "shortcut.next_feed": "Flux suivant",
    "shortcut.next_feed.desc":
        "Se déplacer et sélectionner le flux suivant de la liste.",
    "shortcut.prev_feed": "Flux précédent",
    "shortcut.prev_feed.desc":
        "Se déplacer et sélectionner le flux précédent de la liste.",

    "modal.add_feed": "Ajouter un flux",
    "modal.url": "URL",
    "modal.enter_feed_url": "Saisissez une URL de flux RSS ou Atom",
    "modal.skip_data_fetch": "Ignorer le chargement des données",
    "modal.skip_data_fetch.hint":
        "Activer cette option ignorera le chargement du flux.",
    "modal.upload_opml": "Importer OPML",
    "modal.scan_url": "Analyser l'URL",
    "modal.select_feeds": "Sélectionnez les flux à importer.",
    "modal.select_all": "Tout sélectionner",

    "modal.edit_feed": "Modifier le flux",
    "modal.edit_folder": "Modifier le dossier",
    "modal.title": "Titre",
    "modal.folder": "Dossier",
    "modal.pick_folder": "Choisir un dossier",
    "modal.load_refresh": "Actualiser au chargement",
    "modal.load_refresh.hint":
        "Activez cette option pour actualiser le flux au lancement de l'application.",
    "modal.total": "Total",
    "modal.posts": "Articles",
    "modal.posts_rate": "Rythme des articles",
    "modal.posts_per_day": "articles/jour",
    "modal.last_refreshed": "Dernière actualisation",

    "modal.mark_read": "Marquer comme lu",
    "modal.mark_all_read": "Marquer tous les articles de « {name} » comme lus ?",
    "modal.delete_feed": "Supprimer le flux",
    "modal.delete_confirm":
        "Vous êtes sur le point de supprimer {name}. Voulez-vous vraiment continuer ?",
    "modal.create_folder": "Créer un dossier",
    "modal.enter_folder_name": "Saisissez le nom du dossier",

    "modal.about.title": "À propos de Reader-Project",
    "modal.about.app_logo": "Logo de l'application",
    "modal.about.description":
        "Reader-Project est un agrégateur RSS axé sur la confidentialité, construit avec Tauri, SvelteKit et Tailwind CSS. Il prend en charge le stockage hors ligne, l'actualisation automatique des flux, l'extraction de contenu, la traduction d'articles et bien plus, le tout dans une interface moderne et élégante.",
    "modal.about.source_code": "Code source",
    "modal.about.license": "Licence (MIT)",

    "toast.feed_url_insecure":
        "URL de flux non sécurisée. Activez le mode non sécurisé pour récupérer des données à partir d'URL non sécurisées.",
    "toast.unable_to_fetch": "Impossible de récupérer le flux :(",
    "toast.folder_created": "Dossier créé",
    "toast.folder_create_failed":
        "Impossible de créer le dossier. Assurez-vous qu'il n'existe pas déjà.",
    "toast.edit_saved": "Modifications enregistrées.",
    "toast.edit_failed": "Échec de l'opération de modification.",
    "toast.feed_saved": "Flux enregistré avec succès.",
    "toast.invalid_file_path": "Veuillez fournir un chemin de fichier valide.",
    "toast.conflicting_shortcuts":
        "Raccourcis en conflit. Réattribuez ou réinitialisez avant d'enregistrer.",
    "toast.copied_link": "Lien copié dans le presse-papiers",
    "toast.copied_text": "Texte copié dans le presse-papiers",

    "time.seconds_ago": "il y a {n} secondes",
    "time.minutes_ago": "il y a {n} minutes",
    "time.hours_ago": "il y a {n} heures",
    "time.days_ago": "il y a {n} jours",
    "time.weeks_ago": "il y a {n} semaines",
    "time.months_ago": "il y a {n} mois",
    "time.years_ago": "il y a {n} ans",
    "time.today": "Aujourd'hui",
    "time.yesterday": "Hier",
    "time.this_week": "Cette semaine",
    "time.older": "Plus anciens",

    "loading.logo_alt": "Reader Project",
    "loading.quote":
        "« Un lecteur vit mille vies avant de mourir. L'homme qui ne lit jamais n'en vit qu'une. »",
    "loading.quote_author": "- George R.R. Martin",
};

export default fr;
