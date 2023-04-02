import storage from "./utils/storage";
import log from "./utils/customConsole/index";
import { randomDogName } from "./utils/dogNames";
import { cases } from "./utils/helpers";
import initCommandModule, { CommandAlias } from "./commands";
import initItemsModule, { ItemType } from "./items/index";
import initMapKeyModule, { EnvType } from "./maps/mapKey";
import maps from "./maps/maps";
import descriptions from "./descriptions";
import { deepClone, formatList } from "./utils/helpers";
import timers from "./timers";

const { getStorage, removeStorage, setStorage } = storage;

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
  "_save_slot",
  "again",
  "yes",
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
];

let gameContext: any;

export default class Game {
  state;
  maps = [] as string[][][];
  mapKey = {} as Record<string, any>;
  items = {} as any;
  commands = {} as any;
  commandList = [] as CommandAlias[];
  timeLimit = 300;
  log = log;
  confirmationCallback = () => {};
  timers = [] as ((gameContext: this) => void)[];
  lightSources = [] as ItemType[];
  descriptions = {} as Record<string, any>;
  initialState = {
    solveMode: false,
    prefMode: false,
    restoreMode: false,
    gameOver: false,
    pendingAction: null,
    turn: 0,
    score: 0,
    dogName: null,
    inventory: [],
    startPosition: {
      z: 3,
      y: 13,
      x: 7,
    },
    position: {
      z: 3,
      y: 13,
      x: 7,
    },
    history: [] as string[],
    get currentCellCode(): string {
      return gameContext.maps[this.position.z][this.position.y][
        this.position.x
      ];
    },
    get currentMapCell() {
      return gameContext.mapKey[this.currentCellCode];
    },
    get env(): EnvType {
      return this.currentMapCell.env;
    },
    get combinedEnv(): ItemType[] {
      return Object.values(this.env).flat();
    },
  };

  constructor() {
    const window: any = globalThis;
    // gameContext is used to make `this` available from inside `this.state` getters
    gameContext = this;
    this.state = deepClone(this.initialState);
    this.commandList = initCommandModule(this);
    this.setCommandsFromCommandList(this.commandList);
    this.descriptions = descriptions;
    // make the setValue function available to the game
    window._ = this.setValue.bind(this);
    window.debugLog = [];
    // enable "start" and other essential commands
    this.bindInitialCommands();
    this.log.tiny("Game initialized.");
  }

  // This function is bound to each commands, and is called when the command is executed
  turnDaemon(
    commandName: string,
    interpreterFunction: (commandName: string) => void
  ) {
    const window = globalThis as any;
    if (this.state.gameOver) {
      this.displayText(this.descriptions.gameOver);
    } else {
      if (window.CONSOLE_GAME_DEBUG) {
        window.debugLog.push({ userInput: commandName });
      }

      try {
        // execute command
        interpreterFunction(commandName);

        if (!EXEMPT_COMMANDS.includes(commandName)) {
          // don't add to history or increment turn or timers if command is exempt
          this.addToHistory(commandName);
          if (!this.state.objectMode && !this.state.abortMode) {
            // only increment turn and timers if not in objectMode (prevents two-word commands from taking up two turns), and if not in abortMode (prevent a failed movement attempt, i.e. trying to move 'up' when you are only able to move 'east' or 'west', from consuming a turn)
            this.runTimers();
            this.state.turn++;
          }
          this.state.abortMode = false;
          if (this.state.verbose) {
            this.describeSurroundings();
          }
        }
        // to avoid printing 'undefined' when a command returns nothing
        return this.variableWidthDivider();
      } catch (error) {
        // recognized command word used incorrectly
        this.log.error(error);
        this.log.p("That's not going to work. Please try something else.");
        // to avoid printing 'undefined' when a command returns nothing
        return this.variableWidthDivider();
      }
    }
  }

  addToHistory(commandName: string) {
    this.state.history.push(commandName);
    setStorage("history", this.state.history);
  }

  // executes all timer functions
  runTimers() {
    this.timers.forEach((timer) => {
      timer(this);
    });
  }

  // registers a timer function
  registerTimer(timer: (gameContext: GameType) => void) {
    this.timers.push(timer);
  }

