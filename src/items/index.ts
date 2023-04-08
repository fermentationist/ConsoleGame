import initItemProto, { ItemType as _ItemType } from "./Item";
import { GameType } from "../Game";
import itemContents from "./itemContents";
// @ts-ignore - rollup-plugin-item-loader:items is a virtual module, created by rollup-plugin-item-loader plugin at build time
import items from "rollup-plugin-item-loader:items";

const eval2 = eval;

export interface ItemType extends _ItemType {
  // nothing to add, just aliasing the interface for export
}

function setPrototypes(
  items: Record<string, ItemType>,
  defaultProto: ItemType
): void {
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

// add items to the contents array of other items
function addItemContents(
  items: Record<string, ItemType>,
  contentsObj: Record<string, string[]>
): Record<string, ItemType> {
  const itemEntries = Object.entries(items);
  const itemsWithContents = itemEntries.reduce((map, [itemName, item]) => {
    if (!item.contents) {
      item.contents = [];
    }
    const _itemName = itemName[0] === "_" ? itemName : `_${itemName}`;
    if (_itemName in contentsObj) {
      const contents = contentsObj[_itemName].map((itemToInclude) => {
        const _itemToInclude =
          itemToInclude[0] === "_" ? itemToInclude : `_${itemToInclude}`;
        return items[_itemToInclude];
      });
      (item.contents as ItemType[]).push(...contents);
    }
    map[itemName] = item;
    return map;
  }, {} as Record<string, ItemType>);
  return itemsWithContents;
}

const initItems = function (game: GameType): Record<string, ItemType> {
  // items is a virtual module, created by rollup-plugin-item-loader plugin at build time. It is an object with keys that are the names of the items, and values that are stringified versions of the item objects and functions. hydrateItems() will parse the strings and functions, and return an object with the hydrated items.
  const hydrateItems = function (
    items: Record<string, any>
  ): Record<string, any> {
    const itemEntries = Object.entries(items);
    const outputItems = itemEntries.reduce((map, [itemName, item]) => {
      map[itemName] = item;
      try {
        if (typeof item === "string") {
          map[itemName] = eval2(item);
        }
        if (typeof map[itemName] === "function") {
          map[itemName] = map[itemName](game);
        }
      } catch (err) {
        try {
          if (typeof item === "string") {
            map[itemName] = JSON.parse(item);
          }
        } catch (err) {
          map[itemName] = item;
        }
      }
      return map;
    }, {} as Record<string, any>);
    return outputItems;
  };

  const hydratedItems = hydrateItems(items);
  game.items = hydratedItems;
  const ItemProto = initItemProto(game);
  setPrototypes(hydratedItems, ItemProto);
  const itemsWithContents = addItemContents(hydratedItems, itemContents);
  return itemsWithContents;
};

export default initItems;
