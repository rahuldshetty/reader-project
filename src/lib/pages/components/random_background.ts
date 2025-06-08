import bg1 from "$lib/assets/bg1.jpg";
import bg2 from "$lib/assets/bg2.jpg";
import bg3 from "$lib/assets/bg3.jpg";
import bg4 from "$lib/assets/bg4.jpg";
import bg5 from "$lib/assets/bg5.jpg";
import bg6 from "$lib/assets/bg6.jpg";
import { getRandomElement } from "$lib/utils/html";

export const get_random_bg = () => {
    return getRandomElement([
        bg1,
        bg2,
        bg3,
        bg4,
        bg5,
        bg6,
    ])
}
