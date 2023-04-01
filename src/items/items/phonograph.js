export default (game) => {
  return {
    name: "phonograph",
    description:
      "The old phonograph has a built-in speaker, and looks like it might still work.",
    play () {
      if (!game.inEnvironment("disc") && !game.inInventory("disc")) {
        game.log.p(
          "First, you will need to find something to play on the phonograph."
        );
        return;
      }
      return game.items._disc.play.call(this);
    },
    use () {
      this.play.call(this);
    },
  };
};
