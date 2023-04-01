export default (game) => {
  return {
    name: "no_tea",
    weight: 0,
    article: "",
    description: "You do not have any tea.",
    methodCallcount: 0,
    takeable: false,
    no_teaMethod (message) {
      this.methodCallcount++;
      game.state.objectMode = false;
      game.log.p(message);
      if (
        this.methodCallcount > 1 &&
        game.state.pendingAction !== "contemplate"
      ) {
        game.log.p("Perhaps you should take a moment to contemplate that.");
      }
    },
    drink () {
      return this.no_teaMethod("How do you intend to drink no tea?");
    },
    drop () {
      return this.no_teaMethod(
        "You can't very well drop tea that you don't have."
      );
    },
    take () {
      return this.no_teaMethod("No tea isn't the sort of thing you can take.");
    },
    examine () {
      return this.no_teaMethod(this.description);
    },
    frotz () {
      return this.no_teaMethod('Unfortunately, you cannot "frotz" the no tea.');
    },
    use () {
      return this.no_teaMethod(
        "Unsurprisingly, using the no tea has no effect."
      );
    },
    contemplate () {
      if (this.methodCallcount > 2) {
        game.state.score += 75;
        return game.winner(
          "Having thoroughly contemplated the existential ramifications of no tea, you suddenly find that your being transcends all time and space."
        );
      }
      return this.no_teaMethod("Let's not resort to that just yet!");
    },
  };
};