  displayText(
    text:
      | string
      | string[]
      | ((context: GameType, value?: any) => void)
      | ((context: GameType, value?: any) => string),
    value?: any
  ) {
    if (typeof text === "function") {
      const result = text(this, value);
      if (typeof result === "string") {
        this.displayText(result);
      }
    } else if (Array.isArray(text)) {
      text.forEach((line) => this.displayText(line));
    } else if (text) {
      this.log.p(text);
    }
  }

  // returns a list of items available in the current environment, as a formatted string
  itemsInEnvironment() {
    const env = this.state.currentMapCell.hideSecrets
      ? this.state.env.visibleEnv
      : [...this.state.env.visibleEnv, ...this.state.env.hiddenEnv];
    const listedItems = env.filter((item: ItemType) => item.listed);
    return (
      listedItems.length &&
      formatList(
        listedItems.map((item: ItemType) => `${item.article} ${item.name}`)
      )
    );
  }

  fromWhichEnv(itemName: string) {
    const itemsInEnvironment = this.state.combinedEnv.map(
      (item: ItemType) => item.name
    );
    if (!itemsInEnvironment.includes(itemName)) {
      return false;
    }
    const envEntries = Object.entries(this.state.env as EnvType);
    const theEnv = envEntries.reduce((env: string | false, entry) => {
      const names = entry[1].length ? entry[1].map((item) => item.name) : [];
      if (names.includes(itemName)) {
        env = entry[0];
      }
      return env;
    }, false);
    // return theEnv || "containedEnv";
    return theEnv;
  }

  inEnvironment(itemName: string) {
    if (itemName === "all") {
      return this.items._all;
    }
    const whichEnv = this.fromWhichEnv(itemName);
    const objectFromEnvironment = whichEnv
      ? this.state.env[whichEnv].filter(
          (item: ItemType) => item.name === itemName
        )[0]
      : false;
    return objectFromEnvironment;
  }

  // returns an object from the inventory, or the entire inventory
  inInventory(itemName: string) {
    if (itemName === "all") {
      return this.items._all;
    }
    const [objectFromInventory] = this.state.inventory.filter(
      (item: ItemType) => item.name === itemName
    );
    return objectFromInventory;
  }

  // returns a list of items available in the environment that are nested inside other objects, as a formatted string
  nestedItemString() {
    const openContainers = this.state.currentMapCell.openContainers;
    const containedItems = openContainers.map((obj: ItemType) => {
      const name = `${obj.article} ${obj.name}`; // the name of the container
      const objectNames = (obj as Record<string, any>).contents.map(
        (item: ItemType) => `${item.article} ${item.name}`
      ); // array of names of the objects inside the container (with articles)
      return [name, objectNames.length ? formatList(objectNames) : void 0];
    });

    const containedString = containedItems.map(
      (container: [string, string | undefined]) => {
        return container[1]
          ? `There is ${container[0]}, containing ${container[1]}.`
          : "";
      }
    );
    return containedString.join("\n");
  }

  formatList(list: string[]) {
    return formatList(list);
  }

  possibleMoves(z: number, y: number, x: number) {
    // Returns an array of directions (as strings) that player can move in from present location.
    const n =
      this.maps[z][y - 1] !== undefined && this.maps[z][y - 1][x] !== "*"
        ? "north"
        : false; // will equal the string "north" if it is possible to move one cell north, otherwise false
    const s =
      this.maps[z][y + 1] !== undefined && this.maps[z][y + 1][x] !== "*"
        ? "south"
        : false;
    const e =
      this.maps[z][y][x + 1] !== undefined && this.maps[z][y][x + 1] !== "*"
        ? "east"
        : false;
    const w =
      this.maps[z][y][x - 1] !== undefined && this.maps[z][y][x - 1] !== "*"
        ? "west"
        : false;
    const u =
      this.maps[z + 1] !== undefined && this.maps[z + 1][y][x] !== "*"
        ? "up"
        : false;
    const d =
      this.maps[z - 1] !== undefined && this.maps[z - 1][y][x] !== "*"
        ? "down"
        : false;
    let options = [n, s, e, w, u, d];
    let result = options.filter((dir) => dir);
    return result as string[];
  }

  // Applies formatList() utility function to the result of possibleMoves() function to return a formatted string listing the possible directions of player movement.
  movementOptions() {
    return formatList(
      this.possibleMoves(
        this.state.position.z,
        this.state.position.y,
        this.state.position.x
      ),
      true
    );
  }

  variableWidthDivider(width = window.innerWidth) {
    return ` `.repeat(width / 8);
  }

