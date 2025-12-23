// Based on documentation:
// https://v2.tauri.app/learn/system-tray/
// https://v1.tauri.app/v1/guides/features/system-tray/
// https://gist.github.com/jdegger/aeea3dc369359775d426dd636fae9220
import { platform } from '@tauri-apps/plugin-os';

if (platform() != 'android') {
  const [
    { TrayIcon },
    { defaultWindowIcon },
    { Menu },
    { getCurrentWindow },
    { exit },
  ] = await Promise.all([
    import("@tauri-apps/api/tray"),
    import("@tauri-apps/api/app"),
    import("@tauri-apps/api/menu"),
    import("@tauri-apps/api/window"),
    import("@tauri-apps/plugin-process"),
  ]);

  const openWindow = async () => {
    await getCurrentWindow().show();
    await getCurrentWindow().setFocus();
  }

  const menu = await Menu.new({
    items: [
      {
        id: 'open',
        text: 'Open',
        action: openWindow
      },
      {
        id: 'quit',
        text: 'Quit',
        action: async () => {
          await exit(0);
        }
      },
    ],
  });

  const options = {
    icon: await defaultWindowIcon(),
    menu,
    menuOnLeftClick: false,
    title: "Reader-Project",
    action: async (event) => {
      switch (event.type) {
        case 'DoubleClick':
          await openWindow()
          break;
      }
    },
  };

  const tray = await TrayIcon.new(options);
}

