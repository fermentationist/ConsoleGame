export default (game) => {
  return {
    name: "nightstand",
    takeable: false,
    openable: true,
    closed: true,
    listed: false,
    proto: "desk",
    containedPart: "_nightstand_drawer",
    contents: [],
    get description() {
      return `The nightstand next to the bed is made of wood and is painted white. It has a single drawer, which is ${
        this.closed ? "closed" : "open"
      }.`;
    },
    open () {
      const proto = Object.getPrototypeOf(this);
      const urOpen = Object.getPrototypeOf(proto).open.bind(this);
      urOpen.call(this); // open method from prototype's prototype
      proto.open.call(this); // open method of prototype
    },
    close () {
      const proto = Object.getPrototypeOf(this);
      const urClose = Object.getPrototypeOf(proto).close.bind(this);
      urClose.call(this); // close method from prototype's prototype
      proto.close.call(this); // open method of prototype
    },
  };
};
