import type { TranslationKey } from "./en";

const ja: Record<TranslationKey, string> = {
    "app.name": "Reader-Project",
    "app.version": "v{version}",

    "common.cancel": "キャンセル",
    "common.save": "保存",
    "common.close": "閉じる",
    "common.minimize": "最小化",
    "common.maximize": "最大化",
    "common.search": "検索",
    "common.update": "更新",
    "common.create": "作成",
    "common.delete": "削除",
    "common.edit": "編集",
    "common.import": "インポート",
    "common.refresh": "更新",
    "common.mark_read": "既読にする",
    "common.not_found": "見つかりません",

    "nav.feeds": "フィード",
    "nav.browse": "ブラウズ",
    "nav.settings": "設定",
    "nav.add": "追加",
    "nav.about": "情報",
    "nav.collapse": "折りたたむ",
    "nav.posts": "記事",
    "nav.all_posts": "すべての記事",
    "nav.my_favourites": "お気に入り",

    "feed.new_folder": "新しいフォルダーを作成",
    "feed.refresh": "フィードを更新",
    "feed.refreshing": "フィードを更新中...",

    "posts.refreshing": "記事を更新中...",
    "posts.filter_unread": "未読で絞り込む",
    "posts.comfortable_view": "快適ビュー",
    "posts.compact_view": "コンパクトビュー",
    "posts.sort_by": "並び替え",
    "posts.latest_first": "新しい順",
    "posts.oldest_first": "古い順",

    "content.select_article": "読む記事を選択してください",
    "content.unable_to_parse":
        "ページを解析できません。サイトに直接アクセスしてください。",
    "content.ai_summary": "AI生成サマリー",
    "content.min_read": "読了 {n} 分",
    "content.previous_article": "前の記事",
    "content.next_article": "次の記事",
    "content.copy_link": "リンクをクリップボードにコピー",
    "content.mark_as_read": "既読にする",
    "content.mark_favorite": "お気に入りに追加",
    "content.open_in_browser": "ブラウザで開く",

    "browse.title": "ブラウズ",
    "browse.last_weeks": "過去 {n} 週間",
    "browse.everything": "過去 {n} 週間のすべてです",
    "browse.no_articles": "過去 {n} 週間の記事はありません",
    "browse.read": "読む",
    "browse.article": "記事",

    "settings.title": "設定",
    "settings.tab.general": "一般",
    "settings.tab.feeds": "フィード",
    "settings.tab.storage": "ストレージ",
    "settings.tab.llm": "LLM",
    "settings.tab.fonts": "フォント",
    "settings.tab.shortcuts": "ショートカット",

    "settings.language": "言語",
    "settings.language.hint": "アプリのインターフェースの言語を選択します。",
    "settings.theme": "テーマ",
    "settings.theme.hint": "お好みのテーマを選択してください。",
    "settings.choose_theme": "テーマを選択",
    "settings.close_button": "閉じるボタン",
    "settings.close_button.hint":
        "閉じるボタンをクリックしたときにアプリをトレイに最小化します。",
    "settings.auto_refresh": "自動更新",
    "settings.auto_refresh.hint":
        "起動時にすべてのフィードを更新します（起動時の待ち時間が増えます）",
    "settings.export_opml": "OPMLをエクスポート",
    "settings.export_opml.hint":
        "フィードデータをOPMLとしてエクスポートして保存します。",

    "settings.refresh_feed": "フィードを更新",
    "settings.refresh_feed.hint":
        "期限切れのフィードを選択したときに最新の記事を自動取得します。",
    "settings.last_refresh_time": "最終更新時間（時間）",
    "settings.last_refresh_time.hint":
        "新しい記事を更新するまでの有効期限。",
    "settings.auto_read": "自動既読",
    "settings.auto_read.hint": "記事を選択すると自動的に既読になります。",
    "settings.insecure_mode": "安全でないモード",
    "settings.insecure_mode.hint":
        "安全でないHTTP URLからフィードを取得するにはこのモードを有効にします。",

    "settings.auto_purge": "自動削除",
    "settings.auto_purge.hint":
        "古い記事（お気に入り以外、100件超のフィード）を自動削除します。",
    "settings.post_duration": "記事の保持期間",
    "settings.post_duration.hint": "記事を保持する日数。",

    "settings.enable_llm": "LLMを有効化",
    "settings.enable_llm.hint":
        "LLMサービス（OpenAI互換）でコンテンツの要約を実行します。",
    "settings.base_url": "ベースURL",
    "settings.base_url.hint": "OpenAIベースURL",
    "settings.model": "モデル",
    "settings.model.hint": "OpenAIモデル名",
    "settings.token": "トークン",
    "settings.token.hint": "OpenAIアクセスキー",

    "settings.font_family": "フォントファミリー",
    "settings.font_family.hint":
        "アプリ全体のテキストのフォントを選択します。",
    "settings.font_size": "フォントサイズ",
    "settings.font_size.hint":
        "すべてのテキストの基準フォントサイズ（ピクセル）。",
    "settings.line_height": "行の高さ",
    "settings.line_height.hint": "テキストの行間隔。",
    "settings.letter_spacing": "文字間隔",
    "settings.letter_spacing.hint": "文字間の間隔（ピクセル）。",
    "settings.paragraph_gap": "段落の間隔",
    "settings.paragraph_gap.hint": "段落間の間隔（ピクセル）。",

    "settings.enable_shortcuts": "ショートカットを有効化",
    "settings.enable_shortcuts.hint":
        "キーボードでアプリを操作します。デフォルトでは無効です。",
    "settings.reset_defaults": "デフォルトに戻す",
    "settings.press_keys": "キーを押してください…（Escでキャンセル）",
    "settings.conflicting_shortcuts": "競合するショートカット：",
    "settings.reassign_or_reset":
        "保存前に再割り当てまたはリセットしてください。",

    "shortcut.next_post": "次の記事",
    "shortcut.next_post.desc":
        "リスト内の次の記事に移動します。読書中は次の記事を開きます。",
    "shortcut.prev_post": "前の記事",
    "shortcut.prev_post.desc":
        "リスト内の前の記事に移動します。読書中は前の記事を開きます。",
    "shortcut.open_post": "記事を開く",
    "shortcut.open_post.desc": "ハイライトされた記事を開きます。",
    "shortcut.mark_read": "既読/未読を切り替え",
    "shortcut.mark_read.desc":
        "ハイライトまたは開いている記事の既読状態を切り替えます。",
    "shortcut.mark_fav": "お気に入りに追加",
    "shortcut.mark_fav.desc":
        "ハイライトまたは開いている記事のお気に入り状態を切り替えます。",
    "shortcut.open_original": "元のページを開く",
    "shortcut.open_original.desc": "記事のリンクを既定のブラウザで開きます。",
    "shortcut.focus_search": "検索にフォーカス",
    "shortcut.focus_search.desc": "フィード検索ボックスに移動します。",
    "shortcut.next_feed": "次のフィード",
    "shortcut.next_feed.desc": "リスト内の次のフィードに移動して選択します。",
    "shortcut.prev_feed": "前のフィード",
    "shortcut.prev_feed.desc": "リスト内の前のフィードに移動して選択します。",

    "modal.add_feed": "フィードを追加",
    "modal.url": "URL",
    "modal.enter_feed_url": "RSSまたはAtomフィードのURLを入力",
    "modal.skip_data_fetch": "データ取得をスキップ",
    "modal.skip_data_fetch.hint":
        "このオプションを有効にするとフィードの読み込みをスキップします。",
    "modal.upload_opml": "OPMLをアップロード",
    "modal.scan_url": "URLをスキャン",
    "modal.select_feeds": "インポートするフィードを選択してください。",
    "modal.select_all": "すべて選択",

    "modal.edit_feed": "フィードを編集",
    "modal.edit_folder": "フォルダーを編集",
    "modal.title": "タイトル",
    "modal.folder": "フォルダー",
    "modal.pick_folder": "フォルダーを選択",
    "modal.load_refresh": "読み込み時に更新",
    "modal.load_refresh.hint":
        "アプリ起動時にフィードを更新するにはこのオプションを有効にします。",
    "modal.total": "合計",
    "modal.posts": "記事",
    "modal.posts_rate": "記事レート",
    "modal.posts_per_day": "記事/日",
    "modal.last_refreshed": "最終更新",

    "modal.mark_read": "既読にする",
    "modal.mark_all_read": "「{name}」のすべての記事を既読にしますか？",
    "modal.delete_feed": "フィードを削除",
    "modal.delete_confirm": "{name} を削除しようとしています。続行しますか？",
    "modal.create_folder": "フォルダーを作成",
    "modal.enter_folder_name": "フォルダー名を入力",

    "modal.about.title": "Reader-Project について",
    "modal.about.app_logo": "アプリロゴ",
    "modal.about.description":
        "Reader-Projectは、Tauri、SvelteKit、Tailwind CSSで構築されたプライバシー重視のRSSアグリゲーターです。オフラインストレージ、フィードの自動更新、コンテンツ抽出、記事翻訳などを、洗練されたモダンなUIでサポートします。",
    "modal.about.source_code": "ソースコード",
    "modal.about.license": "ライセンス (MIT)",

    "toast.feed_url_insecure":
        "フィードURLが安全ではありません。安全でないURLからデータを取得するには安全でないモードを有効にしてください。",
    "toast.unable_to_fetch": "フィードを取得できませんでした :(",
    "toast.folder_created": "フォルダーを作成しました",
    "toast.folder_create_failed":
        "フォルダーを作成できません。フォルダーが存在しないことを確認してください。",
    "toast.edit_saved": "編集を保存しました。",
    "toast.edit_failed": "編集操作に失敗しました。",
    "toast.feed_saved": "フィードを正常に保存しました。",
    "toast.invalid_file_path": "有効なファイルパスを指定してください。",
    "toast.conflicting_shortcuts":
        "ショートカットが競合しています。保存前に再割り当てまたはリセットしてください。",
    "toast.copied_link": "リンクをクリップボードにコピーしました",
    "toast.copied_text": "テキストをクリップボードにコピーしました",

    "time.seconds_ago": "{n}秒前",
    "time.minutes_ago": "{n}分前",
    "time.hours_ago": "{n}時間前",
    "time.days_ago": "{n}日前",
    "time.weeks_ago": "{n}週間前",
    "time.months_ago": "{n}か月前",
    "time.years_ago": "{n}年前",
    "time.today": "今日",
    "time.yesterday": "昨日",
    "time.this_week": "今週",
    "time.older": "以前",

    "loading.logo_alt": "Reader Project",
    "loading.quote":
        "「読む人は死ぬ前に千の人生を生きる。決して読まない人はひとつの人生しか生きない。」",
    "loading.quote_author": "- ジョージ・R・R・マーティン",
};

export default ja;
