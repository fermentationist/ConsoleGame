'use strict';

const initStorage = (namespace = "ConsoleGame") => {
    const storageMethods = {
        getStorage: (key) => {
            var _a;
            if (!key) {
                return localStorage;
            }
            const stringifiedData = (_a = localStorage.getItem(`${namespace}.${key}`)) !== null && _a !== void 0 ? _a : "null";
            try {
                return JSON.parse(stringifiedData);
            }
            catch (err) {
                return stringifiedData;
            }
        },
        setStorage: (key, data, merge = false) => {
            let newState = data;
            const previousState = storageMethods.getStorage(key);
            if (previousState && typeof previousState === "object" && typeof data === "object" && merge) {
                newState = Object.assign(Object.assign({}, previousState), data);
            }
            localStorage.setItem(`${namespace}.${key}`, JSON.stringify(newState));
            return newState;
        },
        removeStorage: (key) => {
            localStorage.removeItem(`${namespace}.${key}`);
        }
    };
    return storageMethods;
};
const storage = initStorage("ConsoleGame");

// using copy of eval function to avoid issues with Rollup (see https://rollup.docschina.org/guide/en/#avoiding-eval)
const eval2$1 = eval;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const cases = (...wordArgs) => {
    let lc, cases;
    const casesArray = wordArgs.map((word) => {
        lc = word.toLowerCase();
        cases = [lc, `${lc.charAt(0).toUpperCase()}${lc.slice(1)}`, lc.toUpperCase()];
        return word.length ? cases : "";
    });
    return casesArray.join(","); // output is a single string, with variations separated by commas
};
// deepClone is a recursive function that will clone an object, including objects with functions. It will fail if the functions are defined as declared functions or class methods. It will also fail if the object contains DOM elements, or RegExp or other objects that cannot be cloned.
const deepClone = (obj) => {
    if (typeof obj === "function") {
        // for whatever reason, eval2(String(obj)) does not work for declared functions or class methods, but it does work for anonymous and arrow functions
        return eval2$1(String(obj));
    }
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item));
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
        var _a;
        Object.defineProperty(clone, key, (_a = Object.getOwnPropertyDescriptor(obj, key)) !== null && _a !== void 0 ? _a : {});
    });
    Object.getOwnPropertySymbols(obj).forEach((key) => {
        var _a;
        Object.defineProperty(clone, key, (_a = Object.getOwnPropertyDescriptor(obj, key)) !== null && _a !== void 0 ? _a : {});
    });
    return clone;
};
const formatList = (itemArray, disjunction = false) => {
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
    return `${itemArray[0]}, ${formatList(itemArray.slice(1), disjunction)}`;
};

// Global preference values.
let defaultFont = "monaco";
let defaultTextColor = "#32cd32";
let defaultFontSize = "100%";
let prefsAreSet = Object.keys(localStorage).some((key) => {
    return key.indexOf("ConsoleGame.prefs") !== -1;
});
console.log(!prefsAreSet ? "no user preferences detected." : "user preferences applied.");
let primaryFont = localStorage.getItem("ConsoleGame.prefs.font") || defaultFont;
let textColor = localStorage.getItem("ConsoleGame.prefs.color") || defaultTextColor;
let fontSize = localStorage.getItem("ConsoleGame.prefs.size") || defaultFontSize;
let pStyle = `font-size:calc(1.2 *${fontSize});color:${textColor};font-family:${primaryFont};line-height:1.5;`;

// each style object listed here will be used to create a custom console method by customConsole.ts. They must each start with an underscore, because when rollup builds the project into a single file, the names of the style objects will polluted the global namespace. The underscore is removed when the style object is used to create a custom console method.
// add each of the following exports to a single object, and then export that object. This is necessary because rollup will not allow you to export multiple objects from a single file. The object will be used to create the custom console methods in customConsole.ts.
var logStyles = {
    error: {
        style: `
      font-size:calc(1.2 * ${fontSize});
      color:red;
      font-family:${primaryFont};
      line-height:1.5;
    `,
        logType: "error",
    },
    h1: {
        style: `
      font-size:125%;
      color:pink;
      font-family:${primaryFont};
    `,
        logType: "log",
    },
    intro: {
        style: `
      font-size:calc(1.25 * ${fontSize});
      color:orange;
      font-family:${primaryFont};
      padding:0 1em;
      line-height:1.5;
    `,
        logType: "log",
    },
    cursive: {
        style: `
      font-size:calc(1.2 * ${fontSize});
      font-family:cursive;
      font-weight:bold;
      color:lightgray;
      background-color:black;
      line-spacing:2em;
      padding:1em;
      margin:0 auto  0 0;
      white-space:pre-wrap;
      text-align:center;
    `,
        logType: "log",
    },
    note: {
        style: `
      font-size:calc(1.2 * ${fontSize});
      font-family:courier new;
      color:#75715E;
      background-color:white;
      line-spacing:2em;
      padding:0 1em 1em 0;
      margin:0 auto  0 0;
      white-space:pre-wrap;
    `,
        logType: "log",
    },
    warning: {
        style: `
      font-size:calc(1.15 * ${fontSize});
      color:orange;
      font-family:${primaryFont};
    `,
        logType: "warn",
    },
    papyracy: {
        style: `
      font-size:calc(1.4 * ${fontSize});
      color:beige;
      font-family:Papyrus;
    `,
        logType: "log",
    },
    p: {
        style: pStyle,
        logType: "log",
    },
    tiny: {
        style: `
      font-size:calc(0.5 * ${fontSize});
      color:#75715E;
      font-family:${primaryFont};
    `,
        logType: "log",
    },
    info: {
        style: `
    font-size:calc(1.15*${fontSize});
    padding:0.5em 1em 0 0.5em;
    font-family:${primaryFont};
  `,
        logType: "log",
    },
    invalid: {
        style: `
    font-size:calc(1.2 * ${fontSize});
    color:red;
    font-family:${primaryFont};
    padding:0 1em;
  `,
        logType: "log"
    },
    inventory: {
        style: `
      font-size:calc(1.2 * ${fontSize});
      color:cyan;
      font-family:${primaryFont};
      padding:0 1em;
    `,
        logType: "log"
    },
    title: {
        style: `
      font-size:calc(2.5 * ${fontSize});
      font-weight:bold;
      color:orangered;
      text-shadow:orange 2px 2px 5px;
      goldenrod -2px -2px 5px;
      font-family:Courier;
      padding:0 1em;
      margin:0 auto 0 35%;
      border: 2px dashed goldenrod;
    `,
        logType: "log"
    },
    win: {
        style: `
      font-size:calc(2.5 * ${fontSize});
      font-weight:bold;
      color:gold;
      text-shadow:orange 2px 2px 5px;
      goldenrod -2px -2px 5px;
      font-family:Courier;
      padding:0 1em;
      animation:flashing 0.8s infinite;
    `,
        logType: "log"
    },
    header: {
        style: `
      font-size:calc(1.25 * ${fontSize});
      font-weight:bold;
      color:${textColor};
      font-family:${primaryFont};
      padding:0 1em;
    `,
        logType: "log"
    },
    groupTitle: {
        style: `
      font-size:calc(1.25 * ${fontSize});
      color:#75EA5B;
      font-family:${primaryFont};
    `,
        logType: "group"
    },
    codeInlineBaseStyle: `
    font-size:calc(1.15*${fontSize});
    font-family:${primaryFont};
    font-weight:inherit;
    line-height:1.5;
    padding-top:0.5em;
  `,
    codeInlineCodeStyle: `
    font-family:courier;
    font-weight:bold;
    line-height:1.5;
    padding-top:0.5em;
    font-size:calc(1.35*${fontSize});
    color:lime;
  `,
    getDigiStyle: () => `
    font-family:'monaco', 'Consolas', 'Lucida Console', 'Courier New', monospace;
    color:rgb(${255 - getRandomInt(0, 10)}, ${68 + getRandomInt(0, 10)}, ${0 + getRandomInt(0, 10)});
    font-size:${1.5 + (Math.random() / 4)}em;
    opacity:${1 - Math.random() / 2};
  `,
    getScreamStyle: (index) => `
    font-family:'courier new';
    color:rgb(${255 + getRandomInt(0, 10)}, ${33 + getRandomInt(0, 10)}, ${33 + getRandomInt(0, 10)});
    font-size:${1.2 + index / 3}em;
  `,
};
// export const _error = {
//   style: `
//     font-size:calc(1.2 * ${fontSize});
//     color:red;
//     font-family:${primaryFont};
//     line-height:1.5;
//   `,
//   logType: "error",
// };
// export const _h1 = {
//   style: `
//     font-size:125%;
//     color:pink;
//     font-family:${primaryFont};
//   `,
//   logType: "log",
// };
// export const _intro = {
//   style: `
//     font-size:calc(1.25 * ${fontSize});
//     color:orange;
//     font-family:${primaryFont};
//     padding:0 1em;
//     line-height:1.5;
// 	`,
//   logType: "log",
// };
// export const _cursive = {
//   style: `
//     font-size:calc(1.2 * ${fontSize});
//     font-family:cursive;
//     font-weight:bold;
//     color:lightgray;
//     background-color:black;
//     line-spacing:2em;
//     padding:1em;
//     margin:0 auto  0 0;
//     white-space:pre-wrap;
//     text-align:center;
// 	`,
//   logType: "log",
// };
// export const _note = {
//   style: `
//     font-size:calc(1.2 * ${fontSize});
//     font-family:courier new;
//     font-weight:bold;
//     color:#75715E;
//     background-color:white;
//     line-spacing:2em;
//     padding:0 1em 1em;
//     margin:0 auto  0 0;
//     white-space:pre-wrap;
// 	`,
//   logType: "log",
// };
// export const _warning = {
//   style: `
//     font-size:calc(1.15 * ${fontSize});
//     color:orange;
//     font-family:${primaryFont};
// 	`,
//   logType: "warn",
// };
// export const _papyracy = {
//   style: `
//     font-size:calc(1.4 * ${fontSize});
//     color:beige;
//     font-family:Papyrus;
//   `,
//   logType: "log",
// };
// export const _p = {
//   style: `
//     font-size:calc(1.2 *${fontSize});
//     color:${textColor};
//     font-family:${primaryFont};
//     padding:0 1em;
//     line-height:1.5;
//   `,
//   logType: "log",
// };
// export const _tiny = {
//   style: `
//     font-size:calc(0.5 * ${fontSize});
//     color:#75715E;
//     font-family:${primaryFont};
//   `,
//   logType: "log",
// };
// export const _info = {
//   style: `
//     font-size:calc(1.15*${fontSize});
//     padding:0.5em 1em 0 0.5em;
//     font-family:${primaryFont};
//   `,
//   logType: "log",
// }
// export const _invalid = {
//   style: `
//     font-size:calc(1.2 * ${fontSize});
//     color:red;
//     font-family:${primaryFont};
//     padding:0 1em;
//   `,
//   logType: "log"
// }
// export const _inventory = {
//   style: `
//     font-size:calc(1.2 * ${fontSize});
//     color:cyan;
//     font-family:${primaryFont};
//     padding:0 1em;
//   `,
//   logType: "log"
// }
// export const _title = {
//   style: `
//   font-size:calc(2.5 * ${fontSize});
//     font-weight:bold;
//     color:orangered;
//     text-shadow:orange 2px 2px 5px;
//     goldenrod -2px -2px 5px;
//     font-family:Courier;
//     padding:0 1em;
//     margin:0 auto 0 35%;
//     border: 2px dashed goldenrod;
//   `,
//   logType: "log"
// }
// export const _win = {
//   style: `
//     font-size:calc(2.5 * ${fontSize});
//     font-weight:bold;
//     color:gold;
//     text-shadow:orange 2px 2px 5px;
//     goldenrod -2px -2px 5px;
//     font-family:Courier;
//     padding:0 1em;
//     animation:flashing 0.8s infinite;
//   `,
//   logType: "log"
// }
// export const _header = {
//   style: `
//     font-size:calc(1.25 * ${fontSize});
//     font-weight:bold;
//     color:${textColor};
//     font-family:${primaryFont};
//     padding:0 1em;
//   `,
//   logType: "log"
// }
// export const _groupTitle = {
//   style: `
//     font-size:calc(1.25 * ${fontSize});
//     color:#75EA5B;
//     font-family:${primaryFont};
//   `,
//   logType: "group"
// }
// export const _codeInlineCodeStyle = `
//   font-family:courier;
//   font-weight:bold;
//   line-height:1.5;
//   padding-top:0.5em;
//   font-size:calc(1.35*${fontSize});
//   color:lime;
// `;
// export const _codeInlineBaseStyle = `
//   font-size:calc(1.15*${fontSize});
//   font-family:${primaryFont};
//   font-weight:inherit;
//   line-height:1.5;
//   padding-top:0.5em;
// `;
// export const _getDigiStyle = () => `
//   font-family:'monaco', 'Consolas', 'Lucida Console', 'Courier New', monospace;
//   color:rgb(${255 - getRandomInt(0, 10)}, ${68 + getRandomInt(0, 10)}, ${0 + getRandomInt(0, 10)});
//   font-size:${1.5 + (Math.random() / 4)}em;
//   opacity:${1 - Math.random() / 2};
// `;
// export const _getScreamStyle = (index: number) =>  `
//   font-family:'courier new';
//   color:rgb(${255 + getRandomInt(0, 10)}, ${33 + getRandomInt(0, 10)}, ${33 + getRandomInt(0, 10)});
//   font-size:${1.2 + index/3}em;
// `;

