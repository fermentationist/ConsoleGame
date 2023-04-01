import { GameType } from "../Game";
import { ItemType } from "../items";

export type EnvType = {
  visibleEnv: ItemType[];
  containedEnv: ItemType[];
  hiddenEnv: ItemType[];
};

export default function MapCell(game: GameType) {
  // Prototype definition for a single cell on the map grid (usually a room)
  return {
    name: "Nowhere", // room name to be displayed by game.currentHeader()
    locked: false,
    lockText: "", // text to be displayed when player attempts to enter the locked area (but is prevented)
    unlockText: "", // text to be displayed when area becomes unlocked
    hiddenSecrets: false, // used to toggle room description and whether player has access to hiddenEnv
    get hideSecrets() {
      const combinedEnv = [...this.visibleEnv, ...game.state.inventory];
      const lightSource = combinedEnv.some((item) => {
        return item.lightCount > 0;
      });
      if (lightSource) {
        return false;
      }
      return this.hiddenSecrets;
    },
    set hideSecrets(trueOrFalse) {
      this.hiddenSecrets = trueOrFalse;
    },
    description:
      "You find yourself in a non-descript, unremarkable, non-place. Nothing is happening, nor is anything of interest likely to happen here in the future.", // the default text displayed when player enters or "looks" at room
    smell:
      "Your nose is unable to detect anything unusual, beyond the smell of age and decay that permeates the entirety of the decrepit building.", // text displayed in response to smell command
    sound:
      "The silence is broken only by the faint sound of the wind outside, and the occasional creak of sagging floorboards underfoot.", // text displayed in response to listen command
    hiddenEnv: [] as ItemType[], // items in area that are not described and cannot be interacted with unless hideSecrets = false
    visibleEnv: [] as ItemType[], // items described at the end of game.describeSurroundings() text by default
    get env(): EnvType {
      // accessor property returns an array containing the names (as strings) of the items in present environment
      return {
        visibleEnv: this.visibleEnv,
        containedEnv: this.containedEnv,
        hiddenEnv: this.hideSecrets ? [] : this.hiddenEnv,
      };
    },

    // returns any items in the environment that contain other items and are open, as an array of the item objects
    get openContainers() {
      const itemsInEnv = this.hideSecrets
        ? this.visibleEnv
        : [...this.visibleEnv, ...this.hiddenEnv];
      const itemsWithContainers = itemsInEnv.filter(
        (item) => item.contents && item.contents.length > 0
      );
      const openContainerItems = itemsWithContainers.filter((containerItem) => !containerItem.closed);
      return openContainerItems;
    },

    // returns the items available in the environment that are nested inside other objects
    get containedEnv() {
      const containedItems =
        this.openContainers.length > 0
          ? this.openContainers.map((item: ItemType) => {
              return item.contents || [];
            })
          : [];
      return containedItems.flat();
    },

    removeFromEnv: function (item: ItemType | string) {
      const itemName = typeof item === "string" ? item : item.name;
      const envName = game.fromWhichEnv(itemName);
      if (envName === "containedEnv") {
        this.removeFromContainer(itemName);
      } else if (!envName) {
        game.log.error(`Item ${itemName} not found in any environment`);
      } else {
        const thisEnv = (this as Record<string, any>)[envName];
        const filteredEnv = thisEnv.filter(
          (it: ItemType) => it.name !== itemName
        );
        (this as Record<string, any>)[envName] = filteredEnv;
      }
    },

    removeFromContainer: function (item: ItemType | string) {
      // TODO: make sure this takes into account nested containers and items in inventory
      const itemName = typeof item === "string" ? item : item.name;
      const [container] = this.openContainers.filter((thing: ItemType) =>
        (thing.contents || []).map((it: ItemType) => it.name).includes(itemName)
      );
      if (!container) {
        game.log.error(`Item ${itemName} not found in any container`);
      }
      if (!game.inEnvironment(container.name)) {
        game.log.error(`Container ${container.name} not in environment`);
      } else {
        const filteredContainer = container.contents?.filter((item: ItemType) => {
          return item.name !== itemName;
        });
        container.contents = filteredContainer;
      }
    },
    
    addToEnv: function (itemName: string) {
      const itemObj = game.items[`_${itemName}`];
      return this.visibleEnv.push(itemObj);
    },
  };
}
