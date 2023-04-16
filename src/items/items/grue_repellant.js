export default (game) => {
  return {
    name: "grue_repellant",
    defective: Math.random() < 0.03,
    weight: 3,
    count: 3,
    points: 3,
    article: "some",
    description: "A 12oz can of premium aerosol grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting.",
    use () {
      game.state.objectMode = false;
      if (!game.inInventory(this.name)) {
        return game.inEnvironment(this.name) ? game.log.p("You will need to pick it up first.") : game.log.p("You don't see that here.");
      } else if (this.used) {
        return game.log.p("Sorry, but it has already been used.");
      } else if (this.defective) {
        this.used = true;
        return game.log.p("Nothing happens. This must be one of the Math.random() < 0.03 of grue_repellant cans that were programmed to be, I mean, that were accidentally manufactured defectively. Repeated attempts to coax repellant from the aerosol canister prove equally fruitless.");
      } else {
        this.used = true;
        this.activated = true;
        game.state.repellantMode = true;
        return game.log.p("A cloud of repellant hisses from the canister, temporarily obscuring your surroundings. By the time it clears, your head begins to throb, and you feel a dull, leaden taste coating your tongue. The edges of your eyes and nostrils feel sunburnt, and there is also a burning sensation to accompany an unsteady buzzing in your ears. Although you are not a grue, you find it to be more than somewhat off-putting.");
      }
    },
    spray () {
      game.state.objectMode = false;
      return this.use();
    },
    drink () {
      game.state.objectMode = false;
      game.dead("Drinking from an aerosol can is awkward at best, but still you manage to ravenously slather your chops with the foaming grue repellant. You try to enjoy the searing pain inflicted by this highly caustic (and highly toxic!) chemical as it dissolves the flesh of your mouth and throat, but to no avail. It is not delicious, and you are starting to realize that there are some non-trivial drawbacks to willingly ingesting poison. Oops.");
    },
    decrementCounter () {
      if (this.activated && this.count > 0) {
        --this.count;
        if (this.count === 0) {
          game.log.p("The grue repellant has probably worn off by now.");
          this.activated = false;
          game.state.repellantMode = false;
          return;
        }
      }
    }
  }
}