import type { TranslationKey } from "./en";

const es: Record<TranslationKey, string> = {
    "app.name": "Reader-Project",
    "app.version": "v{version}",

    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.close": "Cerrar",
    "common.minimize": "Minimizar",
    "common.maximize": "Maximizar",
    "common.search": "Buscar",
    "common.update": "Actualizar",
    "common.create": "Crear",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.import": "Importar",
    "common.refresh": "Refrescar",
    "common.mark_read": "Marcar como leído",
    "common.not_found": "No encontrado",

    "nav.feeds": "Fuentes",
    "nav.browse": "Explorar",
    "nav.settings": "Ajustes",
    "nav.add": "Añadir",
    "nav.about": "Acerca de",
    "nav.collapse": "Contraer",
    "nav.posts": "Publicaciones",
    "nav.all_posts": "Todas las publicaciones",
    "nav.my_favourites": "Mis favoritos",

    "feed.new_folder": "Crear una carpeta nueva",
    "feed.refresh": "Actualizar fuente",
    "feed.refreshing": "Actualizando fuente...",

    "posts.refreshing": "Actualizando publicaciones...",
    "posts.filter_unread": "Filtrar no leídos",
    "posts.comfortable_view": "Vista cómoda",
    "posts.compact_view": "Vista compacta",
    "posts.sort_by": "Ordenar por",
    "posts.latest_first": "Más recientes primero",
    "posts.oldest_first": "Más antiguos primero",

    "content.select_article": "Selecciona un artículo para leer",
    "content.unable_to_parse":
        "No se pudo analizar la página. Accede al sitio directamente.",
    "content.ai_summary": "Resumen generado por IA",
    "content.min_read": "{n} min de lectura",
    "content.previous_article": "Artículo anterior",
    "content.next_article": "Artículo siguiente",
    "content.copy_link": "Copiar enlace al portapapeles",
    "content.mark_as_read": "Marcar como leído",
    "content.mark_favorite": "Marcar como favorito",
    "content.open_in_browser": "Abrir en el navegador",

    "browse.title": "Explorar",
    "browse.last_weeks": "Últimas {n} semanas",
    "browse.everything": "Eso es todo de las últimas {n} semanas",
    "browse.no_articles": "No hay artículos en las últimas {n} semanas",
    "browse.read": "Leer",
    "browse.article": "Artículo",

    "settings.title": "Ajustes",
    "settings.tab.general": "General",
    "settings.tab.feeds": "Fuentes",
    "settings.tab.storage": "Almacenamiento",
    "settings.tab.llm": "LLM",
    "settings.tab.fonts": "Tipografía",
    "settings.tab.shortcuts": "Atajos",

    "settings.language": "Idioma",
    "settings.language.hint": "Elige el idioma de la interfaz de la aplicación.",
    "settings.theme": "Tema",
    "settings.theme.hint": "Elige tu tema favorito.",
    "settings.choose_theme": "Elegir tema",
    "settings.close_button": "Botón de cerrar",
    "settings.close_button.hint":
        "Minimizar la aplicación a la bandeja al hacer clic en el botón de cerrar.",
    "settings.auto_refresh": "Actualización automática",
    "settings.auto_refresh.hint":
        "Actualizar todas las fuentes al iniciar (aumenta el tiempo de espera al inicio)",
    "settings.export_opml": "Exportar OPML",
    "settings.export_opml.hint": "Exporta y guarda tus fuentes como OPML.",

    "settings.refresh_feed": "Actualizar fuente",
    "settings.refresh_feed.hint":
        "Obtener automáticamente las últimas publicaciones al seleccionar una fuente vencida.",
    "settings.last_refresh_time": "Tiempo de última actualización (horas)",
    "settings.last_refresh_time.hint":
        "Tiempo de caducidad antes de actualizar nuevas publicaciones.",
    "settings.auto_read": "Lectura automática",
    "settings.auto_read.hint":
        "Al seleccionar una publicación, se marca automáticamente como leída.",
    "settings.insecure_mode": "Modo inseguro",
    "settings.insecure_mode.hint":
        "Activa este modo para obtener fuentes desde URLs HTTP no seguras.",

    "settings.auto_purge": "Purga automática",
    "settings.auto_purge.hint":
        "Eliminar automáticamente publicaciones antiguas (no favoritas y fuentes con más de 100 publicaciones).",
    "settings.post_duration": "Duración de la publicación",
    "settings.post_duration.hint": "Número de días para conservar una publicación.",

    "settings.enable_llm": "Activar LLM",
    "settings.enable_llm.hint":
        "Ejecutar el resumen de contenido mediante el servicio LLM (compatible con OpenAI).",
    "settings.base_url": "URL base",
    "settings.base_url.hint": "URL base de OpenAI",
    "settings.model": "Modelo",
    "settings.model.hint": "Nombre del modelo de OpenAI",
    "settings.token": "Token",
    "settings.token.hint": "Clave de acceso de OpenAI",

    "settings.font_family": "Familia tipográfica",
    "settings.font_family.hint":
        "Elige la fuente para todo el texto de la aplicación.",
    "settings.font_size": "Tamaño de fuente",
    "settings.font_size.hint":
        "Tamaño de fuente base para todo el texto (en píxeles).",
    "settings.line_height": "Interlineado",
    "settings.line_height.hint": "Espaciado entre líneas de texto.",
    "settings.letter_spacing": "Espaciado entre letras",
    "settings.letter_spacing.hint": "Espaciado entre caracteres (en píxeles).",
    "settings.paragraph_gap": "Espacio entre párrafos",
    "settings.paragraph_gap.hint": "Espacio entre párrafos (en píxeles).",

    "settings.enable_shortcuts": "Activar atajos",
    "settings.enable_shortcuts.hint":
        "Navega por la aplicación con el teclado. Desactivado por defecto.",
    "settings.reset_defaults": "Restablecer valores predeterminados",
    "settings.press_keys": "Pulsa teclas… (Esc para cancelar)",
    "settings.conflicting_shortcuts": "Atajos en conflicto:",
    "settings.reassign_or_reset": "Reasigna o restablece antes de guardar.",

    "shortcut.next_post": "Publicación siguiente",
    "shortcut.next_post.desc":
        "Mover a la siguiente publicación de la lista. Abre la siguiente publicación al leer.",
    "shortcut.prev_post": "Publicación anterior",
    "shortcut.prev_post.desc":
        "Mover a la publicación anterior de la lista. Abre la publicación anterior al leer.",
    "shortcut.open_post": "Abrir publicación",
    "shortcut.open_post.desc": "Abrir la publicación resaltada.",
    "shortcut.mark_read": "Marcar leído / no leído",
    "shortcut.mark_read.desc":
        "Alternar el estado de lectura de la publicación resaltada o abierta.",
    "shortcut.mark_fav": "Marcar favorito",
    "shortcut.mark_fav.desc":
        "Alternar el estado de favorito de la publicación resaltada o abierta.",
    "shortcut.open_original": "Abrir original",
    "shortcut.open_original.desc":
        "Abrir el enlace de la publicación en el navegador predeterminado.",
    "shortcut.focus_search": "Enfocar búsqueda",
    "shortcut.focus_search.desc": "Saltar al cuadro de búsqueda de fuentes.",
    "shortcut.next_feed": "Fuente siguiente",
    "shortcut.next_feed.desc": "Mover y seleccionar la siguiente fuente de la lista.",
    "shortcut.prev_feed": "Fuente anterior",
    "shortcut.prev_feed.desc": "Mover y seleccionar la fuente anterior de la lista.",

    "modal.add_feed": "Añadir fuente",
    "modal.url": "URL",
    "modal.enter_feed_url": "Introduce una URL de feed RSS o Atom",
    "modal.skip_data_fetch": "Omitir carga de datos",
    "modal.skip_data_fetch.hint":
        "Activar esta opción omitirá la carga del feed.",
    "modal.upload_opml": "Subir OPML",
    "modal.scan_url": "Escanear URL",
    "modal.select_feeds": "Selecciona las fuentes para importar.",
    "modal.select_all": "Seleccionar todo",

    "modal.edit_feed": "Editar fuente",
    "modal.edit_folder": "Editar carpeta",
    "modal.title": "Título",
    "modal.folder": "Carpeta",
    "modal.pick_folder": "Elige una carpeta",
    "modal.load_refresh": "Actualizar al cargar",
    "modal.load_refresh.hint":
        "Activa esta opción para actualizar la fuente al iniciar la aplicación.",
    "modal.total": "Total",
    "modal.posts": "Publicaciones",
    "modal.posts_rate": "Tasa de publicaciones",
    "modal.posts_per_day": "publicaciones/día",
    "modal.last_refreshed": "Última actualización",

    "modal.mark_read": "Marcar como leído",
    "modal.mark_all_read": "¿Marcar todas las publicaciones de \"{name}\" como leídas?",
    "modal.delete_feed": "Eliminar fuente",
    "modal.delete_confirm":
        "Estás a punto de eliminar {name}. ¿Seguro que quieres continuar?",
    "modal.create_folder": "Crear carpeta",
    "modal.enter_folder_name": "Introduce el nombre de la carpeta",

    "modal.about.title": "Acerca de Reader-Project",
    "modal.about.app_logo": "Logotipo de la aplicación",
    "modal.about.description":
        "Reader-Project es un agregador RSS centrado en la privacidad creado con Tauri, SvelteKit y Tailwind CSS. Admite almacenamiento sin conexión, actualización automática de fuentes, extracción de contenido, traducción de artículos y mucho más, todo en una interfaz moderna y elegante.",
    "modal.about.source_code": "Código fuente",
    "modal.about.license": "Licencia (MIT)",

    "toast.feed_url_insecure":
        "URL de fuente insegura. Activa el modo inseguro para obtener datos desde URLs no seguras.",
    "toast.unable_to_fetch": "No se pudo obtener la fuente :(",
    "toast.folder_created": "Carpeta creada",
    "toast.folder_create_failed":
        "No se pudo crear la carpeta. Asegúrate de que la carpeta no existe.",
    "toast.edit_saved": "Cambios guardados.",
    "toast.edit_failed": "Error en la operación de edición.",
    "toast.feed_saved": "Fuente guardada correctamente.",
    "toast.invalid_file_path": "Proporciona una ruta de archivo válida.",
    "toast.conflicting_shortcuts":
        "Atajos en conflicto. Reasigna o restablece antes de guardar.",
    "toast.copied_link": "Enlace copiado al portapapeles",
    "toast.copied_text": "Texto copiado al portapapeles",

    "time.seconds_ago": "hace {n} segundos",
    "time.minutes_ago": "hace {n} minutos",
    "time.hours_ago": "hace {n} horas",
    "time.days_ago": "hace {n} días",
    "time.weeks_ago": "hace {n} semanas",
    "time.months_ago": "hace {n} meses",
    "time.years_ago": "hace {n} años",
    "time.today": "Hoy",
    "time.yesterday": "Ayer",
    "time.this_week": "Esta semana",
    "time.older": "Más antiguos",

    "loading.logo_alt": "Reader Project",
    "loading.quote":
        "“Un lector vive mil vidas antes de morir. El hombre que nunca lee vive solo una.”",
    "loading.quote_author": "- George R.R. Martin",
};

export default es;
