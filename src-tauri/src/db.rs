use tauri_plugin_sql::{Migration, MigrationKind};

pub fn fetch_migrations() -> Vec<tauri_plugin_sql::Migration> {
    return vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_tables",
            sql: "CREATE TABLE feeds (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    url TEXT NOT NULL UNIQUE,
                    favicon TEXT,
                    last_refresh_time TEXT
                );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_articles_table",
            sql: "CREATE TABLE articles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    feed_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    link TEXT NOT NULL UNIQUE,
                    image_url TEXT,
                    pub_date TEXT,
                    read BOOLEAN NOT NULL DEFAULT 0,
                    FOREIGN KEY(feed_id) REFERENCES feeds(id) ON DELETE CASCADE
                );",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "add_fav_post_col",
            sql: "ALTER TABLE articles ADD COLUMN is_fav BOOLEAN NOT NULL DEFAULT 0;",
            kind: MigrationKind::Up,
        },
    ];
}
