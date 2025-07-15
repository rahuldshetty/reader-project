import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { getCurrentWindow } from "@tauri-apps/api/window";

const menu = await Menu.new({
  items: [
    {
      id: 'quit',
      text: 'Quit',
      action: async () => {
        await getCurrentWindow().close();
      }
    },
  ],
});

const options = {
    icon: await defaultWindowIcon(),
    menu,
    menuOnLeftClick: true,
};

const tray = await TrayIcon.new(options);
