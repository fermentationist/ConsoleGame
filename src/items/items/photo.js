export default (game) => {
  return {
    name: "photo",
    description:
      "The four by six inch photograph is in a cheap frame made of painted fiberboard. It's a portrait of a very old, and probably infirm black poodle, bluish cataracts clouding its eyes. There is some writing on the back of the frame.",
    get reverseDescription() {
      return `There is a handwritten inscription on the back of the frame${
        game.inInventory(this.name)
          ? '. It says, "My Precious Muffin\'s 18th Birthday - 10/28/17"'
          : ""
      }.`;
    },
    points: 3,
    text: "My Precious Muffin's 18th Birthday - 10/28/17",
    read () {
      game.state.objectMode = false;
      if (!game.inInventory(this.name)) {
        return game.log.p(`You will need to pick up the ${this.name} first.`);
      }
      game.log.p(`The text on the ${this.name} reads: \n`);
      return game.log.cursive(this.text);
    },
  };
};
