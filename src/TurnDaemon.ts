import { GameType } from "./Game";
import initialTimers from "./initialTimers";

// commands that are not saved to history and do not count as a turn
const EXEMPT_COMMANDS = [
  "help",
  "start",
  "commands",
  "inventory",
  "inventorytable",
  "look",
  "font",
  "color",
  "size",
  "save",
  "restore",
  "resume",
  "verbose",
  "quit",
  "again",
  "yes",
  "score",
  "_0",
  "_1",
  "_2",
  "_3",
  "_4",
  "_5",
  "_6",
  "_7",
  "_8",
  "_9",
  "poof",
];

export interface TimerType {
  name: string;
  function: (game: GameType) => void;
}

export default class TurnDaemon {
  game: GameType;
  timers: TimerType[] = [];
  
  constructor(game: GameType) {
    this.game = game;
    initialTimers.forEach((timer, index) => {
      this.registerTimer(`timer_${index}`, timer);
    });
    this.executeCommand = this.executeCommand.bind(this);
    this.registerTimer = this.registerTimer.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.runTimers = this.runTimers.bind(this);
  }

  // This function is bound to each command, and is called when the command is executed
  executeCommand(
    commandName: string,
    interpreterFunction: (commandName: string) => void
  ) {
    const window = globalThis as any;
    if (this.game.state.gameOver) {
      if (commandName === "start") {
        this.game.start();
        return this.game.variableWidthDivider();
      }
      this.game.displayText(this.game.descriptions.gameOver);
    } else {
      if (window.CONSOLE_GAME_DEBUG) {
        window.debugLog.push({ userInput: commandName });
      }

      try {
        // execute command
        interpreterFunction(commandName);

        if (!EXEMPT_COMMANDS.includes(commandName)) {
          // don't add to history or increment turn or timers if command is exempt
          this.game.addToHistory(commandName);
          if (!this.game.state.objectMode && !this.game.state.abortMode) {
            // only increment turn and timers if not in objectMode (prevents two-word commands from taking up two turns), and if not in abortMode (prevent a failed movement attempt, i.e. trying to move 'up' when you are only able to move 'east' or 'west', from consuming a turn)
            this.runTimers();
            this.game.state.turn++;
          }
          this.game.state.abortMode = false;
          if (this.game.state.verbose) {
            this.game.describeSurroundings();
          }
        }
        // to avoid printing 'undefined' when a command returns nothing
        return this.game.variableWidthDivider();
      } catch (error) {
        // recognized command word used incorrectly
        console.trace(error);
        this.game.log.p("That's not going to work. Please try something else.");
        // to avoid printing 'undefined' when a command returns nothing
        return this.game.variableWidthDivider();
      }
    }
  }

  // executes all timer functions
  runTimers() {
    this.timers.forEach((timer) => {
      timer.function(this.game);
    });
  }

  // registers a timer function
  registerTimer(name: string, timerFunction: (gameContext: GameType) => void) {
    this.timers.push({ name, function: timerFunction });
  }

  // removes a timer function
  removeTimer(timerToRemove: ((gameContext: GameType) => void) | string) {
    if (typeof timerToRemove === "string") {
      this.timers = this.timers.filter((timer) => timer.name !== timerToRemove);
    } else {
      this.timers = this.timers.filter(
        (timer) => timer.function !== timerToRemove
      );
    }
  }

  // checks if a timer function is registered
  hasTimer(timerToCheck: ((gameContext: GameType) => void) | string) {
    if (typeof timerToCheck === "string") {
      return this.timers.some((timer) => timer.name === timerToCheck);
    } else {
      return this.timers.some((timer) => timer.function === timerToCheck);
    }
  }

}
