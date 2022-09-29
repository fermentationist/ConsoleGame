// eslint-disable-next-line import/first
import {primaryFont, textColor, fontSize, pStyle} from "./prefs.js";
import game, {init} from "./game.js";
// window.CONSOLE_GAME_DEBUG = true;


// Wait for page to load, and display greeting.
window.onload = () => {
    init();
    const prefMode = localStorage.getItem("ConsoleGame.prefMode");
    if (prefMode) {
        localStorage.removeItem("ConsoleGame.prefMode");
        return game._resume();
    }
    return game.intro();
};

window.scroll(0, 0);

export default game;