  // Returns a string containing the name of the current room, and the current turn number
  currentHeader(columnWidth = window.innerWidth) {
    const roomName = this.state.currentMapCell.name;
    const turn = `Turn : ${this.state.turn}`;
    const gapSize = columnWidth / 12 - roomName.length - turn.length;
    const gap = " ".repeat(gapSize);
    return `\n${roomName}${gap}${turn}\n`;
  }

  // describeSurroundings puts together various parts of game description, and outputs it as a single string
  describeSurroundings() {
    const description = this.state.currentMapCell.description;
    const itemStr = this.itemsInEnvironment()
      ? `You see ${this.itemsInEnvironment()} here.`
      : "";
    const nestedItemStr = this.nestedItemString();
    const moveOptions = `You can go ${this.movementOptions()}.`;
    this.log.header(this.currentHeader());
    this.log.p(
      description + "\n" + moveOptions + "\n" + itemStr + "\n" + nestedItemStr
    );
  }

  // Returns the history of the unfinished game, if it exists, as an array of strings (each string is a command)
  unfinishedGame() {
    return getStorage("history");
  }

  // Returns a list of saved games, as an array of strings (each string is a slot number)
  getSavedGames() {
    const keys = Object.keys(getStorage());
    const saves = keys.filter((key) => {
      return key.includes("ConsoleGame.save");
    });
    const slotList = saves.map((save) => {
      return save.slice(-2);
    });
    return slotList;
  }

  // saveGame() saves the current game state to local storage
  saveGame(slot: string) {
    const slotName = `save.${slot}`;
    if (getStorage(slotName) && !this.state.confirmMode) {
      // if the slot is already in use, ask for confirmation
      this.log.invalid("That save slot is already in use.");
      this.log.codeInline([
        `type `,
        `yes `,
        `to overwrite slot ${slot} with current game data.`,
      ]);
      this.state.confirmMode = true;
      this.confirmationCallback = () => this.saveGame(slot);
    } else {
      // otherwise, save the game
      this.state.saveMode = false;
      this.state.confirmMode = false;
      try {
        setStorage(slotName, this.state.history);
        this.log.info(`Game saved to slot ${slot}.`);
        this.describeSurroundings();
      } catch (err) {
        this.log.invalid(`Save to slot ${slot} failed.`);
        this.log.error(err);
      }
    }
  }

  // restoreGame() restores a saved game from local storage, given a slot number, and replays the game history
  async restoreGame(slotName: string) {
    this.state.restoreMode = false;
    const saveData = getStorage(`save.${slotName}`);
    await this.initializeNewGame();
    this.replayHistory(saveData);
    this.describeSurroundings();
  }

  // intro() is called at the beginning of the game
  intro() {
    // Greeting to be displayed at the beginning of the game
    this.displayText(descriptions.intro);
  }

  // captured() is called when the player is captured when trying to escape
  captured() {
    this.displayText((descriptions.captured as string[])[0]);
    this.state.position = this.state.startPosition;
    this.state.turn += 3;
    for (let i = 0; i < 3; i++) {
      this.commands.wait;
    }
    this.items._door.closed = true;
    this.items._door.locked = true;
    this.mapKey[this.items._door.lockedTarget].locked = true;
    this.mapKey[this.items._door.closedTarget].closed = true;
    this.displayText((descriptions.captured as string[])[1]);
  }

  // winner() is called when the player wins
  winner(text: string) {
    if (text) {
      this.displayText(text);
    }
    this.displayText(descriptions.winner, text);
    this.commands.score();
    removeStorage("history");
    this.state.gameOver = true;
    this.displayText(descriptions.gameOver);
  }

  // dead() is called when the player dies
  dead(text?: string) {
    this.displayText(descriptions.dead, text);
    removeStorage("history");
    this.state.gameOver = true;
    this.displayText(this.descriptions.gameOver);
  }

