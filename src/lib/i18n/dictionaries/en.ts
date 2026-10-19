// English source dictionary. This is the source of truth for every
// translation key; other locales type-check against it so a missing or
// extra key is a compile error.

const en = {
    // App
    "app.name": "Reader-Project",
    "app.version": "v{version}",

    // Common
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
    "common.minimize": "Minimize",
    "common.maximize": "Maximize",
    "common.search": "Search",
    "common.update": "Update",
    "common.create": "Create",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.import": "Import",
    "common.refresh": "Refresh",
    "common.mark_read": "Mark Read",
    "common.not_found": "Not Found",

    // Navigation
    "nav.feeds": "Feeds",
    "nav.browse": "Browse",
    "nav.settings": "Settings",
    "nav.add": "Add",
    "nav.menu": "Menu",
    "nav.about": "About",
    "nav.collapse": "Collapse",
    "nav.posts": "Posts",
    "nav.all_posts": "All Posts",
    "nav.my_favourites": "My Favourites",
    "nav.no_feeds": "No feeds yet. Use + to add one.",

    // Feed panel
    "feed.new_folder": "Create a new folder",
    "feed.refresh": "Refresh Feed",
    "feed.refreshing": "Refreshing feed...",

    // Posts panel
    "posts.refreshing": "Refreshing posts...",
    "posts.filter_unread": "Filter unread",
    "posts.comfortable_view": "Comfortable view",
    "posts.compact_view": "Compact view",
    "posts.sort_by": "Sort By",
    "posts.latest_first": "Latest First",
    "posts.oldest_first": "Oldest First",
    "posts.filters": "Filters",
    "posts.empty": "No posts to show",
    "posts.empty.hint": "Add a feed or choose another source.",
    "posts.empty.search": "No results for this search.",
    "posts.empty.unread": "No unread posts.",
    "posts.empty.filters": "Try adjusting your filters.",
    "posts.pull_to_refresh": "Pull to refresh",
    "posts.release_to_refresh": "Release to refresh",

    // Content panel
    "content.select_article": "Select an article to read",
    "content.unable_to_parse":
        "Unable to parse page. Please access the site directly.",
    "content.ai_summary": "AI Generated Summary",
    "content.min_read": "{n} min read",
    "content.cached": "Cached",
    "content.cached.hint": "Loaded from the local content cache.",
    "content.previous_article": "Previous article",
    "content.next_article": "Next article",
    "content.copy_link": "Copy link to Clipboard",
    "content.mark_as_read": "Mark as Read",
    "content.mark_favorite": "Mark Favorite",
    "content.open_in_browser": "Open in browser",

    // Browse panel
    "browse.title": "Browse",
    "browse.last_weeks": "Last {n} weeks",
    "browse.everything": "That's everything from the last {n} weeks",
    "browse.no_articles": "No articles in the last {n} weeks",
    "browse.read": "Read",
    "browse.article": "Article",

    // Settings modal
    "settings.title": "Settings",
    "settings.tab.general": "General",
    "settings.tab.side_panel": "Side panel",
    "settings.tab.feeds": "Feeds",
    "settings.tab.storage": "Storage",
    "settings.tab.llm": "LLM",
    "settings.tab.fonts": "Fonts",
    "settings.tab.shortcuts": "Shortcuts",

    // Side panel
    "settings.side_panel": "Side panel",
    "settings.side_panel.hint":
        "Choose which folders and feeds appear in the mobile side panel.",
    "settings.side_panel.visible": "Show in side panel",
    "settings.side_panel.move_up": "Move up",
    "settings.side_panel.move_down": "Move down",
    "settings.side_panel.reset": "Reset",

    // General
    "settings.language": "Language",
    "settings.language.hint": "Choose the language for the app interface.",
    "settings.theme": "Theme",
    "settings.theme.hint": "Pick your favorite theme.",
    "settings.choose_theme": "Choose Theme",
    "settings.close_button": "Close Button",
    "settings.close_button.hint":
        "Minimize app to tray when clicking close button.",
    "settings.auto_refresh": "Auto-Refresh",
    "settings.auto_refresh.hint":
        "Refresh all feeds on launch (increases waiting time on launch)",
    "settings.export_opml": "Export OPML",
    "settings.export_opml.hint": "Export and save your feed data as OPML.",

    // Feeds
    "settings.refresh_feed": "Refresh Feed",
    "settings.refresh_feed.hint":
        "Automatically pull latest posts when selecting an expired feed.",
    "settings.last_refresh_time": "Last Refresh Time (hours)",
    "settings.last_refresh_time.hint": "Expiry time before refreshing new posts.",
    "settings.auto_read": "Auto-Read",
    "settings.auto_read.hint":
        "Selecting a post automatically marks the post as read.",
    "settings.insecure_mode": "Insecure Mode",
    "settings.insecure_mode.hint":
        "Enable this mode to pull feeds from unsecured HTTP urls.",

    // Storage
    "settings.auto_purge": "Auto Purge",
    "settings.auto_purge.hint":
        "Automatically delete older posts (non-favorites & feeds > 100 posts).",
    "settings.post_duration": "Post Duration",
    "settings.post_duration.hint": "Number of days to persist a post.",
    "settings.content_cache": "Content Cache",
    "settings.content_cache.hint":
        "Store the extracted article HTML locally so reopening a post is instant and works offline.",
    "settings.cache_ttl": "Cache Duration (days)",
    "settings.cache_ttl.hint":
        "Cached article content older than this is removed.",
    "settings.cache_max_size": "Cache Size Limit (MB)",
    "settings.cache_max_size.hint":
        "Least-recently-read cached articles are removed when the cache exceeds this size.",
    "settings.cache_usage_title": "Cached Content",
    "settings.cache_usage": "{count} articles, {size} MB",
    "settings.cache_loading": "Checking cache…",
    "settings.clear_cache": "Clear Cache",

    // LLM
    "settings.enable_llm": "Enable LLM",
    "settings.enable_llm.hint":
        "Run content summarization using LLM service (OpenAI-compatible).",
    "settings.base_url": "Base URL",
    "settings.base_url.hint": "Open-AI Base URL",
    "settings.model": "Model",
    "settings.model.hint": "Open-AI Model Name",
    "settings.token": "Token",
    "settings.token.hint": "Open-AI Access Key",

    // Fonts
    "settings.font_family": "Font Family",
    "settings.font_family.hint": "Choose the font for all text across the app.",
    "settings.font_size": "Font Size",
    "settings.font_size.hint": "Base font size for all text (in pixels).",
    "settings.line_height": "Line Height",
    "settings.line_height.hint": "Spacing between lines of text.",
    "settings.letter_spacing": "Letter Spacing",
    "settings.letter_spacing.hint": "Spacing between characters (in pixels).",
    "settings.paragraph_gap": "Paragraph Gap",
    "settings.paragraph_gap.hint": "Space between paragraphs (in pixels).",

    // Shortcuts
    "settings.enable_shortcuts": "Enable Shortcuts",
    "settings.enable_shortcuts.hint":
        "Navigate the app with your keyboard. Disabled by default.",
    "settings.reset_defaults": "Reset to Defaults",
    "settings.press_keys": "Press keys… (Esc to cancel)",
    "settings.conflicting_shortcuts": "Conflicting shortcuts:",
    "settings.reassign_or_reset": "Reassign or reset before saving.",

    // Shortcut actions
    "shortcut.next_post": "Next Post",
    "shortcut.next_post.desc":
        "Move to the next post in the list. Opens the next post while reading.",
    "shortcut.prev_post": "Previous Post",
    "shortcut.prev_post.desc":
        "Move to the previous post in the list. Opens the previous post while reading.",
    "shortcut.open_post": "Open Post",
    "shortcut.open_post.desc": "Open the highlighted post.",
    "shortcut.mark_read": "Mark Read / Unread",
    "shortcut.mark_read.desc":
        "Toggle read status of the highlighted or open post.",
    "shortcut.mark_fav": "Mark Favourite",
    "shortcut.mark_fav.desc":
        "Toggle favourite status of the highlighted or open post.",
    "shortcut.open_original": "Open Original",
    "shortcut.open_original.desc": "Open the post link in the default browser.",
    "shortcut.focus_search": "Focus Search",
    "shortcut.focus_search.desc": "Jump to the feed search box.",
    "shortcut.next_feed": "Next Feed",
    "shortcut.next_feed.desc": "Move to and select the next feed in the list.",
    "shortcut.prev_feed": "Previous Feed",
    "shortcut.prev_feed.desc":
        "Move to and select the previous feed in the list.",

    // Add feed modal
    "modal.add_feed": "Add Feed",
    "modal.url": "URL",
    "modal.enter_feed_url": "Enter RSS or Atom feed URL",
    "modal.skip_data_fetch": "Skip data fetch",
    "modal.skip_data_fetch.hint": "Enabling this option will skip the feed load.",
    "modal.upload_opml": "Upload OPML",
    "modal.scan_url": "Scan URL",
    "modal.select_feeds": "Select feeds to import.",
    "modal.select_all": "Select All",

    // Edit modal
    "modal.edit_feed": "Edit Feed",
    "modal.edit_folder": "Edit Folder",
    "modal.title": "Title",
    "modal.folder": "Folder",
    "modal.pick_folder": "Pick a folder",
    "modal.load_refresh": "Load Refresh",
    "modal.load_refresh.hint":
        "Enable this option to refresh feed when app is launched.",
    "modal.total": "Total",
    "modal.posts": "Posts",
    "modal.posts_rate": "Posts Rate",
    "modal.posts_per_day": "posts/day",
    "modal.last_refreshed": "Last Refreshed",

    // Mark read / delete / folder modals
    "modal.mark_read": "Mark Read",
    "modal.mark_all_read": "Mark all posts in \"{name}\" as read?",
    "modal.delete_feed": "Delete Feed",
    "modal.delete_confirm":
        "You are about to delete {name}. Are you sure you want to continue?",
    "modal.create_folder": "Create Folder",
    "modal.enter_folder_name": "Enter folder name",

    // About modal
    "modal.about.title": "About Reader-Project",
    "modal.about.app_logo": "App Logo",
    "modal.about.description":
        "Reader-Project is a privacy-focused RSS aggregator built with Tauri, SvelteKit, and Tailwind CSS. It supports offline storage, auto-refreshing feeds, content extraction, article translation, and more — all in a sleek, modern UI.",
    "modal.about.source_code": "Source Code",
    "modal.about.license": "License (MIT)",

    // Toasts
    "toast.feed_url_insecure":
        "Feed URL insecure. Enable insecure mode to fetch data from insecure urls.",
    "toast.unable_to_fetch": "Unable to fetch feed :(",
    "toast.folder_created": "Folder created",
    "toast.folder_create_failed":
        "Unable to create folder. Please make sure folder doesn't exist.",
    "toast.edit_saved": "Edit Saved.",
    "toast.edit_failed": "Edit operation failed.",
    "toast.feed_saved": "Feed saved successfully.",
    "toast.cache_cleared": "Content cache cleared.",
    "toast.invalid_file_path": "Please provide valid file path.",
    "toast.conflicting_shortcuts":
        "Conflicting shortcuts. Reassign or reset before saving.",
    "toast.copied_link": "Copied link to Clipboard",
    "toast.copied_text": "Copied text to Clipboard",

    // Relative time & grouping
    "time.seconds_ago": "{n} seconds ago",
    "time.minutes_ago": "{n} minutes ago",
    "time.hours_ago": "{n} hours ago",
    "time.days_ago": "{n} days ago",
    "time.weeks_ago": "{n} weeks ago",
    "time.months_ago": "{n} months ago",
    "time.years_ago": "{n} years ago",
    "time.today": "Today",
    "time.yesterday": "Yesterday",
    "time.this_week": "This week",
    "time.older": "Older",

    // Loading screen
    "loading.logo_alt": "Reader Project",
    "loading.feeds_progress": "Loading feeds · {completed} / {total} ({percent}%)",
    "loading.quote":
        "“A reader lives a thousand lives before he dies. The man who never reads lives only one.”",
    "loading.quote_author": "- George R.R. Martin",

    // Feed sharing
    "settings.share_qr": "Share via QR",
    "settings.share_qr.hint":
        "Temporarily show a QR code that a mobile device can scan to receive your feeds.",
    "share.title": "Share feeds",
    "share.hint":
        "This code contains the encryption key. Anyone who can see it can receive these feeds. It expires automatically, and the connection closes when the transfer finishes.",
    "share.starting": "Preparing a secure code…",
    "share.waiting": "Scan this code from the mobile app",
    "share.expires_in": "Expires in {seconds}s",
    "share.connected": "{client} connected",
    "share.sending": "Sending {count} feeds…",
    "share.done": "Transfer complete. The connection is closed.",
    "share.expired": "The code expired. Generate a new one.",
    "share.cancelled": "Sharing stopped.",
    "share.error": "Sharing failed: {message}",
    "share.new_code": "New code",
    "share.no_feeds": "There are no feeds to share.",
    "share.client.desktop": "Device",
    "share.scan_qr": "Scan QR",
    "share.scan_hint":
        "Scan the QR code shown on the sharing device, or pick a screenshot of it.",
    "share.scan_camera": "Use camera",
    "share.choose_image": "Choose image",
    "share.scanning": "Looking for a QR code…",
    "share.connecting": "Connecting…",
    "share.receiving": "Receiving feeds…",
    "share.invalid_qr": "This is not a valid feed share code.",
    "share.code_expired":
        "The code expired or the sharing device stopped. Ask for a new code.",
    "share.connect_failed": "Could not connect to the sharing device.",
    "share.camera_unavailable": "Camera unavailable. Choose an image instead.",
    "share.already_added": "Already added",
    "toast.import_partial": "Some feeds could not be imported.",
} as const;

export default en;

export type TranslationKey = keyof typeof en;
