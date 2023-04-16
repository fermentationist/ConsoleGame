import { GameType } from './Game';
import { CommandAlias } from './commands';
// commands that are reserved words in JavaScript but we will overwrite anyway, (;
const RESERVED_WORDS_TO_OVERWRITE = [
  "open",
  "close",
  "status",
  "inspect",
  "table",
  "screen",
  "scroll",
];

export default class CommandBinder {
  game: GameType;
  constructor(game: GameType) {
    this.game = game;
    this.bindCommandToFunction = this.bindCommandToFunction.bind(this);
    this.bindCommands = this.bindCommands.bind(this);
  }

    /* 
  *bindCommandToFunction() creates a property on the global object with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the property. 
  This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
  Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his console adventure here: https://rawgit.com/secretGeek/console-adventure/master/log.html
  */
  bindCommandToFunction(
    interpreterFunction: (command: string) => void, // The function to be (eventually) invoked when the command is entered
    commandAliases: string,
    daemon?: (
      command: string,
      interpreterFunction: (command: string) => void
    ) => void // A function that will be invoked with the command name and the interpreter function as arguments.
  ) {
    const aliasArray = commandAliases.split(",");
    // Use the first alias as the command name
    const [commandName] = aliasArray;
    // If a daemon function is provided, it will be invoked with the command name and the interpreter function as arguments. Otherwise, the interpreter function will be invoked with the command name as an argument.
    const interpretCommand = daemon
      ? daemon.bind(this.game, commandName, interpreterFunction.bind(this.game))
      : interpreterFunction.bind(this.game, commandName);
    try {
      aliasArray.forEach((alias) => {
        // check to prevent unwanted overwrite of global property, i.e. Map
        if (
          !(alias in globalThis) ||
          RESERVED_WORDS_TO_OVERWRITE.includes(alias)
        ) {
          // The following (commented-out) line was causing a bug, so do not revert to it.
          // Object.defineProperty(globalThis, alias.trim(), {get: interpretCommand});
          Object.defineProperty(globalThis, alias.trim(), {
            get() {
              return interpretCommand();
            },
          });
        }
      });
    } catch (err) {
      // fail silently
    }
  }

  // Applies bindCommandToFunction() to an array of all of the commands to be created
  bindCommands(commands: CommandAlias[]) {
    commands.forEach((commandEntry) => {
      let [interpreterFunction, aliases] = commandEntry;
      this.bindCommandToFunction(interpreterFunction, aliases, this.game.turnDaemon?.executeCommand);
    });
  }

}