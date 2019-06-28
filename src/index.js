import {primaryFont, textColor, fontSize, pStyle} from "./prefs.js";
window.CONSOLE_GAME_DEBUG = true;
// eslint-disable-next-line import/first
import game from "./game.js";


// Wait for page to load, and display greeting.
window.onload = () => {
    // console.clear();
    const prefMode = localStorage.getItem("ConsoleGame.prefMode");
    if (prefMode) {
        localStorage.removeItem("ConsoleGame.prefMode");
        return game._resume();
    }
    return game.intro();
};
window.scroll(0, 0);
// for debugging - remove later
// window.game = ConsoleGame;
export default game;