var fonts = [
    "Arial",
    "Arial Black",
    "Arial Narrow",
    "Arial Rounded MT Bold",
    "Avant Garde",
    "Calibri",
    "Candara",
    "Century Gothic",
    "Franklin Gothic Medium",
    "Futura",
    "Geneva",
    "Gill Sans",
    "Helvetica",
    "Impact",
    "Lucida Grande",
    "Optima",
    "Segoe UI",
    "Tahoma",
    "Trebuchet MS",
    "Verdana",
    "Big Caslon",
    "Bodoni MT",
    "Book Antiqua",
    "Calisto MT",
    "Cambria",
    "Didot",
    "Garamond",
    "Georgia",
    "Goudy Old Style",
    "Hoefler Text",
    "Lucida Bright",
    "Palatino",
    "Perpetua",
    "Rockwell",
    "Rockwell Extra Bold",
    "Baskerville",
    "Times New Roman",
    "Consolas",
    "Courier New",
    "Lucida Console",
    "Lucida Sans Typewriter",
    "Monaco",
    "Andale Mono",
    "Copperplate",
    "Papyrus",
    "Brush Script MT"
];

var getRansomArray = (message) => {
    const splitText = [...randomCase(message)];
    const blankStyle = `background-color: unset;font-size:${Math.random()}em`;
    const styles = splitText.map(char => {
        const { foreground, background, border } = getColors();
        const [r, g, b] = foreground;
        const [br, bg, bb] = background;
        const style = `font-family:${randomFont()};color:rgb(${r}, ${g}, ${b});font-size:${3 + (Math.random() / 2)}em;line-height:${Math.random() + 0.5}em;background-color:rgb(${br}, ${bg}, ${bb});${randomPadding()}${randomOutline(border)}`;
        return char === " " ? blankStyle : style;
    });
    const spacedText = splitText.join(" ").split("");
    const spacedStyles = styles.map(item => [item, `font-size:${1 + (Math.random())}em;`]).flat().slice(0, -1);
    return [spacedText, spacedStyles];
};
const getColors = () => {
    const isGray = Math.random() > 0.85;
    const foreground = isGray ? randomRGBGrayValues(0, 64) : randomRGBValues([64, 64, 64], 128);
    const background = isGray ? randomRGBGrayValues(192, 255) : randomRGBValues([255, 255, 255], 75);
    const border = isGray ? randomRGBGrayValues(0, 128) : randomRGBValues([128, 128, 128], 128);
    return { foreground, background, border };
};
const randomPadding = (max = 3, min = 1) => `padding: ${(Math.random() * max) + min}px ${(Math.random() * max) + min}px ${(Math.random() * max) + min}px ${(Math.random() * max) + min}px;`;
const randomRGBValues = ([r, g, b] = [128, 128, 128], maxVariance = 25) => {
    const randomlyVary = (baseValue, maxVary) => {
        const randomAbsoluteVariance = Math.floor(Math.random() * maxVary);
        const randomActualVariance = Math.random() >= 0.5 ? randomAbsoluteVariance * -1 : randomAbsoluteVariance;
        return Math.max(Math.min(255, baseValue + randomActualVariance), 0);
    };
    return [randomlyVary(r, maxVariance), randomlyVary(g, maxVariance), randomlyVary(b, maxVariance)];
};
const randomRGBGrayValues = (min, max) => {
    const value = Math.floor(Math.random() * (max - min) + min);
    return [value, value, value];
};
const randomCase = (message) => {
    const randomizedArray = message.split("").map(char => {
        const rand = Math.random();
        return rand < 0.25 ? char : rand < 0.66 ? char.toUpperCase() : char.toLowerCase();
    });
    return randomizedArray.join("");
};
const randomOutline = (color) => {
    const width = Math.random() > 0.45 ? Math.random() * 1.75 : 0;
    const [r, g, b] = color || randomRGBValues([128, 128, 128], 128);
    const colorString = `rgb(${r}, ${g}, ${b})`;
    return `text-shadow: -${width}px -${width}px ${colorString}, ${width}px -${width}px ${colorString}, -${width}px ${width}px ${colorString}, ${width}px ${width}px ${colorString};`;
};
const randomFont = () => {
    const number = Math.floor(Math.random() * fonts.length);
    return fonts[number];
};

const inline = (stringSegmentArray, styleArray) => {
    const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
    console.log(stringSegments, ...styleArray);
};
const customLog = function (message, style, logType = "log") {
    if (window.CONSOLE_GAME_DEBUG) {
        window.debugLog.push({ gameOutput: message });
    }
    if (Array.isArray(message) && Array.isArray(style)) {
        inline(message, style);
    }
    else {
        console[logType](`%c${message}`, style);
    }
};
const codeInline = (stringOrStringSegmentArray) => {
    const baseStyle = logStyles.codeInlineBaseStyle;
    const codeStyle = logStyles.codeInlineCodeStyle;
    if (typeof stringOrStringSegmentArray === "string") {
        customLog(stringOrStringSegmentArray, codeStyle);
    }
    else {
        const styleArray = Array(stringOrStringSegmentArray.length).fill(baseStyle).map((baseStyle, index) => {
            // alternate between baseStyle and codeStyle
            return index % 2 !== 0 ? codeStyle : baseStyle;
        });
        customLog(stringOrStringSegmentArray, styleArray);
    }
};
const digi = (message) => {
    const spacedText = message.toUpperCase().split("").join(" ").split("");
    const styles = spacedText.map(char => logStyles.getDigiStyle());
    customLog(spacedText, styles);
};
const map = (floorMap) => console.table(floorMap.map(row => row.join("")));
const scream = (message) => {
    const splitText = [...message];
    const styles = splitText.map((char, index) => {
        return logStyles.getScreamStyle(index);
    });
    customLog(splitText, styles);
};
const ransom = (message) => {
    const [text, styles] = getRansomArray(message);
    inline(text, styles);
};
const customConsole = (() => {
    window.debugLog = [];
    const log = {
        inline,
        codeInline,
        digi,
        map,
        scream,
        custom: customLog,
        ransom,
        table: console.table,
        groupCollapsed: console.groupCollapsed,
        groupEnd: console.groupEnd,
    };
    // remaining log methods are created dynamically from the logStyles object
    for (const styleName in logStyles) {
        const styleDetails = logStyles[styleName];
        // only iterate over the style objects, not the methods
        if (typeof styleDetails === "object") {
            const { style, logType } = styleDetails;
            log[styleName] = (message) => customLog(message, style, logType);
        }
    }
    return log;
})();

const dogNames = [
    "Max",
    "Buddy",
    "Charlie",
    "Jack",
    "Cooper",
    "Rocky",
    "Toby",
    "Tucker",
    "Jake",
    "Bear",
    "Duke",
    "Teddy",
    "Oliver",
    "Riley",
    "Bailey",
    "Bentley",
    "Milo",
    "Buster",
    "Cody",
    "Dexter",
    "Winston",
    "Murphy",
    "Leo",
    "Lucky",
    "Oscar",
    "Louie",
    "Zeus",
    "Henry",
    "Sam",
    "Harley",
    "Baxter",
    "Gus",
    "Sammy",
    "Jackson",
    "Bruno",
    "Diesel",
    "Jax",
    "Gizmo",
    "Bandit",
    "Rusty",
    "Marley",
    "Jasper",
    "Brody",
    "Roscoe",
    "Hank",
    "Otis",
    "Bo",
    "Joey",
    "Beau",
    "Ollie",
    "Tank",
    "Shadow",
    "Peanut",
    "Hunter",
    "Scout",
    "Blue",
    "Rocco",
    "Simba",
    "Tyson",
    "Ziggy",
    "Boomer",
    "Romeo",
    "Apollo",
    "Ace",
    "Luke",
    "Rex",
    "Finn",
    "Chance",
    "Rudy",
    "Loki",
    "Moose",
    "George",
    "Samson",
    "Coco",
    "Benny",
    "Thor",
    "Rufus",
    "Prince",
    "Chester",
    "Brutus",
    "Scooter",
    "Chico",
    "Spike",
    "Gunner",
    "Sparky",
    "Mickey",
    "Kobe",
    "Chase",
    "Oreo",
    "Frankie",
    "Mac",
    "Benji",
    "Bubba",
    "Champ",
    "Brady",
    "Elvis",
    "Copper",
    "Cash",
    "Archie",
    "Walter",
    "Bella",
    "Lucy",
    "Daisy",
    "Molly",
    "Lola",
    "Sophie",
    "Sadie",
    "Maggie",
    "Chloe",
    "Bailey",
    "Roxy",
    "Zoey",
    "Lily",
    "Luna",
    "Coco",
    "Stella",
    "Gracie",
    "Abby",
    "Penny",
    "Zoe",
    "Ginger",
    "Ruby",
    "Rosie",
    "Lilly",
    "Ellie",
    "Mia",
    "Sasha",
    "Lulu",
    "Pepper",
    "Nala",
    "Lexi",
    "Lady",
    "Emma",
    "Riley",
    "Dixie",
    "Annie",
    "Maddie",
    "Piper",
    "Princess",
    "Izzy",
    "Maya",
    "Olive",
    "Cookie",
    "Roxie",
    "Angel",
    "Belle",
    "Layla",
    "Missy",
    "Cali",
    "Honey",
    "Millie",
    "Harley",
    "Marley",
    "Holly",
    "Kona",
    "Shelby",
    "Jasmine",
    "Ella",
    "Charlie",
    "Minnie",
    "Willow",
    "Phoebe",
    "Callie",
    "Scout",
    "Katie",
    "Dakota",
    "Sugar",
    "Sandy",
    "Josie",
    "Macy",
    "Trixie",
    "Winnie",
    "Peanut",
    "Mimi",
    "Hazel",
    "Mocha",
    "Cleo",
    "Hannah",
    "Athena",
    "Lacey",
    "Sassy",
    "Lucky",
    "Bonnie",
    "Allie",
    "Brandy",
    "Sydney",
    "Casey",
    "Gigi",
    "Baby",
    "Madison",
    "Heidi",
    "Sally",
    "Shadow",
    "Cocoa",
    "Pebbles",
    "Misty",
    "Nikki",
    "Lexie",
    "Grace",
    "Sierra"
];
const randomDogName = () => dogNames[Math.floor(Math.random() * dogNames.length)];

const thesaurus = {
    bed: [
        "bedframe",
        "mattress"
    ],
    booklet: [
        "catalog",
        "catalogue",
        "book",
        "program"
    ],
    bookshelves: [
        "bookshelf",
        "shelf",
        "shelves"
    ],
    burn: [
        "ignite",
        "incinerate",
        "immolate"
    ],
    collar: [
        "dog_collar",
        "leash"
    ],
    contemplate: [
        "consider",
        "meditate",
        "think",
        "cogitate",
        "cerebrate",
        "ponder",
        "excogitate",
        "muse",
        "reflect",
        "mull",
        "ruminate"
    ],
    cup: [
        "chalice",
        "goblet"
    ],
    disc: [
        "record",
        "album",
        "forty-five",
        "disk",
        "recording",
        "litany",
    ],
    drink: [
        "intake",
        "uptake",
        "imbibe",
        "chug",
        "guzzle",
        "quaff"
    ],
    drop: [
        "unload",
        "discharge",
        "dismiss",
        "shed",
        "discard",
        "release",
        "shitcan",
        "trash",
        "expel",
        "abandon",
        "forsake"
    ],
    eat: [
        "ingest",
        "consume",
        "swallow",
        "devour"
    ],
    examine: [
        "analyze",
        "analyse",
        "study",
        "investigate",
        "inspect",
        "scan",
        "search"
    ],
    extinguish: [
        "douse",
    ],
    film: [
        "movie",
        "reel",
        "cartridge",
        "film_cartridge"
    ],
    glove: [
        "mitt",
        "gloves",
        "handwear",
        "mitten",
        "mittens"
    ],
    go: [
        "travel",
        "locomote",
        "proceed",
        "depart",
        "exit",
        "leave",
        "run"
    ],
    grue_repellant: [
        "repellant",
        "aerosol",
    ],
    inventory: [
        "booty",
        "bounty",
        "hoard",
        "possessions",
        "belongings"
    ],
    lantern: [
        "lamp",
        "torch",
    ],
    listen: [
        "hear"
    ],
    lock: [
        "deadbolt"
    ],
    look: [
        "see",
        "observe",
        "status"
    ],
    maps: [
        "map",
        "plan",
        "plans",
        "blueprints",
        "blueprint",
    ],
    matchbook: [
        "matches",
        "match"
    ],
    move: [
        "displace",
        "upend",
        "push"
    ],
    note: [
        "letter",
        "missive",
        "paper",
        "epistle",
        "treatise"
    ],
    open: [
        "unclose"
    ],
    painting: [
        "canvas",
        "artwork",
    ],
    phonograph: [
        "record_player",
        "turntable"
    ],
    photo: [
        "photograph",
        "picture",
        "pic",
        "portrait",
        "frame",
        "picture_frame"
    ],
    pull: [
        "tug",
        "yank",
        "jerk"
    ],
    read: [
        "skim",
        "peruse"
    ],
    safe: [
        "alcove",
        "strongbox",
        "vault",
        "wall_safe"
    ],
    scroll: [
        "strap",
        "parchment",
        "spell"
    ],
    smell: [
        "sniff"
    ],
    spray: [
        "squirt",
        "spurt",
        "spirt",
        "scatter",
        "sprinkle",
        "disperse",
        "dispense"
    ],
    take: [
        "acquire",
        "steal",
        "purloin",
        "pilfer",
        "obtain",
        "gank",
        "get",
        "appropriate",
        "arrogate",
        "confiscate",
        "retrieve",
        "remove"
    ],
    toilet: [
        "commode",
        "crapper",
        "loo",
        "head",
    ],
    turn: [
        "flip",
        "rotate",
        "revolve",
        "twist"
    ],
    use: [
        "activate",
        "utilize",
        "utilise",
        "apply",
        "employ",
        "exploit",
        "expend"
    ],
    wait: [
        "abide",
        "await",
        "delay",
        "tarry",
        "chill",
        "exist",
        "dawdle",
        "dillydally",
        "loiter",
        "pause",
        "rest",
        "relax",
        "remain",
        "hesitate",
        "procrastinate",
        "sit"
    ],
    yell: [
        "shout",
        "scream",
        "cry",
    ],
};
const allWords = Object.entries(thesaurus).reduce((accum, entry) => {
    return [...accum, ...entry[1]];
}, []);
const duplicates = allWords.filter((word, currentIndex) => allWords.indexOf(word) !== currentIndex);
if (duplicates.length) {
    throw Error(`Duplicates found in thesaurus.js:\n${duplicates}`);
}

