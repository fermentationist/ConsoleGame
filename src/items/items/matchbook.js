export default (game) => {
  return {
    name: "matchbook",
    openable: true,
    closed: true,
    count: 3,
    flammable: true,
    get description() {
      return `It is an old paper matchbook, of the type that used to be given away with packs of cigarettes, or printed with the name and telephone number of a business and used as marketing schwag. This particular specimen is beige, with black and white text that says \"Magnum Opus\" in a peculiar, squirming op-art font. ${
        this.closed
          ? "It is closed, its cardboard cover tucked in."
          : 'The cardboard cover is open, and you can see a handwritten message on the inside. It says, "THE OWLS ARE NOT WHAT THEY SEEM."'
      }`;
    },
    decrementCounter () {
      if (this.lightCount) {
        --this.count;
        if (this.count === 0) {
          game.log.p("Despite your best efforts the flame flickers out.");
          this.activated = false;
          return;
        }
      }
    },
    use () {
      game.state.objectMode = false;
      if (this.closed) {
        this.open.call(this);
        game.log.p(
          "As you flip open the matchbook, folding back the cover, you glimpse something scrawled in pencil on the inside."
        );
      }
      game.log.p(
        "You pluck out one of the paper matches. It ignites easily as you scrape its head against the red phosphorus strip, producing a tenuous flame that you are quick to guard with your cupped hand."
      );
      this.count = 3;
      this.activated = true;
    },
    light () {
      this.use.call(this);
    },
  };
};
