import Game from "./Game";
import storage from "./utils/storage";

(window as any).CONSOLE_GAME_DEBUG = true;

// Wait for page to load
window.onload = () => {
    // Create game object.
    const game = new Game();
    (window as any).game = game;
    const prefMode = storage.getStorage("prefMode");
    if (prefMode) { // if prefMode is set, the user has just changed a preference, and reloaded the page so it would take effect. Resume the game from its previous state.
        storage.removeStorage("prefMode");    
        game.resume();
    } else {
        return game.intro();
    }
};

window.scroll(0, 0);