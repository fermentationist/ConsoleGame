import { getRandomInt } from "../helpers";
import { primaryFont, textColor, fontSize, pStyle } from "../prefs";

// each style object listed here will be used to create a custom console method by customConsole.ts. They must each start with an underscore, because when rollup builds the project into a single file, the names of the style objects will polluted the global namespace. The underscore is removed when the style object is used to create a custom console method.

// add each of the following exports to a single object, and then export that object. This is necessary because rollup will not allow you to export multiple objects from a single file. The object will be used to create the custom console methods in customConsole.ts.

export default {
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
    logType: "log",
  },
  inventory: {
    style: `
      font-size:calc(1.2 * ${fontSize});
      color:cyan;
      font-family:${primaryFont};
      padding:0 1em;
    `,
    logType: "log",
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
    logType: "log",
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
    logType: "log",
  },
  header: {
    style: `
      font-size:calc(1.25 * ${fontSize});
      font-weight:bold;
      color:${textColor};
      font-family:${primaryFont};
      padding:0 1em;
    `,
    logType: "log",
  },
  groupTitle: {
    style: `
      font-size:calc(1.25 * ${fontSize});
      color:#75EA5B;
      font-family:${primaryFont};
    `,
    logType: "group",
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
    color:rgb(${255 - getRandomInt(0, 10)}, ${68 + getRandomInt(0, 10)}, ${
    0 + getRandomInt(0, 10)
  });
    font-size:${1.5 + Math.random() / 4}em;
    opacity:${1 - Math.random() / 2};
  `,
  getScreamStyle: (index: number) => `
    font-family:'courier new';
    color:rgb(${255 + getRandomInt(0, 10)}, ${33 + getRandomInt(0, 10)}, ${
    33 + getRandomInt(0, 10)
  });
    font-size:${1.2 + index / 3}em;
  `,
};
