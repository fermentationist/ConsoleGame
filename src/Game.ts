import storage from "./utils/storage";
import log from "./utils/customConsole/index";
import { randomDogName } from "./utils/dogNames";
import initCommandModule, { CommandAlias } from "./commands";
import initItemsModule, { ItemType } from "./items/index";
import initMapKeyModule, { EnvType } from "./maps/mapKey";
import maps from "./maps/maps";
import descriptions from "./descriptions";
import {
  deepClone,
  formatList,
  cases,
  aliasString,
  cropFloorMap,
} from "./utils/helpers";
import thesaurus from "./utils/thesaurus";
import TurnDaemon from "./TurnDaemon";
import CommandBinder from "./CommandBinder";

const { getStorage, removeStorage, setStorage } = storage;

let gameContext: any;

export default class Game {
  state = {} as Record<string, any>;
  maps = [] as string[][][];
  mapKey = {} as Record<string, any>;
  items = {} as any;
  commands = {} as any;
  commandList = [] as CommandAlias[];
  timeLimit = 300;
  log = log;
  confirmationCallback = () => {};
  lightSources = [] as ItemType[];
  descriptions = {} as Record<string, any>;
  turnDaemon = null as InstanceType<typeof TurnDaemon> | null;
  commandBinder = null as InstanceType<typeof CommandBinder> | null;
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
    // make the setValue function available to the game. It should not be bound to a command name, like the other commands, because it needs to be invoked with arguments.
    window._ = this.setValue.bind(this);
    window.debugLog = [];
    // enable "start" and other essential commands
    this.descriptions = descriptions;
    this.turnDaemon = new TurnDaemon(this);
    this.commandBinder = new CommandBinder(this);
    this.bindInitialCommands();
    this.log.tiny("Game initialized.");
  }

  /**
   * =====================
   * Initialization methods
   * =====================
   */

  // bindInitialCommands() binds the commands essential to start the game to the global object, so that they can be invoked by the player in the console without needing to type the invocation operator "()" after the name.
  bindInitialCommands() {
    // enable "start" and other essential commands
    const initialCommands: CommandAlias[] = [
      [this.start, aliasString("start", thesaurus)],
      [this.resume, cases("resume")],
      [this.help, aliasString("help", thesaurus)],
      [this.restore, cases("restore", "load")],
      [this.quit, cases("quit", "restart")],
      [this.save, cases("save")],
      [this.saveSlot, "_0"],
      [this.saveSlot, "_1"],
      [this.saveSlot, "_2"],
      [this.saveSlot, "_3"],
      [this.saveSlot, "_4"],
      [this.saveSlot, "_5"],
      [this.saveSlot, "_6"],
      [this.saveSlot, "_7"],
      [this.saveSlot, "_8"],
      [this.saveSlot, "_9"],
      [this.pref, cases("font")],
      [this.pref, cases("color")],
      [this.pref, cases("size")],
      [this.yes, cases("yes") + ",y,Y"],
    ];
    this.commandBinder?.bindCommands(initialCommands);
  }

  // initializeNewGame() is called when the game is started, or when the player dies and the game is restarted
  initializeNewGame() {
    this.resetGame();
    this.maps = maps;
    this.descriptions = descriptions;
    this.items = deepClone(initItemsModule(this));
    this.commandList = initCommandModule(this);
    this.commands = this.getCommandsObject(this.commandList);
    this.commandBinder?.bindCommands(this.commandList);
    this.mapKey = initMapKeyModule(this);
    // fill inventory with starting items
    this.addToInventory(["no_tea", "me"]);
  }

  resetGame() {
    this.state = deepClone(this.initialState);
    this.state.dogName = randomDogName();
    removeStorage("history");
    this.state.gameOver = false;
  }

  // getCommandsObject() takes an array of CommandAliases and returns an object containing the command names as keys and the interpreter functions as values
  getCommandsObject(commandList: CommandAlias[]) {
    return commandList.reduce((commandMap, commandEntry: CommandAlias) => {
      const [interpreterFunction, aliases] = commandEntry;
      const [commandName] = aliases.split(",");
      commandMap[commandName.trim()] = interpreterFunction.bind(this);
      return commandMap;
    }, {} as Record<string, (command: string) => void>);
  }

  /**
   * =====================
   * Game state methods
   * =====================
   */

  addToHistory(commandName: string) {
    this.state.history.push(commandName);
    setStorage("history", this.state.history);
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

  // Returns the history of the unfinished game, if it exists, as an array of strings (each string is a command)
  unfinishedGame() {
    return getStorage("history");
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

  // given the name of an item, returns the object from the environment
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

  /**
   * =====================
   * Game output methods
   * =====================
   */

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
    this.quit();
  }

  // dead() is called when the player dies
  dead(text?: string) {
    this.displayText(descriptions.dead, text);
    this.quit();
  }

  getFloorMap(crop = true) {
    const currentPosition = this.state.position;
    const floorMap = this.maps[currentPosition.z].map((row) => {
      return row.map((cell) => (cell === "*" ? "⬛️" : "🌫") as any);
    });
    floorMap[currentPosition.y].splice(currentPosition.x, 1, "⭐️");
    return crop ? cropFloorMap(floorMap) : floorMap;
  }

  // displayHTMLMap() displays the map in the browser window
  displayHTMLMap(map: string[][]) {
    const contentDiv = document.getElementById("console-game-content");
    if (contentDiv) {
      contentDiv.innerHTML = "";
      contentDiv.setAttribute(
        "style",
        "width:100vw;background-color:inherit;color:inherit;position:relative;display:flex;flex-direction:column;justify-content:center;align-content:center;"
      );
      const mapDiv = document.createElement("div");
      mapDiv.setAttribute(
        "style",
        "width:100vw;height:100vh;position:absolute;top:0;left:0;overflow:auto;"
      );
      const mapTable = document.createElement("table");
      mapTable.setAttribute(
        "style",
        "width:100vw;height:100vh;position:absolute;top:0;left:0;overflow:auto;border:none;"
      );
      map.forEach((row) => {
        const mapRow = document.createElement("tr");
        mapRow.setAttribute("style", "border:none;");
        row.forEach((cell) => {
          const mapCell = document.createElement("td");
          if (cell === "⭐️") {
            mapCell.innerHTML = cell;
          }
          // mapCell.innerHTML = cell;
          mapCell.setAttribute(
            "style",
            `width:1em;height:1em;font-size:1em;text-align:center;vertical-align:middle;${
              cell === "⬛️"
                ? "background-color:black;border:none;"
                : "background-color:white;"
            }`
          );
          mapRow.appendChild(mapCell);
        });
        mapTable.appendChild(mapRow);
      });
      mapDiv.appendChild(mapTable);
      contentDiv.appendChild(mapDiv);
    }
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
      this.turnDaemon?.removeTimer("map");
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

  again() {
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
  }

  help() {
    this.displayText(descriptions.help);
  }

  // start() initializes a new game, or re-describes the surroundings if the game is already in progress
  start() {
    const { turn, gameOver } = this.state;
    if (!turn || gameOver) {
      this.initializeNewGame();
      this.displayText(this.descriptions.preface);
    }
    this.describeSurroundings();
  }

  resume() {
    const unfinishedGame = this.unfinishedGame();
    this.state.prefMode = false;
    if (unfinishedGame?.length) {
      this.resetGame();
      this.initializeNewGame();
      this.replayHistory(unfinishedGame);
      this.describeSurroundings();
    } else if (this.state.turn) {
      this.describeSurroundings();
    } else {
      this.start();
    }
  }

  restore(command: string) {
    const slotList = this.getSavedGames();
    if (slotList.length > 0) {
      this.displayText(this.descriptions.restore, slotList);
      this.state.restoreMode = true;
      this.state.saveMode = false;
      this.state.pendingAction = command;
    } else {
      return this.log.invalid("No saved games found.");
    }
  }

  quit() {
    this.commands.score();
    removeStorage("history");
    this.state.gameOver = true;
    this.displayText(this.descriptions.gameOver);
  }

  save(command: string) {
    this.state.saveMode = true;
    this.state.restoreMode = false;
    this.state.pendingAction = command;
    this.displayText(this.descriptions.save);
  }

  saveSlot(slotNumber: string) {
    if (this.state.saveMode) {
      try {
        return this.saveGame(slotNumber);
      } catch (err) {
        this.log.invalid(`Save to slot ${slotNumber} failed.`);
        this.log.error(err);
      }
    } else if (this.state.restoreMode) {
      try {
        this.restoreGame(slotNumber);
        this.state.restoreMode = false;
      } catch (err) {
        this.log.invalid(`Restore from slot ${slotNumber} failed.`);
        return this.log.error(err);
      }
    } else {
      this.log.invalid("Operation failed.");
    }
  }

  pref(whichPref: string) {
    this.state.prefMode = true;
    this.state.pendingAction = whichPref;
    this.log.codeInline([
      `To set the value of ${whichPref}, you must type an underscore `,
      `_`,
      `, followed by the value enclosed in backticks `,
      `\``,
      `.`,
    ]);
    this.log.codeInline([`For example: `, `_\`value\``]);
  }

  yes() {
    if (!this.state.confirmMode) {
      this.log.p("nope.");
    } else {
      this.state.confirmMode = false;
      if (this.confirmationCallback) {
        return this.confirmationCallback();
      }
    }
  }

  // saveGame() saves the current game state to local storage
  saveGame(slot: string, confirmOverwrite = false) {
    const slotName = `save.${slot}`;
    if (getStorage(slotName) && !confirmOverwrite) {
      // if the slot is already in use, ask for confirmation
      this.log.invalid("That save slot is already in use.");
      this.log.codeInline([
        `type `,
        `yes `,
        `to overwrite slot ${slot} with current game data.`,
      ]);
      this.state.confirmMode = true;
      this.confirmationCallback = () => this.saveGame(slot, true);
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
  restoreGame(slotName: string) {
    this.state.restoreMode = false;
    const saveData = getStorage(`save.${slotName}`);
    this.initializeNewGame();
    this.replayHistory(saveData);
    this.describeSurroundings();
  }

  solveCode(value: any) {
    // solve code
    value = String(value);
    this.state.solveMode = false;
    const puzzles = this.state.combinedEnv.filter(
      (item: ItemType) => item.solution
    );
    console.log("puzzles", puzzles)
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
      // setValue is not bound to turnDaemon, so we need to call addToHistory() manually, but only if we're in solveMode
      this.addToHistory(`_("${value}")`);
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
