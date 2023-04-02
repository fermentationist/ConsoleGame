export default (game) => {
  return {
    name: "glove",
    closed: true,
    points: 1,
    description: "It is a well-worn gray leather work glove. There is nothing otherwise remarkable about it.",
    contents: [],
    examine () {
      game.state.objectMode = false;
      if (this.contents.length) {
        const hiddenItem = this.contents.pop();
        game.log.p(`${this.description}\nAs you examine the glove, a ${hiddenItem.name} falls out, onto the floor.`);
        game.state.currentMapCell.addToEnv(hiddenItem.name);
        return;
      }
      return this.description;
    }
  }
}