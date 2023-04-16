export default (game) => {
  return {
    name: "me",
    article: "",
    takeable: false,
    listed: false,
    get description() {
      const descriptionString = `Upon taking a quick inventory of your person and its component parts – everything seems to be accounted for and intact.`;
      return descriptionString;
    },
  };
};
