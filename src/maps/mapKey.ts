import { GameType } from "../Game";
import MapCell from "./MapCell";
export { EnvType } from "./MapCell";
import { formatList } from "../utils/helpers";
import { ItemType } from "../items";

const mapKey = function (game: GameType) {
  // Prototype definition for a single cell on the map grid (usually a room)
  const MapCellProto = MapCell(game);

	const setMapCellPrototypes = (mapKey: Record<string, Record<string, any>>, proto = MapCellProto) => {
		Object.keys(mapKey).forEach((cell) => {
			Object.setPrototypeOf(mapkey[cell], proto);
		});
	}

	const stockDungeon = (mapKey: Record<string, Record<string, any>>) => {
    Object.keys(mapKey).forEach((key) => {
			const subEnvNames = Object.keys(mapKey[key]).filter(keyName => keyName.toLowerCase().includes("env"));
			for (const subEnvName of subEnvNames) {
				let roomEnv = mapKey[key][subEnvName];
				let newEnv: ItemType[] = [];
				if (roomEnv.length){
					roomEnv.forEach((item: string | ItemType) => {
						let itemObj = typeof item === "string" ? game.items[`_${item}`] : item;
						if (itemObj) {
							newEnv.push(itemObj);
						} else {
							console.log(`Cannot stock ${item}. No such item.`);
						}
					});
				}
				mapKey[key][subEnvName] = newEnv;
			}
		});
  }

  const mapkey: Record<string, Record<string, any>> = {
    "0": {
      locked: true,
      lockText:
        "An attempt has been made to board up this door. Reaching between the unevenly spaced boards, you try the doorknob and discover that it is also locked.",
    },

    A: {
      name: "Freedom!",
      locked: false,
      closed: true,
      get lockText() {
        return `The formidable wooden front door will not open. It looks as old as the rest of the building, and like the wood panelled walls of the entrance hall, it is dark with countless layers of murky varnish. It is ${
          this.locked ? "locked" : "unlocked"
        }.`;
      },
      get description() {
        if (game.state.turn < 3) {
          game.captured();
          return game.variableWidthDivider();
        }
        game.state.score += 50;
        game.winner("\nYou have escaped!\n");
        return game.variableWidthDivider();
      },
    },

    a: {
      name: "Freedom!",
      locked: true,
      closed: true,
      get lockText() {
        return `The kitchen door will not open. It is ${
          this.locked ? "locked" : "unlocked"
        }.`;
      },
      get description() {
        if (game.state.turn < 3) {
          game.captured();
          return "";
        }
        return game.winner("\nYou have escaped!\n");
      },
    },

    B: {
      name: "Basement",
      description:
        "A single dim bulb, dangling on a cord from the low, unfinished ceiling, is barely enough to illuminate the room. The floors appear to be composed of compressed earth, left unfinished since the space was initially excavated more than a century ago.  ",
      smell:
        "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces.",
      get sound() {
        return `You can hear a dog barking. The sound is emanating from the room north of you. It is loud enough now for you to recognize it as ${game.state.dogName}'s bark!`;
      },
    },

    C: {
      name: "Dark room",
      hiddenSecrets: true,
      get des1() {
        return `As you walk into the dark room, it feels as if the increasingly uneven floor is sloping downward, though you can see nothing. \nIt is pitch black. You are likely to be eaten by a grue. \nSomewhere in the dark, you can hear ${game.state.dogName} barking excitedly!`;
      },
      get des2() {
        return `By the flickering light of the flame, you can see that the floor becomes rougher and more irregular, sloping down toward the north.`;
      },
      smell:
        "It smells strongly of old, damp dungeon – a mix of dirt and mildew with perhaps a hint of grue feces.",
      get description(): string {
        // @ts-ignore - this property will be available when the object's prototype is set later
        return this.hideSecrets ? this.des1 : this.des2;
      },
      hiddenEnv: ["lantern", "basement_door"],
      visibleEnv: ["grue"],
    },

    D: {
      name: "Bathroom",
      description:
        "The bathroom is tiled with hundreds of tiny, white, hexagonal tiles. It features the usual bathroom amenities, like a sink, a tub and a commode.",
      visibleEnv: ["sink", "bathtub", "toilet", "knife"],
    },
    E: {
      name: "Guest Room",
      description:
        "The guest room is modestly furnished, with little more than a small bed and a dresser.",
      visibleEnv: ["bed", "dresser", "dresser_drawer"],
    },
    F: {
      name: "Sitting room",
      description:
        "A small sitting room adjoins the master bedroom. It contains a cushioned armchair and a small sofa, both facing a coffee table.",
      visibleEnv: ["chair", "sofa", "coffee_table", "photo"],
    },
    G: {
      name: "Master bedroom",
      get description() {
        return `The master bedroom is spacious though sparsely furnished, containing only a bedframe, a wardrobe and a nightstand`;
      },
      visibleEnv: ["bed", "nightstand", "nightstand_drawer", "wardrobe"],
    },
    H: {
      name: "Master bathroom",
      description:
        "The bathroom adjoining the bedroom has all of the expected fixtures, though they are corroded and covered in filth. ",
      visibleEnv: ["toilet", "sink", "bathtub"],
    },
    I: {
      name: "Cell",
      description: "It is a dark and scary cell.",
      locked: true,
      closed: true,
      smell: "It smells like dog waste.",
      get lockText() {
        return `An ominous-looking, rusted steel door blocks your path. It is ${
          this.locked ? "locked" : "unlocked"
        }.`;
      },
      visibleEnv: ["dog"],
    },
    J: {
      name: "Parlor",
      get description() {
        return `This room looks like it was used to screen films and recordings. There is a tall white pedestal${
          game.inEnvironment("projector")
            ? ", supporting a squarish plastic Super 8 projector,"
            : ""
        } in the center of the room. `;
      },
      visibleEnv: ["projector", "screen", "pedestal", "chair", "phonograph"],
    },
    "^": {
      name: "Second floor hallway, north",
      description:
        "You are at the top of a wide wooden staircase, on the second floor of the old house.",
      visibleEnv: [],
    },

    "-": {
      name: "Second floor hallway, south",
      description:
        "It looks like there are a couple of rooms on either side of the broad hallway, and a small broom closet at the south end.",
      visibleEnv: [],
    },

    "+": {
      name: "Study",
      visibleDescription:
        "The walls of the dark, wood-panelled study are lined with bookshelves, containing countless dusty tomes. Behind an imposing walnut desk is a tall-backed desk chair.",
      smell:
        "The pleasantly musty smell of old books emanates from the bookshelves that line the wall.",
      hideSecrets: true,
      visibleEnv: [
        "desk",
        "painting",
        "chair",
        "bookshelves",
        "books",
        "drawer",
        "booklet",
      ],
      hiddenEnv: ["safe", "keypad"],
      hiddenDescription:
        "In space where a painting formerly hung there is a small alcove housing a wall safe.",
      get description() {
        if (this.hideSecrets) {
          return (
            this.visibleDescription +
            "\n" +
            "On the wall behind the chair hangs an ornately framed painting."
          );
        }
        return this.visibleDescription + "\n" + "\n" + this.hiddenDescription;
      },
    },

    "#": {
      name: "Staircase landing",
      description:
        "You are on the landing of a worn oak staircase connecting the first and second floors of the old abandoned house.",
      visibleEnv: [],
    },

    "%": {
      name: "Entrance hall, south",
      description:
        "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the north end of the hall is a wide oak staircase that connects the first and second floors of the old house.",
      visibleEnv: ["door", "note"],
    },

    "=": {
      name: "Entrance hall, north",
      description:
        "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the rear of the hall is a wide oak staircase that connects the first and second floors of the old house.",
      visibleEnv: [],
    },

    "@": {
      name: "Stone staircase, top",
      description:
        "You are at the top of a stone staircase that leads down to the basement. A faint cold draft greets you from below.",
      smell: "A vaguely unfresh scent wafts up from the basement.",
      visibleEnv: ["collar"],
      sound: "You do not hear anything.",
    },

    "(": {
      name: "Stone staircase, landing",
      description:
        "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
      smell:
        "As you descend, the smell of mildew and earth becomes noticeable.",
      sound:
        "For a moment, you are certain you can hear what sounds like muffled barking, but when you stop moving and strain to hear it again, the sound has stopped.",
    },

    ")": {
      name: "Stone staircase, bottom",
      description:
        "You are standing on a stone staircase leading upwards to the first floor.",
      smell:
        "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces.",
      sound:
        "You can definitely hear the sound of distant, muffled barking. It is coming from the east!",
    },

    $: {
      name: "Broom closet",
      hiddenSecrets: true,
      hiddenEnv: ["glove"],
      visibleEnv: ["chain"],
      des1: "The small closet is dark, although you can see a small chain hanging in front of you.",
      get des2() {
        const hidden = this.hiddenEnv;
        const text =
          "The inside of this small broom closet is devoid of brooms, or much of anything else, for that matter";
        const plural = hidden.length > 1 ? "y" : "ies";
        return (
          text +
          (hidden.length
            ? `, with the exception of ${formatList(
                hidden.map((item: ItemType) => {
                  // @ts-ignore - when game is initialized, the stockDungeon method will replace the name of the item with the actual item object
                  return `${item.article} ${item.name}`;
                })
              )} which occup${plural} a dusty corner.`
            : ".")
        );
      },
      get description(): string {
        // @ts-ignore - this property will be available when the object's prototype is set later
        return this.hideSecrets ? this.des1 : this.des2;
      },
    },
    X: {
      name: "Dining room",
      visibleEnv: ["chair", "table"],
      description:
        "A long cherry dining table runs the length of this formal dining room.",
    },
    Z: {
      name: "Kitchen",
      visibleEnv: ["maps", "backdoor"],
      description:
        "It is quite large for a residential kitchen. While only a few of the original appliances remain, gritty outlines on the walls and floor suggest it was once well appointed. Now it is an echoing tile cavern.",
      smell: "It smells like a dusty abandoned building. And chicken soup.",
    },
  };

  // every cell defined in mapkey will inherit from MapCellProto
	setMapCellPrototypes(mapkey);
	// replace the name of each item with the actual item object
	stockDungeon(mapkey);

  return mapkey;
};

export default mapKey;
