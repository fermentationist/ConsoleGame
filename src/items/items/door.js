export default (game) => {
  return {
    name: "door",
    article: "a",
    points: 20,
    openable: true,
    locked: false,
    closed: true,
    takeable: false,
    listed: false,
    unlockedBy: "key",
    lockedTarget: "A",
    closedTarget: "A",
    get description() {
      game.state.objectMode = false;
      return `The massive wooden door, darkened with generations of dirt and varnish, is secured with a sturdy new deadbolt, which is ${!this.locked ? "unlocked." : "locked."}${this.closed ? "" : "\nThe door is open."}`
    },
  }
}