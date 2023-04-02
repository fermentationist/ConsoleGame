import { pStyle } from "./utils/prefs";
import thesaurus from "./utils/thesaurus";
import maps from "./maps/maps";
import { cases, formatList } from "./utils/helpers";
import { GameType } from "./Game";
import { ItemType } from "./items/Item";

export type CommandAlias = [(command: string) => void, string];

// Command functions
const Commands = function (game: GameType): CommandAlias[] {
  // Change player's location on the map, given a direction
  const _movePlayer = (direction: string) => {
    game.state.objectMode = false;
    let newPosition = {
      x: game.state.position.x,
      y: game.state.position.y,
      z: game.state.position.z,
    };
    switch (direction) {
      case "north":
        newPosition.y = newPosition.y - 1;
        break;
      case "south":
        newPosition.y = newPosition.y + 1;
        break;
      case "east":
        newPosition.x = newPosition.x + 1;
        break;
      case "west":
        newPosition.x = newPosition.x - 1;
        break;
      case "up":
        newPosition.z = newPosition.z + 1;
        break;
      case "down":
        newPosition.z = newPosition.z - 1;
        break;
      default:
        break;
    }
    const newCell = maps[newPosition.z][newPosition.y][newPosition.x];
    // Exit function if movement in given direction is not possible due to map boundary
    if (newCell === "*") {
      game.log.p("You can't go that direction.");
      game.state.abortMode = true; // don't count failed move as a turn; don't increment timers
      return;
    }
    // Display message and exit function if path to next space is blocked by a locked or closed door or analagous item
    if (game.mapKey[newCell].locked || game.mapKey[newCell].closed) {
      game.log.p("The way is blocked.");
      game.log.p(
        game.mapKey[newCell].lockText &&
          (game.mapKey[newCell].locked || game.mapKey[newCell].closed)
          ? game.mapKey[newCell].lockText
          : ""
      );
      return;
    }
    // If movement in direction is possible, update player position
    game.log.p(`You walk ${direction}...`);
    game.state.position = {
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
    };
    // End by describing new environment after move
    return game.describeSurroundings();
  };

  // Describe environment and movement options in current location
  const _look = (command: string) => {
    return game.describeSurroundings();
  };

  const _smell = (command: string) => {
    game.log.p(game.state.currentMapCell.smell);
    return;
  };

  const _listen = (command: string) => {
    game.log.p(game.state.currentMapCell.sound);
    return;
  };

  // Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.
  const _act_upon = (command: string) => {
    game.state.objectMode = true;
    game.state.pendingAction = command;
    game.log.p(`What would you like to ${command}?`);
  };

  // _none function is bound to commands that should do nothing at all
  const _none = () => {}; // do nothing

  const _wait = () => {
    game.log.p("Time passes...");
  };

  const _go = () => {
    game.log.p("Which direction do you want to go?");
  };

  // Displays items in the player's inventory.
  const _inventory = (command: string) => {
    let items: string[] = [],
      itemsPlusArticles: string[] = [];
    game.state.inventory.forEach((item: ItemType) => {
      if (item.listed) {
        items.push(item.name);
        const itemWithArticle = item.article
          ? `${item.article} ${item.name}`
          : item.name;
        itemsPlusArticles.push(itemWithArticle);
      }
    });

    let segments = `You are carrying ${formatList(itemsPlusArticles)}`.split(
      " "
    );

    let itemStyle = `font-size:120%;color:cyan;font-style:italic;`;

    let styles = segments.map((word) => {
      let style = pStyle;
      items.map((thing) => {
        if (word.includes(thing)) {
          style = itemStyle;
        }
      });
      return style;
    });

    segments = segments.map((word, i) => {
      return i === segments.length - 1 ? `${word}.` : `${word} `;
    });
    return game.log.inline(segments, styles);
  };

  // Displays inventory as a table.
  const _inventoryTable = (command: string) => {
    const table = game.state.inventory.map((item: ItemType) => {
      const { name, description } = item;
      return { name, description };
    });
    return game.log.table(table, ["name", "description"]);
  };

  // Handles commands that are item names.
  const _items = (itemName: string) => {
    // Exit function with error message if previous command does not require an object
    if (!game.state.objectMode && itemName !== "maps") {
      game.log.invalid("Invalid command.");
      return;
    }
    // Exit function with error message if item is not available in player inventory or current location.
    const item = game.inEnvironment(itemName) || game.inInventory(itemName);
    if (!item) {
      game.state.objectMode = false;
      game.log.p(`The ${itemName} is unavailable.`);
      return;
    }
    const action = game.state.pendingAction;
    // invoke the item's method that corresponds to the selected action
    item[action]();
  };

  const _start = () => {
    game.start();
  };

  const _resume = async () => {
    const unfinishedGame = game.unfinishedGame();
    game.state.prefMode = false;
    if (unfinishedGame?.length) {
      await game.initializeNewGame();
      console.log("calling replayHistory");
      game.replayHistory(unfinishedGame);
      game.describeSurroundings();
    } else if (game.state.turn) {
      game.describeSurroundings();
    } else {
      game.commands.start();
    }
  };

  const _help = () => {
    game.displayText(game.descriptions.help);
  };

  const _restore = (command: string) => {
    const slotList = game.getSavedGames();
    if (slotList.length > 0) {
      game.displayText(game.descriptions.restore, slotList);
      game.state.restoreMode = true;
      game.state.saveMode = false;
      game.state.pendingAction = command;
    } else {
      return game.log.invalid("No saved games found.");
    }
  };

  const _save = (command: string) => {
    game.state.saveMode = true;
    game.state.restoreMode = false;
    game.state.pendingAction = command;
    game.displayText(game.descriptions.save);
  };

  const _save_slot = (slotNumber: string) => {
    if (game.state.saveMode) {
      try {
        return game.saveGame(slotNumber);
      } catch (err) {
        game.log.invalid(`Save to slot ${slotNumber} failed.`);
        game.log.error(err);
      }
    } else if (game.state.restoreMode) {
      try {
        game.restoreGame(slotNumber);
        game.state.restoreMode = false;
      } catch (err) {
        game.log.invalid(`Restore from slot ${slotNumber} failed.`);
        return game.log.error(err);
      }
    } else {
      game.log.invalid("Operation failed.");
    }
  };

  const _quit = () => {
    game.initializeNewGame();
    game.start();
  };

  const _pref = (whichPref: string) => {
    game.state.prefMode = true;
    game.state.pendingAction = whichPref;
    game.log.codeInline([
      `To set the value of ${whichPref}, you must type an underscore `,
      `_`,
      `, followed by the value enclosed in backticks `,
      `\``,
      `.`,
    ]);
    game.log.codeInline([`For example: `, `_\`value\``]);
  };

  const _yell = () => {
    game.log.scream("Aaaarrgh!!!!");
  };

  const _yes = () => {
    if (!game.state.confirmMode) {
      game.log.p("nope.");
    } else {
      game.state.confirmMode = false;
      if (game.confirmationCallback) {
        return game.confirmationCallback();
      }
    }
  };

  const _verbose = () => {
    if (game.state.verbose) {
      game.state.verbose = false;
      game.log.p("Verbose mode off.");
      return;
    }
    game.state.verbose = true;
    game.log.p("Maximum verbosity.");
  };

  const _score = () => {
    console.log("game.state", game.state);
    game.log.p(
      `Your score is ${game.state.score} in ${game.state.turn} turns.`
    );
  };

  const _commands = () => {
    const commandAliases = game.commandList.map(
      ([_, aliases]: CommandAlias) => aliases
    );
    const commandTable = commandAliases.reduce((map, aliases) => {
      const [commandName, ...aliasList] = aliases.split(",");
      map[commandName] = aliasList.join(", ");
      return map;
    }, {} as Record<string, string>);
    game.log.table(commandTable);
  };

  const _again = () => {
    game.again();
  };

  const _poof = () => {
    const body = document.querySelector("body");
    body?.parentNode?.removeChild(body);
    return game.log.papyracy(">poof<");
  };

  // const _papyracy = () => {
  // 	// game.state.pendingAction = "font"
  // 	game.state.prefMode = true;
  // 	// game.setPreference("papyrus");
  // 	localStorage.setItem("ConsoleGame.prefs.font", "papyrus");
  // 	localStorage.setItem("ConsoleGame.prefMode", "true");
  // 	// game.state.prefMode = false;
  // 	location.reload();
  // }

  const aliasString = (
    word: string,
    thesaurus?: Record<string, string[]>,
    optionalString = ""
  ) => {
    // thesaurus will be added to params
    let variations: string[] = [];
    if (thesaurus) {
      const synonyms = thesaurus?.[word] || [];
      variations = synonyms.map((synonym: string) => cases(synonym));
    }
    const output = `${cases(word)}${
      variations.length ? "," + variations.join() : ""
    }${optionalString ? "," + optionalString : ""}`;
    return output;
  };

  // Commands and their aliases
  const commandAliases: CommandAlias[] = [
    // Move
    [_movePlayer, cases("north") + ",n,N"],
    [_movePlayer, cases("south") + ",s,S"],
    [_movePlayer, cases("east") + ",e,E"],
    [_movePlayer, cases("west") + ",w,W"],
    [_movePlayer, cases("up") + ",u,U"],
    [_movePlayer, cases("down") + ",d,D"],

    // Direct Actions
    [_go, aliasString("go", thesaurus)],
    [_inventory, aliasString("inventory", thesaurus) + ",i,I"],
    [_listen, aliasString("listen", thesaurus)],
    [_look, aliasString("look", thesaurus) + ",l,L"],
    [_smell, aliasString("smell", thesaurus)],
    [_wait, aliasString("wait", thesaurus) + ",z,Z,zzz,ZZZ,Zzz"],
    [_yell, aliasString("yell", thesaurus)],
    [_again, aliasString("again", thesaurus) + ",g,G"],

    // Item methods
    [_act_upon, aliasString("burn", thesaurus)],
    [_act_upon, aliasString("climb", thesaurus)],
    [_act_upon, aliasString("close", thesaurus)],
    [_act_upon, aliasString("contemplate", thesaurus)],
    [_act_upon, aliasString("drink", thesaurus)],
    [_act_upon, aliasString("drop", thesaurus)],
    [_act_upon, aliasString("eat", thesaurus)],
    [_act_upon, aliasString("examine", thesaurus) + ",x,X"],
    [_act_upon, aliasString("extinguish", thesaurus)],
    [_act_upon, aliasString("flush", thesaurus)],
    // [_act_upon, aliasString("hide", thesaurus)],
    [_act_upon, aliasString("light", thesaurus)],
    [_act_upon, aliasString("lock", thesaurus)],
    [_act_upon, aliasString("move", thesaurus)],
    [_act_upon, aliasString("open", thesaurus)],
    [_act_upon, aliasString("play", thesaurus)],
    [_act_upon, aliasString("project", thesaurus)],
    [_act_upon, aliasString("pull", thesaurus)],
    [_act_upon, aliasString("read", thesaurus)],
    [_act_upon, aliasString("rezrov", thesaurus)],
    [_act_upon, aliasString("frotz", thesaurus)],
    [_act_upon, aliasString("cast", thesaurus)],
    [_act_upon, aliasString("rescue", thesaurus)],
    [_act_upon, aliasString("spray", thesaurus)],
    [_act_upon, aliasString("take", thesaurus)],
    [_act_upon, aliasString("turn", thesaurus)],
    [_act_upon, aliasString("unlock", thesaurus)],
    [_act_upon, aliasString("use", thesaurus)],

    // Misc
    [_commands, cases("commands") + ",c,C"],
    [_help, cases("help") + ",h,H"],
    [_inventoryTable, cases("inventoryTable", "invTable", "invt")],
    [_verbose, cases("verbose")],
    [_yes, cases("yes") + ",y,Y"],
    [_score, cases("score")],
    [_pref, cases("font")],
    [_pref, cases("color")],
    [_pref, cases("size")],
    // [_items, cases("dog", game.state.dogName)],

    // Start/QUIT
    [_start, cases("start", "begin", "commence")],
    [_resume, cases("resume", "proceed")],
    [_restore, cases("restore", "load")],
    [_quit, cases("quit", "restart")],
    [_quit, cases("restart")],

    // Save/Restore
    [_save, cases("save")],
    [_save_slot, "_0"],
    [_save_slot, "_1"],
    [_save_slot, "_2"],
    [_save_slot, "_3"],
    [_save_slot, "_4"],
    [_save_slot, "_5"],
    [_save_slot, "_6"],
    [_save_slot, "_7"],
    [_save_slot, "_8"],
    [_save_slot, "_9"],

    // Other
    [_poof, cases("poof")],

    // this command exists as a kludgy fix for a bug that happens if console is in "eager evaluation" mode. Starting to type "glove" auto-evaluates to "globalThis", which for some reason calls _act_upon("close"). This same goes for the keyword "this". This command tricks auto-evaluation because it prioritizes suggestions alphabetically.
    [_none, cases("globaa")],
    [_none, cases("thia")],
  ];
  const itemNames = Object.keys(game.items).map((itemName) =>
    itemName.slice(1)
  );
  const itemAliases: CommandAlias[] = itemNames.map((itemName) => [
    _items,
    aliasString(itemName, thesaurus),
  ]);
  const aliases = [...commandAliases, ...itemAliases];

  return aliases;
};

export default Commands;
