export default (game) => {
  const drawer = {
    name: "drawer",
    listed: false,
    openable: true,
    closed: true,
    takeable: false,
    containedIn: "_desk",
    contents: [],
    get description() {
      return this.closed
        ? "The drawer is closed."
        : `The drawer is open. There is ${
            this.contents.length < 1
              ? "nothing"
              : game.formatList(
                  this.contents.map((item) => `${item.article} ${item.name}`)
                )
          } inside.`;
    },
    open () {
      if (this.closed) {
        Object.getPrototypeOf(this).open.call(this);
      }
      if (game.items[this.containedIn].closed) {
        game.items[this.containedIn].closed = false;
      }
    },
    close () {
      if (!this.closed) {
        Object.getPrototypeOf(this).close.call(this);
      }
      if (!game.items[this.containedIn].closed) {
        game.items[this.containedIn].closed = true;
      }
    },
  };
  return drawer;
};