  // displayItem() displays a gallery item in the browser window
  displayItem(
    galleryItem = {
      title: "untitled",
      artist: "unknown",
      info: null,
      source: "",
      dimensions: null,
      width: null,
      height: null,
    }
  ) {
    const contentDiv = document.getElementById("console-game-content");
    if (contentDiv) {
      contentDiv.innerHTML = "";
      contentDiv.setAttribute(
        "style",
        "width:100vw;background-color:inherit;color:inherit;position:relative;display:flex;flex-direction:column;justify-content:center;align-content:center;"
      );
      const iFrame = document.createElement("iframe");
      iFrame.src = galleryItem.source;
      // iFrame.playsinline = true;
      // iFrame.autoplay = true;
      // iFrame.muted = true;
      iFrame.setAttribute(
        "style",
        `width:${
          galleryItem.width ? galleryItem.width : "min(38vw,720px)"
        };height:${
          galleryItem.height ? galleryItem.height : "min(25vw,480px)"
        };margin:auto`
      );
      const p = document.createElement("p");
      const title = document.createElement("h2");
      title.setAttribute("style", "color:inherit;");
      const artist = document.createElement("h2");
      artist.setAttribute("style", "color:inherit;");
      title.innerHTML = `Title: ${galleryItem.title}`;
      artist.innerHTML = `Artist: ${galleryItem.artist}`;
      p.appendChild(title);
      p.appendChild(artist);
      contentDiv.appendChild(iFrame);
      contentDiv.appendChild(p);
      if (galleryItem.info) {
        const info = document.createElement("p");
        info.innerHTML = galleryItem.info;
        info.setAttribute(
          "style",
          "color:inherit;font-style:italic;font-size:1em;padding-bottom:2em;"
        );
        contentDiv.appendChild(info);
      }
    }
    // window.scrollTo(0, 10000);
  }

  again () {
    const lastCommand = this.state.history[this.state.history.length - 1];
    const itemNames = Object.keys(this.items).map((key) => key.slice(1));
    if (itemNames.includes(lastCommand)) {
			const pendingActionFn = this.commands[this.state.pendingAction];
      // const [pendingActionFn] = this.commands.filter(
      //   (entry) => entry[1].split(",")[0] === this.state.pendingAction
      // )[0];
      pendingActionFn.call(this, this.state.pendingAction);
    }
    const lastCommandFn = this.commands[lastCommand];
    lastCommandFn.call(this, lastCommand);
  };

  // start() initializes a new game, or re-describes the surroundings if the game is already in progress
  async start() {
    const { turn, gameOver } = this.state;
    if (turn < 1 || gameOver) {
      await this.initializeNewGame();
      this.displayText(this.descriptions.preface);
    }
    this.describeSurroundings();
  }

  resetGame() {
    this.state = deepClone(this.initialState);
    this.state.dogName = randomDogName();
    removeStorage("history");
  }

