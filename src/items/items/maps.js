export default (game) => {
  return {
    name: "maps",
    article: "some",
    points: 5,
    get description() {
      this.read();
      return `The stack of dogeared pages appear to be architectural drawings. With a quick survey of your surroundings, you confirm with reasonable certainty that they are likely floor plans for this house.`;
    },
    // read () {
    //   game.state.objectMode = false;
    //   if (!game.inInventory(this.name)) {
    //     return game.log.p(`You will need to pick up the ${this.name} first.`);
    //   }
    //   const currentPosition = game.state.position;
    //   const floorMap = game.maps[currentPosition.z].map((row) => {
    //     return row.map((cell) => (cell === "*" ? "⬛️" : "🌫"));
    //   });
    //   floorMap[currentPosition.y].splice(currentPosition.x, 1, "⭐️");
    //   const croppedMap = floorMap.slice(8).map((row) => row.slice(5, 11));
    //   game.log.map(croppedMap);
    //   game.displayHTMLMap(croppedMap);
    // },
    read () {
      game.state.objectMode = false;
      if (!game.inInventory(this.name)) {
        return game.log.p(`You will need to pick up the ${this.name} first.`);
      }
      const floorMap = game.getFloorMap();
      game.log.map(floorMap);
      game.displayHTMLMap(floorMap);
      game.registerTimer("map", (gameContext) => {
        gameContext.displayHTMLMap(gameContext.getFloorMap());
      });
    },
    use () {
      this.read.call(this);
    },
  };
};
