export default (game) => {
  return {
    name: "knife",
    description:
      "The folding knife has a three inch locking blade and is small enough to fit in your pocket. It is designed to be a utility blade, and would probably make a poor weapon.",
    use () {
      game.log.p("The small knife is of no use here.");
    },
  };
};
