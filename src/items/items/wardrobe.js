export default (game) => {
  return {
    name: "wardrobe",
    takeable: false,
    openable: true,
    closed: true,
    listed: false,
    contents: [],
    get description() {
      const descriptionString = `The oak wardrobe is roughly four feet wide and seven feet in height and is currently${
        this.closed ? " closed" : " open"
      }. `;
      if (this.closed) {
        return descriptionString;
      }
      const contentsString = `There is ${
        this.contents.length < 1
          ? "nothing"
          : game.formatList(
              this.contents.map((item) => `${item.article} ${item.name}`)
            )
      } inside.`;
      return descriptionString + contentsString;
    },
  };
};
