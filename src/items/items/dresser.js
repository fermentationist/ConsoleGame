export default (game) => {
  return {
    name: "dresser",
    takeable: false,
    openable: true,
    closed: true,
    listed: true,
    proto: "desk",
    containedPart: "_dresser_drawer",
    contents: [],
    get description () {
      return `The modest wooden dresser is of simple design. The pale blue milk paint that coats it is worn through in several spots from use. It has a large drawer, which is ${this.closed ? "closed" : "open"}.`
    },
    open () {
      const proto = Object.getPrototypeOf(this);
      const urOpen = Object.getPrototypeOf(proto).open.bind(this);
      urOpen.call(this);// open method from prototype's prototype
      proto.open.call(this);// open method of prototype
    },
    close () {
      const proto = Object.getPrototypeOf(this);
      const urClose = Object.getPrototypeOf(proto).close.bind(this);
      urClose.call(this);// close method from prototype's prototype
      proto.close.call(this);// open method of prototype
    },
  }
}