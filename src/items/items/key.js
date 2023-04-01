export default (game) => {
  return {
    name: "key",
    description:
      "The shiny key is made of untarnished brass and looks new, like it could have been cut yesterday.",
    use () {
      const unlockable = game.state.combinedEnv.filter(
        (item) => item.unlockedBy === this.name
      );
      if (unlockable.length < 1) {
        game.log.p(`There is nothing to unlock with the ${this.name}`);
        return;
      }
      unlockable.forEach((item) => item.unlock());
    },
  };
};
