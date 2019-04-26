import {primaryFont, textColor, fontSize, pStyle} from "./prefs.js";
import ConsoleGame from "./game.js";
// import maps from "./maps.js";
// import mapKeyModule from "./mapkey.js";

// Create new game object and set its prototype to ConsoleGame.
// Include maps and key to be used.
const game = {};
Object.setPrototypeOf(game, ConsoleGame);
// game.maps = maps;
// game.mapKey = mapKeyModule(game);

// Wait for page to load, and display greeting.
window.onload = () => {
    game.intro();
};

export default game;