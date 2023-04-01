export default (game) => {
  return {
    name: "desk",
    takeable: false,
    openable: true,
    closed: true,
    // contents: [],
    containedPart: "_drawer",
    description: "The antique writing desk is six feet in length, and blanketed with dust. It has a single drawer on one side.",
    open () {
      if(this.closed){
        Object.getPrototypeOf(this).open.call(this);
      }
      if (game.items[this.containedPart].closed){
        game.items[this.containedPart].closed = false;
      }
    },
    close () {
      if (!this.closed){
        Object.getPrototypeOf(this).close.call(this);
      }
      if (!game.items[this.containedPart].closed) {
        game.items[this.containedPart].closed = true;
      }
    }
  }
}