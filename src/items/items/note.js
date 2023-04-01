export default (game) => {
  return {
    name: "note",
    text: `We have your dog.`,
    flammable: true,
    firstRead: true,
    description:
      "The note is composed of eclectically sourced, cut-out letters, in the style of a movie ransom note. You found it lying next to you on the floor when you regained consciousness.",
    read () {
      game.state.objectMode = false;
      console.log("this:", this)
      if (!game.inInventory(this.name)) {
        return game.log.p(`You will need to pick up the ${this.name} first.`);
      }
      game.log.ransom(this.text);
      if (this.firstRead) {
        game.log.p(
          `Who would do such a thing to sweet little ${game.state.dogName}!?`
        );
        game.log.p(
          "You need to rescue your puppy and get out of this place before your attacker returns!"
        );
        this.firstRead = false;
      }
    },
  };
};
