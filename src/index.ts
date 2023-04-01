import Game from "./Game";
(window as any).CONSOLE_GAME_DEBUG = true;

// Wait for page to load
window.onload = () => {
    // Create game object.
    const game = new Game();
    const prefMode = localStorage.getItem("ConsoleGame.prefMode");
    if (prefMode) {
        localStorage.removeItem("ConsoleGame.prefMode");    
        game.commands.resume();
    } else {
        return game.intro();
    }
};

window.scroll(0, 0);