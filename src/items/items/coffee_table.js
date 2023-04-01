export default (game) => {
  return {
    name: "coffee_table",
    listed: false,
    takeable: false,
    description () {
      return `The low, four-legged table has nothing on it${
        game.state.env.visibleEnv.includes("photo")
          ? " except for a small, framed photo."
          : "."
      }`;
    },
  };
};
