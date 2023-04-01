export default (game) => {
  return {
    name: "toilet",
    listed: false,
    description:
      "You are surprised to find that the bowl of the very old porcelain toilet is still full of water.",
    text: "Thomas Crapper & Co.",
    flush () {
      game.state.objectMode = false;
      game.log.p(
        "Having pushed the lever, and watched the water exit the bowl, you can personally verify that the toilet works as expected."
      );
    },
  };
};
