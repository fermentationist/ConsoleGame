import initItemProto, {ItemType as _ItemType} from "./Item";
import { GameType } from "../Game";
import itemContents from "./itemContents";
// @ts-ignore - rollup-plugin-item-loader:items is a virtual module, created by rollup-plugin-item-loader plugin at build time
import items from "rollup-plugin-item-loader:items";

const eval2 = eval;

export interface ItemType extends _ItemType {
  // nothing to add, just aliasing the interface for export
};

function setPrototypes (items: Record<string, ItemType>, defaultProto: ItemType) : void {
  // first set the prototype of all items to the default prototype
  for (const itemName in items) {
    const item = items[itemName];
    Object.setPrototypeOf(item, defaultProto);
  }
  // then set the prototype of items that have a proto property to the item specified in the proto property
  for (const itemName in items) {
    const item = items[itemName];
    if (item.proto) {
      Object.setPrototypeOf(item, items[`_${item.proto}`]);
    }
  }
}

function addItemContents (items: Record<string, ItemType>, contentsObj: Record<string, string[]>) : void {
  for (const itemName in items) {
    if (itemName in contentsObj) {
      const item = items[itemName];
      if (!item.contents) {
        item.contents = [];
      }
      const contents = contentsObj[itemName].map(itemName => items[itemName]);
      (item.contents as ItemType[]).push(...contents);
    }
  }
}

const initItems = async function (game: GameType) : Promise<Record<string, ItemType>> {
  const hydrateItems = function (items: Record<string, ItemType>) : void {
    for (const itemName in items) {
      const item = items[itemName] as ItemType | ((game: GameType) => ItemType); 
      let output = item;
      try {
        if (typeof item === "string") {
          output = eval2(item);
        }
        if (typeof output === "function") {
          output = output(game);
        }
        items[itemName] = output;
      } catch (err) {
        try {
          if (typeof item === "string") {
            output = JSON.parse(item);
          }
        } catch (err) {
          output = item;
        }
      } finally {
        (items as any)[itemName] = output;
      }
    }
  };
  hydrateItems(items);
  const ItemProto = initItemProto(game);
  setPrototypes(items, ItemProto);
  addItemContents(items, itemContents);
  return items;
};

export default initItems;