export default (game) => {
  return {
    name: "projector",
    description:
      "It took you a moment to even recognize the brown plastic box as a film projector. It was designed for consumer use, to display Super 8mm film cartridges of the type that were once used to make home movies in the 1970's.",
    play () {
      if (!game.inEnvironment("film") && !game.inInventory("film")) {
        game.log.p(
          "First, you will need to find something to project with the projector."
        );
        return;
      }
      if (!game.inEnvironment("screen") && !game.inInventory("screen")) {
        game.log.p("You are going to need a screen to project onto.");
        return;
      }
      return game.items._film.play.call(this);
    },
    use () {
      this.play.call(this);
    },
    project () {
      this.play.call(this);
    },
  };
};
