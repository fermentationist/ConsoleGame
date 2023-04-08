import { GameType } from "../Game";

export default function initItemProto(game: GameType) {
  return {
    name: "Item",
    used: false, // whether the item has been used in the current game
    weight: 1,
    get description() {
      return `There is nothing particularly interesting about the ${this.name}.`;
    },
    reverseDescription: null as string | null,
    takeable: true,
    openable: false,
    flammable: false,
    activated: false,
    closed: false,
    locked: false,
    article: "a",
    listed: true,
    solution: null as string | null,
    points: 1,
    count: 0,
    proto: null as string | null,
    contents: [] as any[],
    unlockedBy: null as string | null,
    lockedTarget: null as string | null,
    closedTarget: null as string | null,
    containedPart: null as string | null,
    text: null as string | null,
    get lightCount() {
      return this.activated ? this.count : 0;
    },
    burn: function () {
      game.state.objectMode = false;
      if (!game.inInventory("matchbook")) {
        game.log.p("You don't have the means to light a fire.");
      } else {
        game.items._matchbook.closed = false;
        if (!this.flammable) {
          game.log.p(
            `The meager flame is inadequate to ignite the ${this.name}.`
          );
        } else {
          game.log.p(
            `The match's flame proves to be enough to ignite the ${this.name}. You watch as the ${this.name} is quickly transformed into little more than a pile of ash.`
          );
          if (game.inEnvironment(this.name)) {
            game.state.currentMapCell.removeFromEnv(this);
          } else if (game.inInventory(this.name)) {
            game.removeFromInventory(this);
          }
        }
      }
    },
    burnDown: function () {
      Object.getPrototypeOf(this).burn.call(this);
      game.dead(
        `Unsatisfied after having consumed the ${this.name}, the fire quickly moves on to bigger and better things, like turning you and the house you are trapped in to a pile of smoldering embers.`
      );
    },
    climb: function () {
      game.state.objectMode = false;
      game.log.p(
        `You attempt to scale the ${this.name}, but quickly slip, landing painfully on your back. That was pointless.`
      );
    },
    close: function () {
      game.state.objectMode = false;
      if (!game.inEnvironment(this.name) && !game.inInventory(this.name)) {
        game.log.p(`You don't see ${this.article} ${this.name} here.`);
      } else if (!this.openable) {
        game.log.p("It cannot be closed.");
      } else if (this.closed) {
        game.log.p("It is already closed.");
      } else {
        game.log.p(`The ${this.name} is now closed.`);
        this.closed = true;
        if (this.closedTarget) {
          game.mapKey[this.closedTarget].closed = true;
        }
        if (this.containedPart) {
          game.items[this.containedPart].closed = true;
        }
      }
    },
    correctGuess: function () {},
    incorrectGuess: function () {},
    decrementCounter: function () {
      if (this.lightCount === 1 && game.inInventory(this.name)) {
        game.log.p(`The light from the ${this.name} fades.`);
      }
      this.count = Math.max(this.count - 1, 0);
    },
    drink: function () {
      game.state.objectMode = false;
      game.log.p(`You cannot drink the ${this.name}.`);
    },
    drop: function () {
      game.state.objectMode = false;
      if (game.inInventory(this.name)) {
        game.removeFromInventory(this);
        game.state.score -= this.points;
        game.state.currentMapCell.visibleEnv.push(this);
        game.log.p(`${this.name} dropped.`);
      } else {
        game.log.p("You don't have that.");
      }
    },
    eat: function () {
      game.state.objectMode = false;
      game.log.p(`You cannot eat the ${this.name}.`);
    },
    examine: function () {
      game.state.objectMode = false;
      game.log.p(this.description);
      if (this.activated && this.lightCount > 0) {
        game.log.p("Its glow illuminates the darkness.");
      }
    },
    extinguish: function () {
      game.state.objectMode = false;
      if (this.lightCount > 0) {
        this.activated = false;
        game.log.p(`You extinguish the ${this.name}.`);
      } else {
        game.log.p(`The ${this.name} is not lit.`);
      }
    },
    flush: function () {
      game.state.objectMode = false;
    },
    frotz: function () {
      game.state.objectMode = false;
      this.activated = true;
      this.count = 3;
      game.log.p(
        `Upon uttering the magic word, there is a flash, and then the ${this.name} begins to glow!`
      );
    },
    lock: function () {
      game.state.objectMode = false;
      if (this.locked) {
        game.log.p(`The ${this.name} is already locked.`);
      } else if (this.unlockedBy && game.inInventory(this.unlockedBy)) {
        this.locked = true;
        game.log.p(`Using the ${this.unlockedBy}, you lock the ${this.name}`);
        if (this.lockedTarget) {
          game.mapKey[this.lockedTarget].locked = true;
        }
      } else {
        game.log.p(`You do not have the means to lock the ${this.name}.`);
      }
    },
    move: function () {
      game.log.p(`You cannot move the ${this.name}`);
    },
    open: function () {
      game.state.objectMode = false;
      if (!game.inEnvironment(this.name) && !game.inInventory(this.name)) {
        game.log.p(`You don't see ${this.article} ${this.name} here.`);
      } else if (!this.openable) {
        game.log.p("It cannot be opened.");
      } else if (!this.closed) {
        game.log.p("It is already open.");
      } else if (this.locked) {
        game.log.p("It appears to be locked.");
      } else {
        game.log.p(`The ${this.name} is now open.`);
        this.closed = false;
        game.state.score += this.points;
        this.points = 0; // ? why is this here?
        if (this.closedTarget) {
          game.mapKey[this.closedTarget].closed = false;
        }
        if (this.containedPart) {
          game.items[this.containedPart].closed = false;
        }
      }
    },
    read: function () {
      game.state.objectMode = false;
      if (!this.text) {
        game.log.p("There is nothing to read.");
      } else if (!game.inInventory(this.name)) {
        game.log.p(`You will need to pick up the ${this.name} first.`);
      } else {
        game.log.p(`The text on the ${this.name} reads: \n`);
        game.log.note(this.text);
      }
    },
    rezrov: function () {
      game.state.objectMode = false;
      if (!game.inInventory("scroll") && !game.inEnvironment("scroll")) {
        game.log.p(
          "You are incapable of wielding such powerful magic unassisted."
        );
      } else {
        if (this.locked || this.closed) {
          if (this.locked) {
            this.locked = false;
            if (this.lockedTarget) {
              game.mapKey[this.lockedTarget].locked = false;
            }
            game.log.p(`The ${this.name} is now unlocked.`);
          }
          if (this.closed) {
            this.closed = false;
            if (this.closedTarget) {
              game.mapKey[this.closedTarget].closed = false;
            }
            game.log.p(`The ${this.name} is now open.`);
          }
          game.log.p(
            'Once the rezrov spell is cast, the magic scroll disappears with a sudden flash, and a loud "WHOMP!"'
          );
          game.log.p(
            `When the smoke has cleared, the ${this.name} has been magically unlocked and opened!`
          );
          if (game.inInventory("scroll")) {
            game.removeFromInventory(game.items._scroll);
          } else if (game.inEnvironment("scroll")) {
            game.state.currentMapCell.removeFromEnv(game.items._scroll);
          }
        } else {
          game.log.p("The rezrov spell has no effect.");
        }
      }
    },
    take: function () {
      game.state.objectMode = false;
      if (this.takeable) {
        //&& game.inEnvironment(this.name) ) {
        game.addToInventory([this]);
        game.state.score += this.points;
        game.state.currentMapCell.removeFromEnv(this);
        game.log.p(`You pick up the ${this.name}.`);
      } else {
        game.log.p(`You cannot take the ${this.name}.`);
      }
    },
    takeComponent: function () {
      const realItem = Object.getPrototypeOf(this);
      if (!this.takeable || !game.inEnvironment(this.name)) {
        game.log.p(`You can't take that.`);
      }
      game.addToInventory([this]);
      game.state.currentMapCell.removeFromEnv(this);
      realItem.take.call(realItem);
    },
    turn: function () {
      game.state.objectMode = false;
      game.log.p(
        this.reverseDescription
          ? this.reverseDescription
          : `Turning the ${this.name} has no noticeable effect.`
      );
    },
    unlock: function () {
      game.state.objectMode = false;
      if (!this.locked) {
        game.log.p(`The ${this.name} is not locked.`);
        return;
      } else if (this.unlockedBy && game.inInventory(this.unlockedBy)) {
        this.locked = false;
        game.log.p(
          `Using the ${this.unlockedBy}, you are able to unlock the ${this.name}`
        );
        if (this.lockedTarget) {
          game.mapKey[this.lockedTarget].locked = false;
        }
      } else {
        game.log.p(`You do not have the means to unlock the ${this.name}.`);
      }
    },
    use: function () {
      game.state.objectMode = false;
      game.log.p(`Try as you might, you cannot manage to use the ${this.name}`);
    },
  };
}

export interface ItemType extends ReturnType<typeof initItemProto> {}
