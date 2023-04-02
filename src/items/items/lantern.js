export default (game) => {
  return {
    name: "lantern",
    flammable: false,
    activated: false,
    points: 5,
    proto: "matchbook",
    get description() {
      return `The old brass lantern is the quaint sort that burns hydrocarbons to produce light. It is currently ${
        this.activated ? "lit." : "extinguished."
      }`;
    },
    use () {
      game.state.objectMode = false;
      if (!game.inInventory("matchbook")) {
        game.log.p("You don't have the means to light a fire.");
        return;
      }
      if (this.count === 0) {
        game.log.p("The lantern appears to be out of fuel.");
        return;
      }
      game.items._matchbook.closed = false;
      this.activated = true;
      this.count = 250;
      game.log.p(
        "Lighting the lantern with the match produces a brighter, longer lasting source of light."
      );
    },
    light () {
      this.use.call(this);
    },
    burn () {
      this.use.call(this);
    },
  };
};
