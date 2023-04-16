export default (game) => {
  return {
    name: "all",
    listed: false,
    takeable: false,
    take () {
      game.state.objectMode = false;
      const all = game.state.combinedEnv;
      all.forEach((item) => {
        return item.takeable ? (item.take && item.take()) : null;
      });
    },
    drop () {
      game.state.objectMode = false;
      const all = game.state.inventory.filter((it) => !["no_tea", "me"].includes(it.name));// filter out "no_tea" (you can't drop it)
      all.forEach((item) => {
        item.drop && item.drop();
      });
    }
  };
}