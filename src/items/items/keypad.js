export default (game) => {
  return {
    name: "keypad",
    takeable: false,
    openable: true,
    closed: true,
    listed: false,
    solution: null,
    proto: "safe",
    containedIn: "_safe",
    closedTarget: "_safe",
    contents: [],
    description: "The keypad has a liquid crystal display screen and a row of buttons numbered 0 through 9.",
  };
};