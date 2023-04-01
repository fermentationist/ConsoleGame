export default (game) => {
  return {
    name: "drawer",
    takeable: false,
    openable: true,
    closed: true,
    listed: false,
    proto: "drawer",
    containedIn: "_nightstand",
    contents: [],
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
      proto.close.call(this); // close method of prototype
    },
  };
};