// IIFE returns three-dimensional array of maps
const maps = (function () {
    // This function uses .split() to convert an array of simplified maps from one to two-dimensional arrays, and then return them in the order given as a three-dimensional array.
    const processMaps = (arrayOfUnexpandedMapArrays) => {
        const output = arrayOfUnexpandedMapArrays.map((mapArray) => {
            const expandedMap = mapArray.map((line) => [...line]);
            return expandedMap;
        });
        return output;
    };
    // Maps are simplified as arrays of strings. Asterisks are impassable boundaries. Maps should be contained by a perimeter of asterisks to limit x-axis and y-axis, and and upper and lower boundary of asterisks to limit Z-axis. Floor separator maps mark locations that z-axis can be traversed.
    const boundary = [
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************"
    ];
    const basement = [
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "*******CI*******",
        "******)B********",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************"
    ];
    const floorSeparator1 = [
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "******(*********",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************"
    ];
    const groundFloor = [
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "********ZZa*****",
        "******@=XZ******",
        "*******=********",
        "******+%J*******",
        "*******%********",
        "*******A********",
        "****************"
    ];
    const floorSeparator2 = [
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "*******#********",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************"
    ];
    const secondFloor = [
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "****************",
        "*******^********",
        "******0-FG******",
        "*******-*H******",
        "******E-D*******",
        "*******$********",
        "****************"
    ];
    return processMaps([boundary, basement, floorSeparator1, groundFloor, floorSeparator2, secondFloor, boundary]);
})();