  /* 
  *bindCommandToFunction() creates a property on the global object with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the property. 
  This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
  Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his console adventure here: https://rawgit.com/secretGeek/console-adventure/master/log.html
  */
  bindCommandToFunction(
    interpreterFunction: (command: string) => void,
    commandAliases: string,
    daemon = this.turnDaemon
  ) {
    const aliasArray = commandAliases.split(",");
    // Use the first alias as the command name
    const [commandName] = aliasArray;
    // If a daemon function is provided, it will be invoked with the command name and the interpreter function as arguments. Otherwise, the interpreter function will be invoked with the command name as an argument.
    const interpretCommand = daemon
      ? daemon.bind(this, commandName, interpreterFunction.bind(this))
      : interpreterFunction.bind(this, commandName);
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
  initCommands(commands: CommandAlias[]) {
    commands.forEach((commandEntry) => {
      let [interpreterFunction, aliases] = commandEntry;
      this.bindCommandToFunction(interpreterFunction, aliases);
    });
  }

  addToInventory(itemArray: (ItemType | string)[]) {
    // add one of more items to player inventory
    itemArray.forEach((item) => {
      if (typeof item === "string") {
        // accepts a string argument for a single item
        this.state.inventory.push(this.items[`_${item}`]);
      } else {
        this.state.inventory.push(item); // accepts an array for multiple items
      }
    });
  }

  removeFromInventory(item: ItemType | string) {
    // remove item from player inventory
    const filtered = this.state.inventory.filter((invItem: ItemType) => {
      if (typeof item === "string") {
        return invItem.name !== item;
      }
      return invItem.name !== item.name;
    });
    this.state.inventory = filtered;
  }

  setCommandsFromCommandList(commandList: CommandAlias[]) {
    // this.commandList = commandList;
    this.commands = this.commandList.reduce(
      (commandMap, commandEntry: CommandAlias) => {
        const [interpreterFunction, aliases] = commandEntry;
        const [commandName] = aliases.split(",");
        commandMap[commandName.trim()] = interpreterFunction.bind(this);
        return commandMap;
      },
      {} as Record<string, (command: string) => void>
    );
  }

  // initializeNewGame() is called when the game is started, or when the player dies and the game is restarted
  async initializeNewGame() {
    this.resetGame();
    this.maps = maps;
    this.descriptions = descriptions;
    this.items = deepClone(await initItemsModule(this));
    this.commandList = initCommandModule(this);
    this.setCommandsFromCommandList(this.commandList);
    this.initCommands(this.commandList);
    this.mapKey = deepClone(initMapKeyModule(this));
    // fill inventory with starting items
    this.addToInventory(["no_tea", "me"]);
    // set timers
    timers.forEach((timer) => {
      this.registerTimer(timer);
    });
  }

  // replayHistory() takes an array of commands and replays them in order, restoring the game state to the point at which the array was generated
  replayHistory(commandList: string[]) {
    // Used to load saved games
    this.state.restoreMode = false;
    this.log.groupCollapsed("Game loading..."); // This conveniently hides all of the console output that is generated when the history is replayed, by nesting it in a group that will be displayed collapsed by default
    commandList.forEach((command) => {
      // replay each command in order
      Function(`${command}`)(); // execute the command
    });

    this.log.groupEnd("Game loaded."); // text displayed in place of collapsed group
  }

  // bindInitialCommands() binds the commands essential to start the game to the global object, so that they can be invoked by the player in the console without needing to type the invocation operator "()" after the name.
  bindInitialCommands() {
    // enable "start" and other essential commands
    const initialCommands: CommandAlias[] = [
      [this.start, cases("start", "begin")],
      [this.commands.resume, cases("resume")],
      [this.commands.help, cases("help") + ",h,H,ayuda"],
      [this.commands.restore, cases("restore", "load")],
      [this.commands.quit, cases("quit", "restart")],
      [this.commands.save, cases("save")],
      [this.commands._0, "_0"],
      [this.commands._1, "_1"],
      [this.commands._2, "_2"],
      [this.commands._3, "_3"],
      [this.commands._4, "_4"],
      [this.commands._5, "_5"],
      [this.commands._6, "_6"],
      [this.commands._7, "_7"],
      [this.commands._8, "_8"],
      [this.commands._9, "_9"],
      [this.commands.font, cases("font")],
      [this.commands.color, cases("color")],
      [this.commands.size, cases("size")],
    ];
    this.initCommands(initialCommands);
  }

  solveCode(value: any) {
    // solve code
    value = String(value);
    this.state.solveMode = false;
    const puzzles = this.state.combinedEnv.filter(
      (item: ItemType) => item.solution
    );
    console.log("puzzles: ", puzzles);
    console.log("value: ", value)
    if (puzzles.length) {
      const solved = puzzles.filter(
        (puzzle: ItemType) => puzzle.solution === value
      );
      if (solved.length === 0) {
        puzzles.forEach(
          (unsolved: ItemType) =>
            unsolved.incorrectGuess && unsolved.incorrectGuess()
        );
      } else {
        solved.forEach(
          (pzl: ItemType) => pzl.correctGuess && pzl.correctGuess()
        );
      }
    }
  }

  // setPreference() is used to set a preference (font, size, color) that will be applied when the game is reloaded
  setPreference(value: any) {
    // set preference
    this.log.info(
      `Value for ${this.state.pendingAction} will be set to ${value}`
    );
    setStorage(`prefs.${this.state.pendingAction}`, value);
    setStorage("prefMode", "true");
    this.log.info("Reload the page to apply the new preference.");
  }

  // setValue() is used to set a value in the game state, either by solving a puzzle, or by setting a preference
  setValue(value: any) {
    if (this.state.solveMode) {
      this.solveCode(value);
    } else if (this.state.prefMode) {
      this.setPreference(value);
    } else {
      this.log.invalid("setValue _() called out of context.");
    }
    return this.variableWidthDivider();
  }

  // toggleVerbosity() is used to toggle the verbosity of the game's output. If verbose mode is on, then describeSurroundings() will be called every on every turn, not just when the player moves.
  toggleVerbosity() {
    if (this.state.verbose) {
      this.state.verbose = false;
      this.log.p("Verbose mode off.");
    } else {
      this.state.verbose = true;
      this.log.p("Maximum verbosity.");
    }
  }
}

export type GameType = InstanceType<typeof Game>;
