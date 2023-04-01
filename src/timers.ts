import { GameType } from "./Game";
import descriptions from "./descriptions";
import { ItemType } from "./items";

export default [
  // Timers

  // Front door lock timer
  (game: GameType) => {
    if (game.state.turn === 2 && ! game.items._door.locked) {
      game.displayText(descriptions.doorLock);
			game.items._door.closed = true;
			game.items._door.locked = true;
			game.mapKey[game.items._door.lockedTarget].locked = true;
			game.mapKey[game.items._door.closedTarget].closed = true;
		}
  },

  // Main game timer
  (game: GameType) => {
    if (game.state.turn >= game.timeLimit && ! game.state.gameOver) {
			return game.dead("You don't feel so well. It never occurs to you, as you crumple to the ground, losing consciousness for the final time, that you have been poisoned by an odorless, invisible, yet highly toxic gas.");
		}
  },

  // Lightsource timer
  (game: GameType) => {
    game.lightSources.forEach((source: ItemType) => (source as Record<string, any>).decrementCounter());
  },

  // Grue timer
  (game: GameType) => {
    if(game.inEnvironment("grue")) {
      game.items._grue.lurk();
    }
  },

]