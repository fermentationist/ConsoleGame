import { ItemType } from "../items/Item";

// using copy of eval function to avoid issues with Rollup (see https://rollup.docschina.org/guide/en/#avoiding-eval)
const eval2 = eval;

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const cases = (...wordArgs: string[]) => {// utility function accepts one or multiple string arguments, and returns [all lowercase], [Capitalized first letter], and [ALL CAPS] variations
  let lc, cases;
  const casesArray = wordArgs.map((word) =>{
    lc = word.toLowerCase();
    cases = [lc, `${lc.charAt(0).toUpperCase()}${lc.slice(1)}`, lc.toUpperCase()];
    return word.length ? cases: "";
  });
  return casesArray.join(",");// output is a single string, with variations separated by commas
}

// deepClone is a recursive function that will clone an object, including objects with functions. It will fail if the functions are defined as declared functions or class methods. It will also fail if the object contains DOM elements, or RegExp or other objects that cannot be cloned.
export const deepClone = (obj: any): any => {  
  if (typeof obj === "function") {
    // for whatever reason, eval2(String(obj)) does not work for declared functions or class methods, but it does work for anonymous and arrow functions
    return eval2(String(obj));
  }
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (obj instanceof Map) {
    const map = new Map();
    obj.forEach((value, key) => {
      map.set(key, deepClone(value));
    });
    return map;
  }
  if (obj instanceof Set) {
    const set = new Set();
    obj.forEach((value) => {
      set.add(deepClone(value));
    });
    return set;
  }
  const clone = Object.create(Object.getPrototypeOf(obj));
  Object.getOwnPropertyNames(obj).forEach((key) => {
    Object.defineProperty(clone, key, Object.getOwnPropertyDescriptor(obj, key) ?? {});
  });
  Object.getOwnPropertySymbols(obj).forEach((key) => {
    Object.defineProperty(clone, key, Object.getOwnPropertyDescriptor(obj, key) ?? {});
  });
  return clone;
};



// this recursive function will serialize objects with functions. It will fail if the object contains circular references, or if the functions contain references to variables outside of the object. It will also fail for references to DOM elements, or RegExp or other objects that cannot be serialized.
export const stringifyObjectWithFunctions = (
  obj: Record<string, any>,
  { keysToExclude = [], stringifyFunctions = true } : {
    keysToExclude?: string[];
    stringifyFunctions?: boolean;
  } = {},
  options = {keysToExclude, stringifyFunctions}
) : (string | null) => {
  return JSON.stringify(obj, (key: string, value: any) => {
    if (keysToExclude.includes(key)) {
      return null;
    }
    if (value && typeof value === "object") {
      return stringifyObjectWithFunctions(value, options);
    }
    if (typeof value === "function" && stringifyFunctions) {
      return String(value);
    }
    return value;
  });
};

// without the second argument, which is either an array of string keys or the string "all", this function has no way to know which strings to evaluate as functions, and which to leave as strings.
export const parseObjectWithFunctions = (
  jsonString: string,
  keysToParseAsFunctions: string[] | "all"
) => {
  return JSON.parse(jsonString, (key: string, value: any) => {
    if (
      keysToParseAsFunctions === "all" ||
      keysToParseAsFunctions.includes(key)
    ) {
      return eval2(value);
    }
    return value;
  });
};

export const formatList = (itemArray: string[]
  , disjunction = false) : string => {// Utility function formats a given list of terms (directions) as a string, separating them with commas, and a conjunction ("and"), or a disjunction ("or"), before the final term.
  const length = itemArray.length;
  const conjunction = disjunction ? "or" : "and";
  if (length === 0) {
    return "nothing";
  }
  if (length === 1) {
    return itemArray[0];
  } 
  if (length === 2) {
    return `${itemArray[0]} ${conjunction} ${itemArray[1]}`;
  }
  return `${itemArray[0]}, ${formatList(itemArray.slice(1), disjunction)}`
}