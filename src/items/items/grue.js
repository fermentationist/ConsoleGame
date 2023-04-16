export default (game) => {
  return {
    name: "grue",
    listed: false,
    takeable: false,
    turns: 3,
    description:
      "No adventurer who has seen a grue has yet lived to tell of it.",
    lurk () {
      if (!game.state.currentMapCell.hideSecrets) {
        return;
      }
      const valarMorgulis = Math.random() >= 0.25;
      if (valarMorgulis && this.turns < 1) {
        game.dead(
          "Oh no! You have walked into the slavering fangs of a lurking grue!"
        );
      }
      this.turns--;
      return;
    },
  };
};
