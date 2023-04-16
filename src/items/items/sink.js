export default (game) => {
  return {
    name: "sink",
    listed: false,
    description:
      "It is an old porcelain sink with separate taps for hot and cold water. Like everything else here, it is covered in dust and grime.",
    use () {
      game.log.p("You try to turn on the taps, but nothing comes out.");
    },
  };
};
