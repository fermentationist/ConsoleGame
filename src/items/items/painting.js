export default (game) => {
  return {
    name: "painting",
    takeable: true,
    listed: false,
    flammable: true,
    description:
      "The small, grimy image is of an owl, teaching a class a classroom of kittens how to catch mice. The rendering of perspective is amateurish, and the depicted animals look hostile and disfigured. It is an awful painting.",
    previouslyRevealed: false,
    location: "+",
    take () {
      Object.getPrototypeOf(this).take.call(this);
      this.revealText("When you remove the terrible painting, ");
    },
    revealText (text) {
      if (!this.previouslyRevealed) {
        game.log.p(
          text +
            "a small recess is revealed. Within the shallow niche is a small black wall safe, covered with countless shallow dents, scratches and abrasions."
        );
        game.mapKey[this.location].hideSecrets = false;
        this.previouslyRevealed = true;
      }
    },
    move () {
      this.revealText("When you move the terrible painting, ");
    },
    turn () {
      this.move();
    },
    burn () {
      game.state.objectMode = false;
      if (!game.inInventory("matchbook")) {
        // check for matchbook, exit if not in inventory
        game.log.p("You don't have the means to light a fire.");
        return;
      }
      // update the description of the painting to reflect the fact that it has been burned.
      this.description =
        "The painting is lying broken upon the floor. It is so badly burned now, that its subject has become indecipherable. What remains of the canvas is a carbonized black. You can't help but think that it is still an improvement compared to the original work.";
      game.items._matchbook.closed = false; // matchbook remains open after use, if not already opened.
      if (game.state.currentMapCell.hideSecrets) {
        // if painting still on wall
        this.revealText(
          "Although the match nearly goes out before you can ignite the painting, a small flame finally finds a foothold on the canvas, and it is soon alarmingly ablaze. Thinking it unwise to burn down the house you are trapped in, you remove the painting from the wall, and stomp out the fire before it can spread any further. \nWhen you look back at the wall that formerly held the burning painting, "
        );
        return;
      }
      // if painting already removed from wall
      this.revealText(
        "Although the match nearly goes out before you can ignite the painting, a small flame finally finds a foothold on the canvas, and it is soon alarmingly ablaze. You are suddenly inspired to end your ill-considered, if brief flirtation with pyromania, and promptly stomp out the fire before they can spread any further."
      );
      return;
    },
  };
};
