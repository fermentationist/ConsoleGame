export default (game) => {
  return {
    name: "chair",
    takeable: false,
    description: "It looks like a wooden chair– no more, no less.",
    use () {
      game.state.objectMode = false;
      game.log.p("You sit down on the chair.");
      const wait = game.commands._wait;
      wait.call(this);
    }
  }
}