// Command functions
const Commands = function (game) {
    // Change player's location on the map, given a direction
    const _movePlayer = (direction) => {
        game.state.objectMode = false;
        let newPosition = {
            x: game.state.position.x,
            y: game.state.position.y,
            z: game.state.position.z
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
            game.log.p(game.mapKey[newCell].lockText && (game.mapKey[newCell].locked || game.mapKey[newCell].closed) ? game.mapKey[newCell].lockText : "");
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
    const _look = (command) => {
        return game.describeSurroundings();
    };
    const _smell = (command) => {
        game.log.p(game.state.currentMapCell.smell);
        return;
    };
    const _listen = (command) => {
        game.log.p(game.state.currentMapCell.sound);
        return;
    };
    // Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.                               
    const _act_upon = (command) => {
        game.state.objectMode = true;
        game.state.pendingAction = command;
        game.log.p(`What would you like to ${command}?`);
    };
    // _none function is bound to commands that should do nothing at all
    const _none = () => { }; // do nothing
    const _wait = () => {
        game.log.p("Time passes...");
    };
    const _go = () => {
        game.log.p("Which direction do you want to go?");
    };
    // Displays items in the player's inventory.
    const _inventory = (command) => {
        let items = [], itemsPlusArticles = [];
        game.state.inventory.forEach((item) => {
            if (item.listed) {
                items.push(item.name);
                const itemWithArticle = item.article ? `${item.article} ${item.name}` : item.name;
                itemsPlusArticles.push(itemWithArticle);
            }
        });
        let segments = `You are carrying ${formatList(itemsPlusArticles)}`.split(" ");
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
    const _inventoryTable = (command) => {
        const table = game.state.inventory.map((item) => {
            const { name, description } = item;
            return { name, description };
        });
        return game.log.table(table, ["name", "description"]);
    };
    // Handles commands that are item names.
    const _items = (itemName) => {
        // Exit function with error message if previous command does not require an object
        if (!game.state.objectMode && itemName !== "maps") {
            // console.invalid("Invalid command");
            console.trace("Invalid command");
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
        if (unfinishedGame === null || unfinishedGame === void 0 ? void 0 : unfinishedGame.length) {
            await game.initializeNewGame();
            game.replayHistory(unfinishedGame);
            game.describeSurroundings();
        }
        else if (game.state.turn) {
            game.describeSurroundings();
        }
        else {
            game.commands.start();
        }
    };
    const _help = () => {
        game.displayText(game.descriptions.help);
    };
    const _restore = (command) => {
        const slotList = game.getSavedGames();
        if (slotList.length > 0) {
            game.displayText(game.descriptions.restore, slotList);
            game.state.restoreMode = true;
            game.state.saveMode = false;
            game.state.pendingAction = command;
        }
        else {
            return game.log.invalid("No saved games found.");
        }
    };
    const _save = (command) => {
        game.state.saveMode = true;
        game.state.restoreMode = false;
        game.state.pendingAction = command;
        game.displayText(game.descriptions.save);
    };
    const _save_slot = (slotNumber) => {
        if (game.state.saveMode) {
            try {
                return game.saveGame(slotNumber);
            }
            catch (err) {
                game.log.invalid(`Save to slot ${slotNumber} failed.`);
                game.log.error(err);
            }
        }
        else if (game.state.restoreMode) {
            try {
                game.restoreGame(slotNumber);
                game.state.restoreMode = false;
            }
            catch (err) {
                game.log.invalid(`Restore from slot ${slotNumber} failed.`);
                return game.log.error(err);
            }
        }
        else {
            game.log.invalid("Operation failed.");
        }
    };
    const _quit = () => {
        game.initializeNewGame();
    };
    const _pref = (whichPref) => {
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
        }
        else {
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
        game.log.p(`Your score is ${game.state.score} in ${game.state.turn} turns.`);
    };
    const _commands = () => {
        const commandAliases = game.commandList.map(([_, aliases]) => aliases);
        const commandTable = commandAliases.reduce((map, aliases) => {
            const [commandName, ...aliasList] = aliases.split(",");
            map[commandName] = aliasList.join(", ");
            return map;
        }, {});
        game.log.table(commandTable);
    };
    // const _again = () => {
    // 	const lastCommand = game.state.history[game.state.history.length - 1];
    // 	const itemNames = Object.keys(game.items).map(key => key.slice(1));
    //     if (itemNames.includes(lastCommand)){
    // 		const [pendingActionFn] = game.commands.filter(entry => entry[1].split(",")[0] === game.state.pendingAction)[0];
    // 		pendingActionFn.call(this);
    // 	}
    // 	const [lastCommandFn] = game.commands.filter(entry => entry[1].split(",")[0] === lastCommand)[0];
    // 	lastCommandFn.call(this);
    // 	return;
    // }
    const _poof = () => {
        var _a;
        const body = document.querySelector("body");
        (_a = body === null || body === void 0 ? void 0 : body.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(body);
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
    const aliasString = (word, thesaurus, optionalString = "") => {
        // thesaurus will be added to params
        let variations = [];
        if (thesaurus) {
            const synonyms = (thesaurus === null || thesaurus === void 0 ? void 0 : thesaurus[word]) || [];
            variations = synonyms.map((synonym) => cases(synonym));
        }
        const output = `${cases(word)}${variations.length ? "," + variations.join() : ""}${optionalString ? "," + optionalString : ""}`;
        return output;
    };
    // Commands and their aliases
    const commandAliases = [
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
        // [_again, aliasString("again", thesaurus) + ",g,G"],
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
        // [_papyracy, cases("papyracy")],
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
    const itemNames = Object.keys(game.items).map(itemName => itemName.slice(1));
    const itemAliases = itemNames.map(itemName => [_items, aliasString(itemName, thesaurus)]);
    const aliases = [...commandAliases, ...itemAliases];
    return aliases;
};

function initItemProto(game) {
    return {
        name: "Item",
        used: false,
        weight: 1,
        get description() {
            return `There is nothing particularly interesting about the ${this.name}.`;
        },
        reverseDescription: null,
        takeable: true,
        openable: false,
        flammable: false,
        activated: false,
        closed: false,
        locked: false,
        article: "a",
        listed: true,
        solution: null,
        points: 1,
        count: 0,
        proto: null,
        contents: [],
        unlockedBy: null,
        lockedTarget: null,
        closedTarget: null,
        text: null,
        get lightCount() {
            return this.activated ? this.count : 0;
        },
        burn: function () {
            game.state.objectMode = false;
            if (!game.inInventory("matchbook")) {
                game.log.p("You don't have the means to light a fire.");
            }
            else {
                game.items._matchbook.closed = false;
                if (!this.flammable) {
                    game.log.p(`The meager flame is inadequate to ignite the ${this.name}.`);
                }
                else {
                    game.log.p(`The match's flame proves to be enough to ignite the ${this.name}. You watch as the ${this.name} is quickly transformed into little more than a pile of ash.`);
                    if (game.inEnvironment(this.name)) {
                        game.state.currentMapCell.removeFromEnv(this);
                    }
                    else if (game.inInventory(this.name)) {
                        game.removeFromInventory(this);
                    }
                }
            }
        },
        burnDown: function () {
            Object.getPrototypeOf(this).burn.call(this);
            game.dead(`Unsatisfied after having consumed the ${this.name}, the fire quickly moves on to bigger and better things, like turning you and the house you are trapped in to a pile of smoldering embers.`);
        },
        climb: function () {
            game.state.objectMode = false;
            game.log.p(`You attempt to scale the ${this.name}, but quickly slip, landing painfully on your back. That was pointless.`);
        },
        close: function () {
            game.state.objectMode = false;
            if (!game.inEnvironment(this.name) && !game.inInventory(this.name)) {
                game.log.p(`You don't see ${this.article} ${this.name} here.`);
            }
            else if (!this.openable) {
                game.log.p("It cannot be closed.");
            }
            else if (this.closed) {
                game.log.p("It is already closed.");
            }
            else {
                game.log.p(`The ${this.name} is now closed.`);
                this.closed = true;
                if (this.closedTarget) {
                    game.mapKey[this.closedTarget].closed = true;
                }
            }
        },
        correctGuess: function () {
        },
        incorrectGuess: function () {
        },
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
            }
            else {
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
            }
            else {
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
            game.log.p(`Upon uttering the magic word, there is a flash, and then the ${this.name} begins to glow!`);
        },
        lock: function () {
            game.state.objectMode = false;
            if (this.locked) {
                game.log.p(`The ${this.name} is already locked.`);
            }
            else if (this.unlockedBy && game.inInventory(this.unlockedBy)) {
                this.locked = true;
                game.log.p(`Using the ${this.unlockedBy}, you lock the ${this.name}`);
                if (this.lockedTarget) {
                    game.mapKey[this.lockedTarget].locked = true;
                }
            }
            else {
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
            }
            else if (!this.openable) {
                game.log.p("It cannot be opened.");
            }
            else if (!this.closed) {
                game.log.p("It is already open.");
            }
            else if (this.locked) {
                game.log.p("It appears to be locked.");
            }
            else {
                game.log.p(`The ${this.name} is now open.`);
                this.closed = false;
                game.state.score += this.points;
                this.points = 0;
                if (this.closedTarget) {
                    game.mapKey[this.closedTarget].closed = false;
                }
            }
        },
        read: function () {
            game.state.objectMode = false;
            if (!this.text) {
                game.log.p("There is nothing to read.");
            }
            else if (!game.inInventory(this.name)) {
                game.log.p(`You will need to pick up the ${this.name} first.`);
            }
            else {
                game.log.p(`The text on the ${this.name} reads: \n`);
                game.log.note(this.text);
            }
        },
        rezrov: function () {
            game.state.objectMode = false;
            if (!game.inInventory("scroll") && !game.inEnvironment("scroll")) {
                game.log.p("You are incapable of wielding such powerful magic unassisted.");
            }
            else {
                this.locked = false;
                this.closed = false;
                if (this.lockedTarget) {
                    game.mapKey[this.lockedTarget].locked = false;
                }
                if (this.closedTarget) {
                    game.mapKey[this.closedTarget].closed = false;
                }
                game.log.p("Once the rezrov spell is cast, the magic scroll disappears with a sudden flash, and a loud \"WHOMP!\"");
                game.log.p(`When the smoke has cleared, the ${this.name} has been magically unlocked and opened!`);
                if (game.inInventory("scroll")) {
                    game.removeFromInventory(game.items._scroll);
                }
                else if (game.inEnvironment("scroll")) {
                    game.state.currentMapCell.removeFromEnv(game.items._scroll);
                }
            }
        },
        take: function () {
            game.state.objectMode = false;
            if (this.takeable) { //&& game.inEnvironment(this.name) ) {
                game.addToInventory([this]);
                game.state.score += this.points;
                game.state.currentMapCell.removeFromEnv(this);
                game.log.p(`You pick up the ${this.name}.`);
            }
            else {
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
            game.log.p(this.reverseDescription ? this.reverseDescription : `Turning the ${this.name} has no noticeable effect.`);
        },
        unlock: function () {
            game.state.objectMode = false;
            if (!this.locked) {
                game.log.p(`The ${this.name} is not locked.`);
                return;
            }
            else if (this.unlockedBy && game.inInventory(this.unlockedBy)) {
                this.locked = false;
                game.log.p(`Using the ${this.unlockedBy}, you are able to unlock the ${this.name}`);
                if (this.lockedTarget) {
                    game.mapKey[this.lockedTarget].locked = false;
                }
            }
            else {
                game.log.p(`You do not have the means to unlock the ${this.name}.`);
            }
        },
        use: function () {
            game.state.objectMode = false;
            game.log.p(`Try as you might, you cannot manage to use the ${this.name}`);
        },
    };
}

var itemContents = {
    // dictionary of items that contain other items
    _glove: ["_matchbook"],
    _safe: ["_key", "_scroll"],
    _drawer: ["_film"],
    _nightstand_drawer: ["_old_key"],
    _wardrobe: ["_grue_repellant"],
    _dresser_drawer: ["_booklet"]
};

var items = {"_all":"(game) => {\n  return {\n    name: \"all\",\n    listed: false,\n    takeable: false,\n    take () {\n      game.state.objectMode = false;\n      const all = game.state.combinedEnv;\n      all.forEach((item) => {\n        return item.takeable ? (item.take && item.take()) : null;\n      });\n    },\n    drop () {\n      game.state.objectMode = false;\n      const all = game.state.inventory.filter((it) => ![\"no_tea\", \"me\"].includes(it.name));// filter out \"no_tea\" (you can't drop it)\n      all.forEach((item) => {\n        item.drop && item.drop();\n      });\n    }\n  };\n}","_backdoor":"{\"name\":\"door\",\"locked\":true,\"proto\":\"door\",\"unlockedBy\":\"key\",\"lockedTarget\":\"a\",\"closedTarget\":\"a\"}","_basement_door":"{\"name\":\"door\",\"locked\":true,\"closed\":true,\"listed\":true,\"proto\":\"door\",\"unlockedBy\":\"old_key\",\"lockedTarget\":\"I\",\"closedTarget\":\"I\"}","_bathtub":"(game) => {  \n  return {\n    name: \"bathtub\",\n    takeable: false,\n    description: \"The old cast iron tub rests atop four taloned feet. It does not look functional.\",\n    use () {\n      game.log.p(\"This is hardly an appropriate time for a bath!\");\n    }\n  }\n}","_bed":"(game) => {\n  return {\n\t\t\tname: \"bed\",\n\t\t\tflammable: true,\n\t\t\ttakeable: false,\n\t\t\tlisted:false,\n\t\t\tdescription: \"The antique bedframe is made of tubular bronze. There are not any sheets or blankets or pillows on the old, stained, queen-sized mattress that rests atop it.\",\n\t\t\tburn () {\n\t\t\t\tObject.getPrototypeOf(this).burnDown.call(this);\n\t\t\t},\n\t\t}\n}","_booklet":"(game) => {\n  return {\n    name: \"booklet\",\n    article: \"a\",\n    flammable: true,\n    description: \"This booklet appears to be the exhibition catalogue for some fancy art show. \",\n    read () {\n      game.state.objectMode = false;\n      if (!game.inInventory(this.name)) {\n        return game.log.p(`You will need to pick up the ${this.name} first.`);\n      }\n      game.displayItem({\n        title: \"Ministry of Culture\",\n        artist: \"Isak Berbic, Emiliano Cerna-Rios, Dennis Hodges and Zdenko Mandusic\",\n        year: \"2008\",\n        info: \"Exhibition catalog\",\n        source: \"https://drive.google.com/file/d/1pJcIPQZxY1JhRZ3ssV-EPL6eWY-XLdpI/preview\",\n        width: \"800px\",\n        height: \"800px\"\n      });\n    }\n  }\n}","_books":"(game) => {\n  return {\n    name: \"books\",\n    listed: false,\n    takeable: false,\n    description: \"While you notice many of the titles as familiar works of classic literature, nothing stands out as being of particular interest.\",\n    read () {\n      game.log.p(\"You cannot possibly read all of these books, and considering you have been abducted by persons unknown and are trapped in a strange house, you have neither the presence of mind, nor the time to sit down with a good book right now.\");\n    },\n    proto: \"bookshelves\",\n  }\n}","_bookshelves":"{\"name\":\"bookshelves\",\"listed\":false,\"takeable\":false,\"article\":\"some\",\"description\":\"Wooden bookshelves line one wall of the study, reaching from floor to ceiling. There are hundreds of moldering, hardcover books lining the shelves.\"}","_chain":"(game) => {\n  return {\n\t\t\tname: \"chain\",\n\t\t\tweight: 0,\n\t\t\tdescription: \"The thin ball chain dangling in front of you is exactly the sort often connected to a lightbulb. Perhaps you should \\\"pull\\\" it...\",\n\t\t\ttakeable: false,\n\t\t\tlisted: false,\n\t\t\tpull () {\n\t\t\t\tgame.state.objectMode = false;\n\t\t\t\tlet dark = game.state.currentMapCell.hideSecrets;\n\t\t\t\tdark ? game.log.p(\"An overhead lightbulb flickers on, faintly illuminating the room.\") : game.log.p(\"The lightbulb is extinguished.\");\n\t\t\t\tgame.state.currentMapCell.hideSecrets = !dark;\n\t\t\t\treturn game.describeSurroundings();\n\t\t\t},\n\t\t\tuse () {\n\t\t\t\treturn this.pull();\n\t\t\t}\n\t\t}\n}","_chair":"(game) => {\n  return {\n    name: \"chair\",\n    takeable: false,\n    description: \"It looks like a wooden chair– no more, no less.\",\n    use () {\n      game.state.objectMode = false;\n      game.log.p(\"You sit down on the chair.\");\n      const wait = game.commands._wait;\n      wait.call(this);\n    }\n  }\n}","_coffee_table":"(game) => {\n  return {\n    name: \"coffee_table\",\n    listed: false,\n    takeable: false,\n    description () {\n      return `The low, four-legged table has nothing on it${\n        game.state.env.visibleEnv.includes(\"photo\")\n          ? \" except for a small, framed photo.\"\n          : \".\"\n      }`;\n    },\n  };\n}","_collar":"(game) => {\n  return {\n    name: \"collar\",\n    description: `It is ${game.state.dogName}'s collar! Whoever assaulted you and took your dog must have come this way!`,\n    smell () {\n      game.log.p(\"The collar smells like leather and scared doggie!\");\n    }\n  }\n}","_cup":"{\"name\":\"cup\",\"weight\":2,\"description\":\"It is a small, golden cup with two finely wrought handles.\"}","_desk":"(game) => {\n  return {\n    name: \"desk\",\n    takeable: false,\n    openable: true,\n    closed: true,\n    // contents: [],\n    containedPart: \"_drawer\",\n    description: \"The antique writing desk is six feet in length, and blanketed with dust. It has a single drawer on one side.\",\n    open () {\n      if(this.closed){\n        Object.getPrototypeOf(this).open.call(this);\n      }\n      if (game.items[this.containedPart].closed){\n        game.items[this.containedPart].closed = false;\n      }\n    },\n    close () {\n      if (!this.closed){\n        Object.getPrototypeOf(this).close.call(this);\n      }\n      if (!game.items[this.containedPart].closed) {\n        game.items[this.containedPart].closed = true;\n      }\n    }\n  }\n}","_disc":"(game) => {\n  return {\n    name: \"disc\",\n    text: \"Untitled (Litany)\",\n    get description() {\n      return `It is a disc made of a shiny black polymer, lined with hundreds of tiny concentric grooves. It looks to be about seven inches in diameter, with a one and one-half inch hole in its center. It bears a label that says, \"${this.text}\".`;\n    },\n    play () {\n      if (!game.inEnvironment(\"phonograph\") && !game.inInventory(\"phonograph\")) {\n        game.log.p(\"First, you will need to find a phonograph.\")\n        return;\n      }\n      return game.displayItem({\n        title: \"\\nUntitled (litany)\",\n        artist: \"Dennis Hodges\",\n        year: \"2010\",\n        info: \"Found audio recordings\",\n        source: \"https://drive.google.com/file/d/1s02tHvAU0E7dMJgbhUnIPNg8ayWGNmxZ/preview?usp=sharing\"\n      });\n    },\n    use () {\n      this.play.call(this)\n    },\n  }\n}","_dog":"{\"name\":\"dog\",\"points\":50,\"article\":\"a\",\"takeable\":true,\"description\":\"Four legs. barks.\",\"rescue\":\"rescue () {\\n    Object.getPrototypeOf(this).take.call(this);\\n  }\"}","_door":"(game) => {\n  return {\n    name: \"door\",\n    article: \"a\",\n    points: 20,\n    openable: true,\n    locked: false,\n    closed: true,\n    takeable: false,\n    listed: false,\n    unlockedBy: \"key\",\n    lockedTarget: \"A\",\n    closedTarget: \"A\",\n    get description() {\n      game.state.objectMode = false;\n      return `The massive wooden door, darkened with generations of dirt and varnish, is secured with a sturdy new deadbolt, which is ${!this.locked ? \"unlocked.\" : \"locked.\"}${this.closed ? \"\" : \"\\nThe door is open.\"}`\n    },\n  }\n}","_drawer":"(game) => {\n  const drawer = {\n    name: \"drawer\",\n    listed: false,\n    openable: true,\n    closed: true,\n    takeable: false,\n    containedIn: \"_desk\",\n    contents: [],\n    get description() {\n      return this.closed\n        ? \"The drawer is closed.\"\n        : `The drawer is open. There is ${\n            this.contents.length < 1\n              ? \"nothing\"\n              : game.formatList(\n                  this.contents.map((item) => `${item.article} ${item.name}`)\n                )\n          } inside.`;\n    },\n    open () {\n      if (this.closed) {\n        Object.getPrototypeOf(this).open.call(this);\n      }\n      if (game.items[this.containedIn].closed) {\n        game.items[this.containedIn].closed = false;\n      }\n    },\n    close () {\n      if (!this.closed) {\n        Object.getPrototypeOf(this).close.call(this);\n      }\n      if (!game.items[this.containedIn].closed) {\n        game.items[this.containedIn].closed = true;\n      }\n    },\n  };\n  return drawer;\n}","_dresser":"(game) => {\n  return {\n    name: \"dresser\",\n    takeable: false,\n    openable: true,\n    closed: true,\n    listed: true,\n    proto: \"desk\",\n    containedPart: \"_dresser_drawer\",\n    contents: [],\n    get description () {\n      return `The modest wooden dresser is of simple design. The pale blue milk paint that coats it is worn through in several spots from use. It has a large drawer, which is ${this.closed ? \"closed\" : \"open\"}.`\n    },\n    open () {\n      const proto = Object.getPrototypeOf(this);\n      const urOpen = Object.getPrototypeOf(proto).open.bind(this);\n      urOpen.call(this);// open method from prototype's prototype\n      proto.open.call(this);// open method of prototype\n    },\n    close () {\n      const proto = Object.getPrototypeOf(this);\n      const urClose = Object.getPrototypeOf(proto).close.bind(this);\n      urClose.call(this);// close method from prototype's prototype\n      proto.close.call(this);// open method of prototype\n    },\n  }\n}","_dresser_drawer":"(game) => {\n  return {\n    name: \"drawer\",\n    takeable: false,\n    openable: true,\n    closed: true,\n    listed: false,\n    proto: \"drawer\",\n    containedIn: \"_dresser\",\n    contents: [],\n    open () {\n      const proto = Object.getPrototypeOf(this);\n      const urOpen = Object.getPrototypeOf(proto).open.bind(this);\n      urOpen.call(this); // open method from prototype's prototype\n      proto.open.call(this); // open method of prototype\n    },\n    close () {\n      const proto = Object.getPrototypeOf(this);\n      const urClose = Object.getPrototypeOf(proto).close.bind(this);\n      urClose.call(this); // close method from prototype's prototype\n      proto.close.call(this); // open method of prototype\n    },\n  };\n}","_film":"(game) => {\n  return {\n    name: \"film\",\n    listed: true,\n    flammable: true,\n    article: \"a reel of\",\n    text: \"Canned Laughs\",\n    description:\n      'The Super 8 film cartridge is made primarily of a clear, smoky plastic body containing a single spool of developed film. It looks a lot like an audio cassette tape, though it is a little thicker, and it is square instead of being merely rectangular. The title, \"Canned Laughs\", is hand written on a curling paper label.',\n    play () {\n      if (!game.inEnvironment(\"projector\") && !game.inInventory(\"projector\")) {\n        game.log.p(\n          \"First, you will need to find something to project the film with.\"\n        );\n        return;\n      }\n      if (!game.inEnvironment(\"screen\") && !game.inInventory(\"screen\")) {\n        game.log.p(\"You are going to need a screen to project onto.\");\n        return;\n      }\n      return game.displayItem({\n        title: \"\\nCanned Laughs\",\n        artist: \"Dennis Hodges\",\n        year: \"2001\",\n        info: \"Super 8mm film to video transfer with dubbed audio\",\n        source:\n          \"https://drive.google.com/file/d/1loiWbLQgHVVoCtJVscJe2sYiPle8u7Tf/preview?usp=sharing\",\n        width: \"720px\",\n        height: \"480px\",\n      });\n    },\n    use () {\n      this.play.call(this);\n    },\n    project () {\n      this.play.call(this);\n    },\n  };\n}","_filthy_note":"{\"name\":\"note\",\"text\":\"Dear John,\\nI'm leaving. After all of this time, I said it. But I want you to understand that it is not because of you, or something you've done (you have been a loving and loyal partner). It is I who have changed. I am leaving because I am not the person who married you so many years ago; that, and the incredibly low, low prices at Apple Cabin. Click here ==> http://liartownusa.tumblr.com/post/44189893625/apple-cabin-foods-no-2 to see why I prefer their produce for its quality and respectability.\",\"description\":\"A filthy note you found on the floor of a restroom. Congratulations, it is still slightly damp. Despite its disquieting moistness, the text is still legible.\"}","_glove":"(game) => {\n  return {\n    name: \"glove\",\n    closed: true,\n    description: \"It is a well-worn gray leather work glove. There is nothing otherwise remarkable about it.\",\n    contents: [],\n    examine () {\n      game.state.objectMode = false;\n      if (this.contents.length) {\n        const hiddenItem = this.contents.pop();\n        game.log.p(`${this.description}\\nAs you examine the glove, a ${hiddenItem.name} falls out, onto the floor.`);\n        game.state.currentMapCell.addToEnv(hiddenItem.name);\n        return;\n      }\n      return this.description;\n    }\n  }\n}","_grue":"(game) => {\n  return {\n    name: \"grue\",\n    listed: false,\n    takeable: false,\n    turns: 3,\n    description:\n      \"No adventurer who has seen a grue has yet lived to tell of it.\",\n    lurk () {\n      if (!game.state.currentMapCell.hideSecrets) {\n        return;\n      }\n      const valarMorgulis = Math.random() >= 0.25;\n      if (valarMorgulis && this.turns < 1) {\n        game.dead(\n          \"Oh no! You have walked into the slavering fangs of a lurking grue!\"\n        );\n      }\n      this.turns--;\n      return;\n    },\n  };\n}","_grue_repellant":"(game) => {\n  return {\n    name: \"grue_repellant\",\n    defective: Math.random() < 0.03,\n    weight: 3,\n    count: 3,\n    article: \"some\",\n    description: \"A 12oz can of premium aerosol grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting.\",\n    use () {\n      game.state.objectMode = false;\n      if (!game.inInventory(this.name)) {\n        return game.inEnvironment(this.name) ? game.log.p(\"You will need to pick it up first.\") : game.log.p(\"You don't see that here.\");\n      } else if (this.used) {\n        return game.log.p(\"Sorry, but it has already been used.\");\n      } else if (this.defective) {\n        this.used = true;\n        return game.log.p(\"Nothing happens. This must be one of the Math.random() < 0.03 of grue_repellant cans that were programmed to be, I mean, that were accidentally manufactured defectively. Repeated attempts to coax repellant from the aerosol canister prove equally fruitless.\");\n      } else {\n        this.used = true;\n        this.activated = true;\n        game.state.repellantMode = true;\n        return game.log.p(\"A cloud of repellant hisses from the canister, temporarily obscuring your surroundings. By the time it clears, your head begins to throb, and you feel a dull, leaden taste coating your tongue. The edges of your eyes and nostrils feel sunburnt, and there is also a burning sensation to accompany an unsteady buzzing in your ears. Although you are not a grue, you find it to be more than somewhat off-putting.\");\n      }\n    },\n    spray () {\n      game.state.objectMode = false;\n      return this.use();\n    },\n    drink () {\n      game.state.objectMode = false;\n      game.dead(\"Drinking from an aerosol can is awkward at best, but still you manage to ravenously slather your chops with the foaming grue repellant. You try to enjoy the searing pain inflicted by this highly caustic (and highly toxic!) chemical as it dissolves the flesh of your mouth and throat, but to no avail. It is not delicious, and you are starting to realize that there are some non-trivial drawbacks to willingly ingesting poison. Oops.\");\n    },\n    decrementCounter () {\n      if (this.activated && this.count > 0) {\n        --this.count;\n        if (this.count === 0) {\n          game.log.p(\"The grue repellant has probably worn off by now.\");\n          this.activated = false;\n          game.state.repellantMode = false;\n          return;\n        }\n      }\n    }\n  }\n}","_key":"(game) => {\n  return {\n    name: \"key\",\n    description:\n      \"The shiny key is made of untarnished brass and looks new, like it could have been cut yesterday.\",\n    use () {\n      const unlockable = game.state.combinedEnv.filter(\n        (item) => item.unlockedBy === this.name\n      );\n      if (unlockable.length < 1) {\n        game.log.p(`There is nothing to unlock with the ${this.name}`);\n        return;\n      }\n      unlockable.forEach((item) => item.unlock());\n    },\n  };\n}","_knife":"(game) => {\n  return {\n    name: \"knife\",\n    description:\n      \"The folding knife has a three inch locking blade and is small enough to fit in your pocket. It is designed to be a utility blade, and would probably make a poor weapon.\",\n    use () {\n      game.log.p(\"The small knife is of no use here.\");\n    },\n  };\n}","_lantern":"(game) => {\n  return {\n    name: \"lantern\",\n    flammable: false,\n    activated: false,\n    proto: \"matchbook\",\n    get description() {\n      return `The old brass lantern is the quaint sort that burns hydrocarbons to produce light. It is currently ${\n        this.activated ? \"lit.\" : \"extinguished.\"\n      }`;\n    },\n    use () {\n      game.state.objectMode = false;\n      if (!game.inInventory(\"matchbook\")) {\n        game.log.p(\"You don't have the means to light a fire.\");\n        return;\n      }\n      if (this.count === 0) {\n        game.log.p(\"The lantern appears to be out of fuel.\");\n        return;\n      }\n      game.items._matchbook.closed = false;\n      this.activated = true;\n      this.count = 250;\n      game.log.p(\n        \"Lighting the lantern with the match produces a brighter, longer lasting source of light.\"\n      );\n    },\n    light () {\n      this.use.call(this);\n    },\n    burn () {\n      this.use.call(this);\n    },\n  };\n}","_maps":"(game) => {\n  return {\n    name: \"maps\",\n    article: \"some\",\n    get description() {\n      this.read();\n      return `The stack of dogeared pages appear to be architectural drawings. With a quick survey of your surroundings, you confirm with reasonable certainty that they are likely floor plans for this house.`;\n    },\n    read () {\n      game.state.objectMode = false;\n      if (!game.inInventory(this.name)) {\n        return game.log.p(`You will need to pick up the ${this.name} first.`);\n      }\n      const currentPosition = game.state.position;\n      const floorMap = game.maps[currentPosition.z].map((row) => {\n        return row.map((cell) => (cell === \"*\" ? \"⬛️\" : \"🌫\"));\n      });\n      floorMap[currentPosition.y].splice(currentPosition.x, 1, \"⭐️\");\n      const croppedMap = floorMap.slice(8).map((row) => row.slice(5, 11));\n      game.log.map(croppedMap);\n    },\n    use () {\n      this.read.call(this);\n    },\n  };\n}","_matchbook":"(game) => {\n  return {\n    name: \"matchbook\",\n    openable: true,\n    closed: true,\n    count: 3,\n    flammable: true,\n    get description() {\n      return `It is an old paper matchbook, of the type that used to be given away with packs of cigarettes, or printed with the name and telephone number of a business and used as marketing schwag. This particular specimen is beige, with black and white text that says \\\"Magnum Opus\\\" in a peculiar, squirming op-art font. ${\n        this.closed\n          ? \"It is closed, its cardboard cover tucked in.\"\n          : 'The cardboard cover is open, and you can see a handwritten message on the inside. It says, \"THE OWLS ARE NOT WHAT THEY SEEM.\"'\n      }`;\n    },\n    decrementCounter () {\n      if (this.lightCount) {\n        --this.count;\n        if (this.count === 0) {\n          game.log.p(\"Despite your best efforts the flame flickers out.\");\n          this.activated = false;\n          return;\n        }\n      }\n    },\n    use () {\n      game.state.objectMode = false;\n      if (this.closed) {\n        this.open.call(this);\n        game.log.p(\n          \"As you flip open the matchbook, folding back the cover, you glimpse something scrawled in pencil on the inside.\"\n        );\n      }\n      game.log.p(\n        \"You pluck out one of the paper matches. It ignites easily as you scrape its head against the red phosphorus strip, producing a tenuous flame that you are quick to guard with your cupped hand.\"\n      );\n      this.count = 3;\n      this.activated = true;\n    },\n    light () {\n      this.use.call(this);\n    },\n  };\n}","_me":"(game) => {\n  return {\n    name: \"me\",\n    article: \"\",\n    takeable: false,\n    listed: false,\n    get description() {\n      const descriptionString = `Upon taking a quick inventory of your person and its component parts – everything seems to be accounted for and intact.`;\n      return descriptionString;\n    },\n  };\n}","_nightstand":"(game) => {\n  return {\n    name: \"nightstand\",\n    takeable: false,\n    openable: true,\n    closed: true,\n    listed: false,\n    proto: \"desk\",\n    containedPart: \"_nightstand_drawer\",\n    contents: [],\n    get description() {\n      return `The nightstand next to the bed is made of wood and is painted white. It has a single drawer, which is ${\n        this.closed ? \"closed\" : \"open\"\n      }.`;\n    },\n    open () {\n      const proto = Object.getPrototypeOf(this);\n      const urOpen = Object.getPrototypeOf(proto).open.bind(this);\n      urOpen.call(this); // open method from prototype's prototype\n      proto.open.call(this); // open method of prototype\n    },\n    close () {\n      const proto = Object.getPrototypeOf(this);\n      const urClose = Object.getPrototypeOf(proto).close.bind(this);\n      urClose.call(this); // close method from prototype's prototype\n      proto.close.call(this); // open method of prototype\n    },\n  };\n}","_nightstand_drawer":"(game) => {\n  return {\n    name: \"drawer\",\n    takeable: false,\n    openable: true,\n    closed: true,\n    listed: false,\n    proto: \"drawer\",\n    containedIn: \"_nightstand\",\n    contents: [],\n    open () {\n      const proto = Object.getPrototypeOf(this);\n      const urOpen = Object.getPrototypeOf(proto).open.bind(this);\n      urOpen.call(this); // open method from prototype's prototype\n      proto.open.call(this); // open method of prototype\n    },\n    close () {\n      const proto = Object.getPrototypeOf(this);\n      const urClose = Object.getPrototypeOf(proto).close.bind(this);\n      urClose.call(this); // close method from prototype's prototype\n      proto.close.call(this); // close method of prototype\n    },\n  };\n}","_no_tea":"(game) => {\n  return {\n    name: \"no_tea\",\n    weight: 0,\n    article: \"\",\n    description: \"You do not have any tea.\",\n    methodCallcount: 0,\n    takeable: false,\n    no_teaMethod (message) {\n      this.methodCallcount++;\n      game.state.objectMode = false;\n      game.log.p(message);\n      if (\n        this.methodCallcount > 1 &&\n        game.state.pendingAction !== \"contemplate\"\n      ) {\n        game.log.p(\"Perhaps you should take a moment to contemplate that.\");\n      }\n    },\n    drink () {\n      return this.no_teaMethod(\"How do you intend to drink no tea?\");\n    },\n    drop () {\n      return this.no_teaMethod(\n        \"You can't very well drop tea that you don't have.\"\n      );\n    },\n    take () {\n      return this.no_teaMethod(\"No tea isn't the sort of thing you can take.\");\n    },\n    examine () {\n      return this.no_teaMethod(this.description);\n    },\n    frotz () {\n      return this.no_teaMethod('Unfortunately, you cannot \"frotz\" the no tea.');\n    },\n    use () {\n      return this.no_teaMethod(\n        \"Unsurprisingly, using the no tea has no effect.\"\n      );\n    },\n    contemplate () {\n      if (this.methodCallcount > 2) {\n        game.state.score += 75;\n        return game.winner(\n          \"Having thoroughly contemplated the existential ramifications of no tea, you suddenly find that your being transcends all time and space.\"\n        );\n      }\n      return this.no_teaMethod(\"Let's not resort to that just yet!\");\n    },\n  };\n}","_note":"(game) => {\n  return {\n    name: \"note\",\n    text: `We have your dog.`,\n    flammable: true,\n    firstRead: true,\n    description:\n      \"The note is composed of eclectically sourced, cut-out letters, in the style of a movie ransom note. You found it lying next to you on the floor when you regained consciousness.\",\n    read () {\n      game.state.objectMode = false;\n      console.log(\"this:\", this)\n      if (!game.inInventory(this.name)) {\n        return game.log.p(`You will need to pick up the ${this.name} first.`);\n      }\n      game.log.ransom(this.text);\n      if (this.firstRead) {\n        game.log.p(\n          `Who would do such a thing to sweet little ${game.state.dogName}!?`\n        );\n        game.log.p(\n          \"You need to rescue your puppy and get out of this place before your attacker returns!\"\n        );\n        this.firstRead = false;\n      }\n    },\n  };\n}","_old_key":"{\"name\":\"old_key\",\"article\":\"an\",\"description\":\"It is an old-fashioned key, made of heavy, tarnished bronze.\",\"proto\":\"key\"}","_painting":"(game) => {\n  return {\n    name: \"painting\",\n    takeable: true,\n    listed: false,\n    flammable: true,\n    description:\n      \"The small, grimy image is of an owl, teaching a class a classroom of kittens how to catch mice. The rendering of perspective is amateurish, and the depicted animals look hostile and disfigured. It is an awful painting.\",\n    previouslyRevealed: false,\n    location: \"+\",\n    take () {\n      Object.getPrototypeOf(this).take.call(this);\n      this.revealText(\"When you remove the terrible painting, \");\n    },\n    revealText (text) {\n      if (!this.previouslyRevealed) {\n        game.log.p(\n          text +\n            \"a small recess is revealed. Within the shallow niche is a small black wall safe, covered with countless shallow dents, scratches and abrasions.\"\n        );\n        game.mapKey[this.location].hideSecrets = false;\n        this.previouslyRevealed = true;\n      }\n    },\n    move () {\n      this.revealText(\"When you move the terrible painting, \");\n    },\n    turn () {\n      this.move();\n    },\n    burn () {\n      game.state.objectMode = false;\n      if (!game.inInventory(\"matchbook\")) {\n        // check for matchbook, exit if not in inventory\n        game.log.p(\"You don't have the means to light a fire.\");\n        return;\n      }\n      // update the description of the painting to reflect the fact that it has been burned.\n      this.description =\n        \"The painting is lying broken upon the floor. It is so badly burned now, that its subject has become indecipherable. What remains of the canvas is a carbonized black. You can't help but think that it is still an improvement compared to the original work.\";\n      game.items._matchbook.closed = false; // matchbook remains open after use, if not already opened.\n      if (game.state.currentMapCell.hideSecrets) {\n        // if painting still on wall\n        this.revealText(\n          \"Although the match nearly goes out before you can ignite the painting, a small flame finally finds a foothold on the canvas, and it is soon alarmingly ablaze. Thinking it unwise to burn down the house you are trapped in, you remove the painting from the wall, and stomp out the fire before it can spread any further. \\nWhen you look back at the wall that formerly held the burning painting, \"\n        );\n        return;\n      }\n      // if painting already removed from wall\n      this.revealText(\n        \"Although the match nearly goes out before you can ignite the painting, a small flame finally finds a foothold on the canvas, and it is soon alarmingly ablaze. You are suddenly inspired to end your ill-considered, if brief flirtation with pyromania, and promptly stomp out the fire before they can spread any further.\"\n      );\n      return;\n    },\n  };\n}","_pedestal":"{\"name\":\"pedestal\",\"proto\":\"table\",\"description\":\"It is a simple wooden plinth, painted white.\"}","_phonograph":"(game) => {\n  return {\n    name: \"phonograph\",\n    description:\n      \"The old phonograph has a built-in speaker, and looks like it might still work.\",\n    play () {\n      if (!game.inEnvironment(\"disc\") && !game.inInventory(\"disc\")) {\n        game.log.p(\n          \"First, you will need to find something to play on the phonograph.\"\n        );\n        return;\n      }\n      return game.items._disc.play.call(this);\n    },\n    use () {\n      this.play.call(this);\n    },\n  };\n}","_photo":"(game) => {\n  return {\n    name: \"photo\",\n    description:\n      \"The four by six inch photograph is in a cheap frame made of painted fiberboard. It's a portrait of a very old, and probably infirm black poodle, bluish cataracts clouding its eyes. There is some writing on the back of the frame.\",\n    get reverseDescription() {\n      return `There is a handwritten inscription on the back of the frame${\n        game.inInventory(this.name)\n          ? '. It says, \"My Precious Muffin\\'s 18th Birthday - 10/28/17\"'\n          : \"\"\n      }.`;\n    },\n    text: \"My Precious Muffin's 18th Birthday - 10/28/17\",\n    read () {\n      game.state.objectMode = false;\n      if (!game.inInventory(this.name)) {\n        return game.log.p(`You will need to pick up the ${this.name} first.`);\n      }\n      game.log.p(`The text on the ${this.name} reads: \\n`);\n      return game.log.cursive(this.text);\n    },\n  };\n}","_projector":"(game) => {\n  return {\n    name: \"projector\",\n    description:\n      \"It took you a moment to even recognize the brown plastic box as a film projector. It was designed for consumer use, to display Super 8mm film cartridges of the type that were once used to make home movies in the 1970's.\",\n    play () {\n      if (!game.inEnvironment(\"film\") && !game.inInventory(\"film\")) {\n        game.log.p(\n          \"First, you will need to find something to project with the projector.\"\n        );\n        return;\n      }\n      if (!game.inEnvironment(\"screen\") && !game.inInventory(\"screen\")) {\n        game.log.p(\"You are going to need a screen to project onto.\");\n        return;\n      }\n      return game.items._film.play.call(this);\n    },\n    use () {\n      this.play.call(this);\n    },\n    project () {\n      this.play.call(this);\n    },\n  };\n}","_safe":"(game) => {\n  return {\n    name: \"safe\",\n    points: 10,\n    closed: true,\n    openable: true,\n    locked: true,\n    listed: false,\n    takeable: false,\n    solution: 10281999,\n    description:\n      \"The wall safe looks rugged and well-anchored. You doubt that it could be breached by brute force, and it appears to have already successfully weathered a few such attempts. On its face, a numeric keypad resides beneath what looks like a small digital readout.\",\n    contents: [],\n    correctGuess () {\n      game.state.objectMode = false;\n      this.locked = false;\n      this.closed = false;\n      game.log.digi(\"PASSCODE ACCEPTED.\");\n      game.log.p(\n        \"Upon entering the correct passcode, the bolt inside the safe's door slides back, and the door pops open gently.\"\n      );\n      if (this.contents.length > 0) {\n        game.log.p(\n          `Inside the safe is ${game.formatList(\n            this.contents.map((item) => `${item.article} ${item.name}`)\n          )}.`\n        );\n      }\n    },\n    incorrectGuess () {\n      game.state.objectMode = false;\n      game.log.digi(\"PASSCODE INCORRECT\");\n      return;\n    },\n    open () {\n      if (this.locked) {\n        this.unlock.call(this);\n        return;\n      }\n      Object.getPrototypeOf(this).open.call(this);\n    },\n    lock () {\n      game.state.objectMode = false;\n      this.closed = true;\n      this.locked = true;\n      game.log.p(\"You lock the wall safe.\");\n    },\n    unlock () {\n      game.state.solveMode = true;\n      game.state.objectMode = false;\n      if (!this.locked) {\n        game.log.p(\"The safe is already unlocked.\");\n        return;\n      }\n      game.log.codeInline([\n        `To enter the 8-digit numerical passcode, you must type an underscore `,\n        `_`,\n        `, followed by the value enclosed in parentheses.`,\n      ]);\n      game.log.codeInline([`For example: `, `_(01234567)`]);\n      game.log.digi(\"ENTER PASSCODE:\");\n    },\n    use () {\n      this.unlock.call(this);\n    },\n  };\n}","_screen":"{\"name\":\"screen\",\"takeable\":true,\"description\":\"It is the type of portable movie screen that rolls up into itself like an old window shade.\"}","_scroll":"(game) => {\n  return {\n    name: \"scroll\",\n    flammable: true,\n    description:\n      'There is some small text, printed on a thin leather strap that was used to bind the rolled up scroll. It says, \"rezrov: Open even locked or enchanted objects\". As you unfurl the scroll, there appears to be some writing on the inside surface of the parchment, but each line of text seems to disappear as soon as it is revealed.',\n    text: \"rezrov: Open even locked or enchanted objects\",\n    use () {\n      return game.commands._rezrov();\n    },\n    cast () {\n      this.use.call(this);\n    },\n  };\n}","_sink":"(game) => {\n  return {\n    name: \"sink\",\n    listed: false,\n    description:\n      \"It is an old porcelain sink with separate taps for hot and cold water. Like everything else here, it is covered in dust and grime.\",\n    use () {\n      game.log.p(\"You try to turn on the taps, but nothing comes out.\");\n    },\n  };\n}","_sofa":"(game) => {\n  return {\n    name: \"sofa\",\n    flammable: true,\n    listed: false,\n    description:\n      \"The well-worn sitting room sofa is upholstered brown cowhide.\",\n    burn () {\n      Object.getPrototypeOf(this).burnDown.call(this);\n    },\n  };\n}","_table":"{\"name\":\"table\",\"takeable\":false,\"listed\":false,\"description\":\"The cherrywood dining table is long enough to accomodate at least twenty guests, by your estimation, although you can see only one chair.\"}","_toilet":"(game) => {\n  return {\n    name: \"toilet\",\n    listed: false,\n    description:\n      \"You are surprised to find that the bowl of the very old porcelain toilet is still full of water.\",\n    text: \"Thomas Crapper & Co.\",\n    flush () {\n      game.state.objectMode = false;\n      game.log.p(\n        \"Having pushed the lever, and watched the water exit the bowl, you can personally verify that the toilet works as expected.\"\n      );\n    },\n  };\n}","_wardrobe":"(game) => {\n  return {\n    name: \"wardrobe\",\n    takeable: false,\n    openable: true,\n    closed: true,\n    listed: false,\n    contents: [],\n    get description() {\n      const descriptionString = `The oak wardrobe is roughly four feet wide and seven feet in height and is currently${\n        this.closed ? \" closed\" : \" open\"\n      }. `;\n      if (this.closed) {\n        return descriptionString;\n      }\n      const contentsString = `There is ${\n        this.contents.length < 1\n          ? \"nothing\"\n          : game.formatList(\n              this.contents.map((item) => `${item.article} ${item.name}`)\n            )\n      } inside.`;\n      return descriptionString + contentsString;\n    },\n  };\n}"};

const eval2 = eval;
function setPrototypes(items, defaultProto) {
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
function addItemContents(items, contentsObj) {
    for (const itemName in items) {
        if (itemName in contentsObj) {
            const item = items[itemName];
            if (!item.contents) {
                item.contents = [];
            }
            const contents = contentsObj[itemName].map(itemName => items[itemName]);
            item.contents.push(...contents);
        }
    }
}
const initItems = async function (game) {
    const hydrateItems = function (items) {
        for (const itemName in items) {
            const item = items[itemName];
            let output = item;
            try {
                if (typeof item === "string") {
                    output = eval2(item);
                }
                if (typeof output === "function") {
                    output = output(game);
                }
                items[itemName] = output;
            }
            catch (err) {
                try {
                    if (typeof item === "string") {
                        output = JSON.parse(item);
                    }
                }
                catch (err) {
                    output = item;
                }
            }
            finally {
                items[itemName] = output;
            }
        }
    };
    hydrateItems(items);
    const ItemProto = initItemProto(game);
    setPrototypes(items, ItemProto);
    addItemContents(items, itemContents);
    return items;
};

function MapCell(game) {
    // Prototype definition for a single cell on the map grid (usually a room)
    return {
        name: "Nowhere",
        locked: false,
        lockText: "",
        unlockText: "",
        hiddenSecrets: false,
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
        description: "You find yourself in a non-descript, unremarkable, non-place. Nothing is happening, nor is anything of interest likely to happen here in the future.",
        smell: "Your nose is unable to detect anything unusual, beyond the smell of age and decay that permeates the entirety of the decrepit building.",
        sound: "The silence is broken only by the faint sound of the wind outside, and the occasional creak of sagging floorboards underfoot.",
        hiddenEnv: [],
        visibleEnv: [],
        get env() {
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
            const itemsWithContainers = itemsInEnv.filter((item) => item.contents && item.contents.length > 0);
            const openContainerItems = itemsWithContainers.filter((containerItem) => !containerItem.closed);
            return openContainerItems;
        },
        // returns the items available in the environment that are nested inside other objects
        get containedEnv() {
            const containedItems = this.openContainers.length > 0
                ? this.openContainers.map((item) => {
                    return item.contents || [];
                })
                : [];
            return containedItems.flat();
        },
        removeFromEnv: function (item) {
            const itemName = typeof item === "string" ? item : item.name;
            const envName = game.fromWhichEnv(itemName);
            if (envName === "containedEnv") {
                this.removeFromContainer(itemName);
            }
            else if (!envName) {
                game.log.error(`Item ${itemName} not found in any environment`);
            }
            else {
                const thisEnv = this[envName];
                const filteredEnv = thisEnv.filter((it) => it.name !== itemName);
                this[envName] = filteredEnv;
            }
        },
        removeFromContainer: function (item) {
            var _a;
            // TODO: make sure this takes into account nested containers and items in inventory
            const itemName = typeof item === "string" ? item : item.name;
            const [container] = this.openContainers.filter((thing) => (thing.contents || []).map((it) => it.name).includes(itemName));
            if (!container) {
                game.log.error(`Item ${itemName} not found in any container`);
            }
            if (!game.inEnvironment(container.name)) {
                game.log.error(`Container ${container.name} not in environment`);
            }
            else {
                const filteredContainer = (_a = container.contents) === null || _a === void 0 ? void 0 : _a.filter((item) => {
                    return item.name !== itemName;
                });
                container.contents = filteredContainer;
            }
        },
        addToEnv: function (itemName) {
            const itemObj = game.items[`_${itemName}`];
            return this.visibleEnv.push(itemObj);
        },
    };
}

const mapKey = function (game) {
    // Prototype definition for a single cell on the map grid (usually a room)
    const MapCellProto = MapCell(game);
    const setMapCellPrototypes = (mapKey, proto = MapCellProto) => {
        Object.keys(mapKey).forEach((cell) => {
            Object.setPrototypeOf(mapkey[cell], proto);
        });
    };
    const stockDungeon = (mapKey) => {
        Object.keys(mapKey).forEach((key) => {
            const subEnvNames = Object.keys(mapKey[key]).filter(keyName => keyName.toLowerCase().includes("env"));
            for (const subEnvName of subEnvNames) {
                let roomEnv = mapKey[key][subEnvName];
                let newEnv = [];
                if (roomEnv.length) {
                    roomEnv.forEach((item) => {
                        let itemObj = typeof item === "string" ? game.items[`_${item}`] : item;
                        if (itemObj) {
                            newEnv.push(itemObj);
                        }
                        else {
                            console.log(`Cannot stock ${item}. No such item.`);
                        }
                    });
                }
                mapKey[key][subEnvName] = newEnv;
            }
        });
    };
    const mapkey = {
        "0": {
            locked: true,
            lockText: "An attempt has been made to board up this door. Reaching between the unevenly spaced boards, you try the doorknob and discover that it is also locked.",
        },
        A: {
            name: "Freedom!",
            locked: false,
            closed: true,
            get lockText() {
                return `The formidable wooden front door will not open. It looks as old as the rest of the building, and like the wood panelled walls of the entrance hall, it is dark with countless layers of murky varnish. It is ${this.locked ? "locked" : "unlocked"}.`;
            },
            get description() {
                if (game.state.turn < 3) {
                    game.captured();
                    return "";
                }
                game.state.score += 50;
                return game.winner("\nYou have escaped!\n");
            },
        },
        a: {
            name: "Freedom!",
            locked: true,
            closed: true,
            get lockText() {
                return `The kitchen door will not open. It is ${this.locked ? "locked" : "unlocked"}.`;
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
            description: "A single dim bulb, dangling on a cord from the low, unfinished ceiling, is barely enough to illuminate the room. The floors appear to be composed of compressed earth, left unfinished since the space was initially excavated more than a century ago.  ",
            smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces.",
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
            smell: "It smells strongly of old, damp dungeon – a mix of dirt and mildew with perhaps a hint of grue feces.",
            get description() {
                // @ts-ignore - this property will be available when the object's prototype is set later
                return this.hideSecrets ? this.des1 : this.des2;
            },
            hiddenEnv: ["lantern", "basement_door"],
            visibleEnv: ["grue"],
        },
        D: {
            name: "Bathroom",
            description: "The bathroom is tiled with hundreds of tiny, white, hexagonal tiles. It features the usual bathroom amenities, like a sink, a tub and a commode.",
            visibleEnv: ["sink", "bathtub", "toilet", "knife"],
        },
        E: {
            name: "Guest Room",
            description: "The guest room is modestly furnished, with little more than a small bed and a dresser.",
            visibleEnv: ["bed", "dresser", "dresser_drawer"],
        },
        F: {
            name: "Sitting room",
            description: "A small sitting room adjoins the master bedroom. It contains a cushioned armchair and a small sofa, both facing a coffee table.",
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
            description: "The bathroom adjoining the bedroom has all of the expected fixtures, though they are corroded and covered in filth. ",
            visibleEnv: ["toilet", "sink", "bathtub"],
        },
        I: {
            name: "Cell",
            description: "It is a dark and scary cell.",
            locked: true,
            closed: true,
            smell: "It smells like dog waste.",
            get lockText() {
                return `An ominous-looking, rusted steel door blocks your path. It is ${this.locked ? "locked" : "unlocked"}.`;
            },
            visibleEnv: ["dog"],
        },
        J: {
            name: "Parlor",
            get description() {
                return `This room looks like it was used to screen films and recordings. There is a tall white pedestal${game.inEnvironment("projector")
                    ? ", supporting a squarish plastic Super 8 projector,"
                    : ""} in the center of the room. `;
            },
            visibleEnv: ["projector", "screen", "pedestal", "chair", "phonograph"],
        },
        "^": {
            name: "Second floor hallway, north",
            description: "You are at the top of a wide wooden staircase, on the second floor of the old house.",
            visibleEnv: [],
        },
        "-": {
            name: "Second floor hallway, south",
            description: "It looks like there are a couple of rooms on either side of the broad hallway, and a small broom closet at the south end.",
            visibleEnv: [],
        },
        "+": {
            name: "Study",
            visibleDescription: "The walls of the dark, wood-panelled study are lined with bookshelves, containing countless dusty tomes. Behind an imposing walnut desk is a tall-backed desk chair.",
            smell: "The pleasantly musty smell of old books emanates from the bookshelves that line the wall.",
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
            hiddenEnv: ["safe"],
            hiddenDescription: "In space where a painting formerly hung there is a small alcove housing a wall safe.",
            get description() {
                if (this.hideSecrets) {
                    return (this.visibleDescription +
                        "\n" +
                        "On the wall behind the chair hangs an ornately framed painting.");
                }
                return this.visibleDescription + "\n" + "\n" + this.hiddenDescription;
            },
        },
        "#": {
            name: "Staircase landing",
            description: "You are on the landing of a worn oak staircase connecting the first and second floors of the old abandoned house.",
            visibleEnv: [],
        },
        "%": {
            name: "Entrance hall, south",
            description: "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the north end of the hall is a wide oak staircase that connects the first and second floors of the old house.",
            visibleEnv: ["door", "note"],
        },
        "=": {
            name: "Entrance hall, north",
            description: "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the rear of the hall is a wide oak staircase that connects the first and second floors of the old house.",
            visibleEnv: [],
        },
        "@": {
            name: "Stone staircase, top",
            description: "You are at the top of a stone staircase that leads down to the basement. A faint cold draft greets you from below.",
            smell: "A vaguely unfresh scent wafts up from the basement.",
            visibleEnv: ["collar"],
            sound: "You do not hear anything.",
        },
        "(": {
            name: "Stone staircase, landing",
            description: "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
            smell: "As you descend, the smell of mildew and earth becomes noticeable.",
            sound: "For a moment, you are certain you can hear what sounds like muffled barking, but when you stop moving and strain to hear it again, the sound has stopped.",
        },
        ")": {
            name: "Stone staircase, bottom",
            description: "You are standing on a stone staircase leading upwards to the first floor.",
            smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces.",
            sound: "You can definitely hear the sound of distant, muffled barking. It is coming from the east!",
        },
        $: {
            name: "Broom closet",
            hiddenSecrets: true,
            hiddenEnv: ["glove"],
            visibleEnv: ["chain"],
            des1: "The small closet is dark, although you can see a small chain hanging in front of you.",
            get des2() {
                const hidden = this.hiddenEnv;
                const text = "The inside of this small broom closet is devoid of brooms, or much of anything else, for that matter";
                const plural = hidden.length > 1 ? "y" : "ies";
                return (text +
                    (hidden.length
                        ? `, with the exception of ${formatList(hidden.map((item) => {
                            // @ts-ignore - when game is initialized, the stockDungeon method will replace the name of the item with the actual item object
                            return `${item.article} ${item.name}`;
                        }))} which occup${plural} a dusty corner.`
                        : "."));
            },
            get description() {
                // @ts-ignore - this property will be available when the object's prototype is set later
                return this.hideSecrets ? this.des1 : this.des2;
            },
        },
        X: {
            name: "Dining room",
            visibleEnv: ["chair", "table"],
            description: "A long cherry dining table runs the length of this formal dining room.",
        },
        Z: {
            name: "Kitchen",
            visibleEnv: ["maps", "backdoor"],
            description: "It is quite large for a residential kitchen. While only a few of the original appliances remain, gritty outlines on the walls and floor suggest it was once well appointed. Now it is an echoing tile cavern.",
            smell: "It smells like a dusty abandoned building. And chicken soup.",
        },
    };
    // every cell defined in mapkey will inherit from MapCellProto
    setMapCellPrototypes(mapkey);
    // replace the name of each item with the actual item object
    stockDungeon(mapkey);
    return mapkey;
};

// This object contains most of the text that is displayed to the user. Each key is a string to be is referenced by a game method. Each value is either a string, an array of strings, or a function that returns a string. The function is passed the game object as an argument, so that it can access the current state of the game, and the log methods.
const descriptions = {
    preface: "You slowly open your eyes. Your eyelids aren't halfway open before the throbbing pain in your head asserts itself. The last thing you can remember is taking your dog for a walk. Your current surroundings look entirely unfamiliar.",
    intro: (game) => {
        const intro_1 = "\nWelcome!\nAs a fan of old Infocom™ interactive fiction games, I thought it would be fun to hide a text adventure in the browser's JavaScript game.log. Try it out by typing in the console below. Have fun!\n";
        game.log.title("consoleGame");
        game.log.custom("by Dennis Hodges\ncopyright 2019-2023", "font-size:100%;color:lightgray;padding:0 1em;");
        game.log.intro(intro_1);
        game.log.codeInline(descriptions.introOptions(game));
        return `___________________________________________________________`;
    },
    introOptions: (game) => {
        const existingGame = [
            "[ It looks like you have an unsaved game in progress from a previous session. If you would like to continue, type ",
            "resume",
            ". If you would like to load a saved game, type ",
            "restore",
            ". To begin a new game, please type ",
            "start",
            ". ]"
        ];
        const commonOptions = [
            "[ Please type ",
            "help ",
            "for instructions, ",
            // "commands ",
            // "for a list of available commands, ",
            "restore ",
            "to load a saved game, or ",
        ];
        const options = [
            ...commonOptions,
            "resume ",
            "to resume the game. ]"
        ];
        const initialOptions = [
            ...commonOptions,
            "start ",
            "to start the game. ]"
        ];
        if (game.state.turn === null) {
            return game.unfinishedGame() ? existingGame : initialOptions;
        }
        return options;
    },
    captured: ["As you step out onto the front porch, you struggle to see in the bright midday sun, your eyes having adjusted to the dimly lit interior of the house. You hear a surprised voice say, \"Hey! How did you get out here?!\" You spin around to see the source of the voice, but something blunt and heavy has other plans for you and your still aching skull. You descend back into the darkness of sleep.", "Groggily, you lift yourself from the floor, your hands probing the fresh bump on the back of your head."],
    winner: (game, additionalText) => {
        if (additionalText) {
            game.log.win(additionalText);
        }
        game.log.win("You win!! Congratulations and thanks for playing!");
    },
    gameOver: (game) => game.log.codeInline(["[Game over. Please type ", "start ", "to begin a new game.]"]),
    dead: "You have died. Of course, being dead, you are unaware of this unfortunate turn of events.",
    help: (game) => {
        // Greeting to be displayed at the beginning of the game
        const baseStyle = `font-family:${primaryFont};color:pink;font-size:105%;line-height:1.5;`;
        const italicCodeStyle = "font-family:courier;color:#29E616;font-size:115%;font-style:italic;line-height:2;";
        const codeStyle = "font-family:courier;color:#29E616;font-size:115%;line-height:1.5;";
        const text = ["Valid commands are one word long, with no spaces. Compound commands consist of at most two commands, separated by a carriage return or a semicolon. For example:\n", "get\n", "What would you like to take?\n", "lamp\n", "You pick up the lamp.\n", "or,\n", "get;lamp\n", "What would you like to take?\nYou pick up the lamp."];
        const styles = [baseStyle, codeStyle, italicCodeStyle, codeStyle, italicCodeStyle, baseStyle, codeStyle, italicCodeStyle];
        game.log.inline(text, styles);
        const text_2 = ["Typing ", "inventory ", "or ", "i ", "will display a list of any items the player is carrying. \nTyping ", "look ", "or ", "l ", "will give you a description of your current environs in the game. \nCommands with prepositions are not presently supported, and ", "look ", "can only be used to \"look around\", and not to \"look at\" something. Please instead use ", "examine ", "or its shortcut ", "x ", "to investigate an item's properties. \nThe player may move in the cardinal directions– ", "north", ", ", "south", ", ", "east", " and ", "west ", "as well as ", "up ", "and ", "down. ", "Simply type the direction you want to move. These may be abbreviated as ", "n", ", ", "s", ", ", "e", ", ", "w", ", ", "u ", "and ", "d ", ", respectively."];
        game.log.codeInline(text_2, baseStyle, codeStyle);
        const text_3 = ["You may save your game progress (it will be saved to localStorage) by typing ", "save", ". You will then be asked to select a save slot, ", "_0 ", "through ", "_9 ", "(remember, user input can't begin with a number). Typing ", "help ", "will display the in-game help text."];
        game.log.codeInline(text_3, baseStyle, codeStyle);
        game.log.codeInline(descriptions.introOptions(game));
    },
    restore: (game, slotList) => {
        game.log.codeInline(["saved games:\n", slotList]);
        game.log.codeInline(["Please choose which slot number (0 through 9) to restore from. To restore, type an underscore, ", "_ ", "immediately followed by the slot number."]);
        const exampleSlot = slotList[0] || "_0";
        game.log.codeInline([`For example, type `, exampleSlot, ` to select slot ${exampleSlot.slice(1)}.`]);
    },
    save: (game) => {
        game.log.codeInline(["Please choose a slot number (0 through 9) to save your game. To save to the selected slot, type an underscore, ", "_", " immediately followed by the slot number."]);
        game.log.codeInline([`For example, type `, `_3`, ` to select slot 3.`]);
    },
    doorLock: "You hear a short metallic scraping sound, ending in a click. It sounds like the front door being locked from the outside.",
};

var timers = [
    // Timers
    // Front door lock timer
    (game) => {
        if (game.state.turn === 2 && !game.items._door.locked) {
            game.displayText(descriptions.doorLock);
            game.items._door.closed = true;
            game.items._door.locked = true;
            game.mapKey[game.items._door.lockedTarget].locked = true;
            game.mapKey[game.items._door.closedTarget].closed = true;
        }
    },
    // Main game timer
    (game) => {
        if (game.state.turn >= game.timeLimit && !game.state.gameOver) {
            return game.dead("You don't feel so well. It never occurs to you, as you crumple to the ground, losing consciousness for the final time, that you have been poisoned by an odorless, invisible, yet highly toxic gas.");
        }
    },
    // Lightsource timer
    (game) => {
        game.lightSources.forEach((source) => source.decrementCounter());
    },
    // Grue timer
    (game) => {
        if (game.inEnvironment("grue")) {
            game.items._grue.lurk();
        }
    },
];

const { getStorage, removeStorage, setStorage } = storage;
// commands that are reserved words in JavaScript but we will overwrite anyway
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
    "_save_slot",
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
let gameContext;
class Game {
    constructor() {
        this.maps = [];
        this.mapKey = {};
        this.items = {};
        this.commands = {};
        this.commandList = [];
        this.timeLimit = 300;
        this.log = customConsole;
        this.confirmationCallback = () => { };
        this.timers = [];
        this.lightSources = [];
        this.descriptions = {};
        this.initialState = {
            solveMode: false,
            prefMode: false,
            restoreMode: false,
            gameOver: false,
            pendingAction: null,
            turn: 0,
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
            history: [],
            get currentCellCode() {
                return gameContext.maps[this.position.z][this.position.y][this.position.x];
            },
            get currentMapCell() {
                return gameContext.mapKey[this.currentCellCode];
            },
            get env() {
                return this.currentMapCell.env;
            },
            get combinedEnv() {
                return Object.values(this.env).flat();
            },
        };
        const window = globalThis;
        // gameContext is used to make `this` available from inside `this.state` getters
        gameContext = this;
        this.state = deepClone(this.initialState);
        this.commandList = Commands(this);
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
    turnDaemon(commandName, interpreterFunction) {
        const window = globalThis;
        if (this.state.gameOver) {
            this.displayText(this.descriptions.gameOver);
        }
        else {
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
            }
            catch (error) {
                // recognized command word used incorrectly
                // this.log.error(error);
                this.log.p("That's not going to work. Please try something else.");
            }
        }
    }
    addToHistory(commandName) {
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
    registerTimer(timer) {
        this.timers.push(timer);
    }
    displayText(text, value) {
        if (typeof text === "function") {
            const result = text(this, value);
            if (typeof result === "string") {
                this.displayText(result);
            }
        }
        else if (Array.isArray(text)) {
            text.forEach((line) => this.displayText(line));
        }
        else if (text) {
            this.log.p(text);
        }
    }
    // returns a list of items available in the current environment, as a formatted string
    itemsInEnvironment() {
        const env = this.state.currentMapCell.hideSecrets
            ? this.state.env.visibleEnv
            : [...this.state.env.visibleEnv, ...this.state.env.hiddenEnv];
        const listedItems = env.filter((item) => item.listed);
        return (listedItems.length &&
            formatList(listedItems.map((item) => `${item.article} ${item.name}`)));
    }
    fromWhichEnv(itemName) {
        const itemsInEnvironment = this.state.combinedEnv.map((item) => item.name);
        if (!itemsInEnvironment.includes(itemName)) {
            return false;
        }
        const envEntries = Object.entries(this.state.env);
        const theEnv = envEntries.reduce((env, entry) => {
            const names = entry[1].length ? entry[1].map((item) => item.name) : [];
            if (names.includes(itemName)) {
                env = entry[0];
            }
            return env;
        }, false);
        // return theEnv || "containedEnv";
        return theEnv;
    }
    inEnvironment(itemName) {
        if (itemName === "all") {
            return this.items._all;
        }
        const whichEnv = this.fromWhichEnv(itemName);
        const objectFromEnvironment = whichEnv
            ? this.state.env[whichEnv].filter((item) => item.name === itemName)[0]
            : false;
        return objectFromEnvironment;
    }
    // returns an object from the inventory, or the entire inventory
    inInventory(itemName) {
        if (itemName === "all") {
            return this.items._all;
        }
        const [objectFromInventory] = this.state.inventory.filter((item) => item.name === itemName);
        return objectFromInventory;
    }
    // returns a list of items available in the environment that are nested inside other objects, as a formatted string
    nestedItemString() {
        const openContainers = this.state.currentMapCell.openContainers;
        const containedItems = openContainers.map((obj) => {
            const name = `${obj.article} ${obj.name}`; // the name of the container
            const objectNames = obj.contents.map((item) => `${item.article} ${item.name}`); // array of names of the objects inside the container (with articles)
            return [name, objectNames.length ? formatList(objectNames) : void 0];
        });
        const containedString = containedItems.map((container) => {
            return container[1]
                ? `There is ${container[0]}, containing ${container[1]}.`
                : "";
        });
        return containedString.join("\n");
    }
    formatList(list) {
        return formatList(list);
    }
    possibleMoves(z, y, x) {
        // Returns an array of directions (as strings) that player can move in from present location.
        const n = this.maps[z][y - 1] !== undefined && this.maps[z][y - 1][x] !== "*"
            ? "north"
            : false; // will equal the string "north" if it is possible to move one cell north, otherwise false
        const s = this.maps[z][y + 1] !== undefined && this.maps[z][y + 1][x] !== "*"
            ? "south"
            : false;
        const e = this.maps[z][y][x + 1] !== undefined && this.maps[z][y][x + 1] !== "*"
            ? "east"
            : false;
        const w = this.maps[z][y][x - 1] !== undefined && this.maps[z][y][x - 1] !== "*"
            ? "west"
            : false;
        const u = this.maps[z + 1] !== undefined && this.maps[z + 1][y][x] !== "*"
            ? "up"
            : false;
        const d = this.maps[z - 1] !== undefined && this.maps[z - 1][y][x] !== "*"
            ? "down"
            : false;
        let options = [n, s, e, w, u, d];
        let result = options.filter((dir) => dir);
        return result;
    }
    // Applies formatList() utility function to the result of possibleMoves() function to return a formatted string listing the possible directions of player movement.
    movementOptions() {
        return formatList(this.possibleMoves(this.state.position.z, this.state.position.y, this.state.position.x), true);
    }
    variableWidthDivider(width = window.innerWidth) {
        return "_".repeat(width / 9);
    }
    // Returns a string containing the name of the current room, and the current turn number
    currentHeader(columnWidth = window.innerWidth) {
        const roomName = this.state.currentMapCell.name;
        const turn = `Turn : ${this.state.turn}`;
        const gapSize = (columnWidth / 12) - roomName.length - turn.length;
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
        this.log.p(description + "\n" + moveOptions + "\n" + itemStr + "\n" + nestedItemStr);
        return null;
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
    saveGame(slot) {
        const slotName = `save.${slot}`;
        if (getStorage(slotName) && !this.state.confirmMode) { // if the slot is already in use, ask for confirmation
            this.log.invalid("That save slot is already in use.");
            this.log.codeInline([
                `type `,
                `yes `,
                `to overwrite slot ${slot} with current game data.`,
            ]);
            this.state.confirmMode = true;
            this.confirmationCallback = () => this.saveGame(slot);
        }
        else { // otherwise, save the game
            this.state.saveMode = false;
            this.state.confirmMode = false;
            try {
                setStorage(slotName, this.state.history);
                this.log.info(`Game saved to slot ${slot}.`);
                this.describeSurroundings();
            }
            catch (err) {
                this.log.invalid(`Save to slot ${slot} failed.`);
                this.log.error(err);
            }
        }
    }
    // restoreGame() restores a saved game from local storage, given a slot number, and replays the game history
    async restoreGame(slotName) {
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
        this.displayText(descriptions.captured[0]);
        this.state.position = this.state.startPosition;
        this.state.turn += 3;
        for (let i = 0; i < 3; i++) {
            this.commands.wait;
        }
        this.items._door.closed = true;
        this.items._door.locked = true;
        this.mapKey[this.items._door.lockedTarget].locked = true;
        this.mapKey[this.items._door.closedTarget].closed = true;
        this.displayText(descriptions.captured[1]);
    }
    // winner() is called when the player wins
    winner(text) {
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
    dead(text) {
        this.displayText(descriptions.dead, text);
        removeStorage("history");
        this.state.gameOver = true;
        this.displayText(this.descriptions.gameOver);
    }
    // displayItem() displays a gallery item in the browser window
    displayItem(galleryItem = { title: "untitled", artist: "unknown", info: null, source: "", dimensions: null, width: null, height: null }) {
        const contentDiv = document.getElementById("console-game-content");
        if (contentDiv) {
            contentDiv.innerHTML = "";
            contentDiv.setAttribute("style", "width:100vw;background-color:inherit;color:inherit;position:relative;display:flex;flex-direction:column;justify-content:center;align-content:center;");
            const iFrame = document.createElement("iframe");
            iFrame.src = galleryItem.source;
            // iFrame.playsinline = true;
            // iFrame.autoplay = true;
            // iFrame.muted = true;
            iFrame.setAttribute("style", `width:${galleryItem.width ? galleryItem.width : "min(38vw,720px)"};height:${galleryItem.height ? galleryItem.height : "min(25vw,480px)"};margin:auto`);
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
                info.setAttribute("style", "color:inherit;font-style:italic;font-size:1em;padding-bottom:2em;");
                contentDiv.appendChild(info);
            }
        }
        // window.scrollTo(0, 10000);
    }
    // start() initializes a new game, or re-describes the surroundings if the game is already in progress
    start() {
        const { turn, gameOver } = this.state;
        if (turn < 1 || gameOver) {
            return this.initializeNewGame().then(() => {
                this.displayText(this.descriptions.preface);
                console.log("*", this.describeSurroundings());
                return this.describeSurroundings();
            });
        }
        return this.describeSurroundings();
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
    bindCommandToFunction(interpreterFunction, commandAliases, daemon = this.turnDaemon) {
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
                if (!(alias in globalThis) ||
                    RESERVED_WORDS_TO_OVERWRITE.includes(alias)) {
                    // The following (commented-out) line was causing a bug, so do not revert to it.
                    // Object.defineProperty(globalThis, alias.trim(), {get: interpretCommand});
                    Object.defineProperty(globalThis, alias.trim(), {
                        get() {
                            interpretCommand();
                        },
                    });
                }
            });
        }
        catch (err) {
            // fail silently
        }
    }
    // Applies bindCommandToFunction() to an array of all of the commands to be created
    initCommands(commands) {
        commands.forEach((commandEntry) => {
            let [interpreterFunction, aliases] = commandEntry;
            this.bindCommandToFunction(interpreterFunction, aliases);
        });
    }
    addToInventory(itemArray) {
        // add one of more items to player inventory
        itemArray.forEach((item) => {
            if (item instanceof String) {
                // accepts a string argument for a single item
                return this.state.inventory.push(this.items[`_${item}`]);
            }
            return this.state.inventory.push(item); // accepts an array for multiple items
        });
    }
    removeFromInventory(item) {
        // remove item from player inventory
        const filtered = this.state.inventory.filter((invItem) => {
            if (typeof item === "string") {
                return invItem.name !== item;
            }
            return invItem.name !== item.name;
        });
        this.state.inventory = filtered;
    }
    setCommandsFromCommandList(commandList) {
        // this.commandList = commandList;
        this.commands = this.commandList.reduce((commandMap, commandEntry) => {
            const [interpreterFunction, aliases] = commandEntry;
            const [commandName] = aliases.split(",");
            commandMap[commandName.trim()] = interpreterFunction.bind(this);
            return commandMap;
        }, {});
    }
    // initializeNewGame() is called when the game is started, or when the player dies and the game is restarted
    async initializeNewGame() {
        this.resetGame();
        this.maps = maps;
        this.descriptions = descriptions;
        this.items = deepClone(await initItems(this));
        this.commandList = Commands(this);
        this.setCommandsFromCommandList(this.commandList);
        this.initCommands(this.commandList);
        this.mapKey = deepClone(mapKey(this));
        // fill inventory with starting items
        this.addToInventory(["no_tea", "me"]);
        // set timers
        timers.forEach(timer => {
            this.registerTimer(timer);
        });
    }
    // replayHistory() takes an array of commands and replays them in order, restoring the game state to the point at which the array was generated
    replayHistory(commandList) {
        // Used to load saved games
        this.state.restoreMode = false;
        this.log.groupCollapsed("Game loading..."); // This conveniently hides all of the console output that is generated when the history is replayed, by nesting it in a group that will be displayed collapsed by default
        commandList.forEach((command) => {
            // replay each command in order
            Function(`${command}`)(); // execute the command
        });
        return this.log.groupEnd("Game loaded."); // text displayed in place of collapsed group
    }
    // bindInitialCommands() binds the commands essential to start the game to the global object, so that they can be invoked by the player in the console without needing to type the invocation operator "()" after the name.
    bindInitialCommands() {
        // enable "start" and other essential commands
        const initialCommands = [
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
    solveCode(value) {
        // solve code
        this.state.solveMode = false;
        const puzzles = this.state.combinedEnv.filter((item) => item.solution);
        if (puzzles.length < 1) {
            return;
        }
        const solved = puzzles.filter((puzzle) => puzzle.solution === value);
        if (solved.length === 0) {
            puzzles.forEach((unsolved) => unsolved.incorrectGuess && unsolved.incorrectGuess());
            return;
        }
        solved.forEach((pzl) => pzl.correctGuess && pzl.correctGuess());
    }
    // setPreference() is used to set a preference (font, size, color) that will be applied when the game is reloaded
    setPreference(value) {
        // set preference
        this.log.info(`Value for ${this.state.pendingAction} will be set to ${value}`);
        setStorage(`prefs.${this.state.pendingAction}`, value);
        setStorage("prefMode", "true");
        this.log.info("Reload the page to apply the new preference.");
    }
    // setValue() is used to set a value in the game state, either by solving a puzzle, or by setting a preference
    setValue(value) {
        return this.state.solveMode
            ? this.solveCode(value)
            : this.state.prefMode
                ? this.setPreference(value)
                : this.log.invalid("setValue _() called out of context.");
    }
    // toggleVerbosity() is used to toggle the verbosity of the game's output. If verbose mode is on, then describeSurroundings() will be called every on every turn, not just when the player moves.
    toggleVerbosity() {
        if (this.state.verbose) {
            this.state.verbose = false;
            this.log.p("Verbose mode off.");
            return;
        }
        this.state.verbose = true;
        this.log.p("Maximum verbosity.");
    }
}

window.CONSOLE_GAME_DEBUG = true;
// Wait for page to load
window.onload = () => {
    // Create game object.
    const game = new Game();
    const prefMode = localStorage.getItem("ConsoleGame.prefMode");
    if (prefMode) {
        localStorage.removeItem("ConsoleGame.prefMode");
        game.commands.resume();
    }
    else {
        return game.intro();
    }
};
window.scroll(0, 0);
