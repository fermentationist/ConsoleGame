export default (game) => {
  return {
    name: "safe",
    points: 10,
    closed: true,
    openable: true,
    locked: true,
    listed: false,
    takeable: false,
    solution: "10281999",
    description:
      "The wall safe looks rugged and well-anchored. You doubt that it could be breached by brute force, and it appears to have already successfully weathered a few such attempts. On its face, a numeric keypad resides beneath what looks like a small digital readout.",
    contents: [],
    correctGuess () {
      game.state.objectMode = false;
      this.locked = false;
      this.closed = false;
      game.log.digi("PASSCODE ACCEPTED.");
      game.log.p(
        "Upon entering the correct passcode, the bolt inside the safe's door slides back, and the door pops open gently."
      );
      if (this.contents.length > 0) {
        game.log.p(
          `Inside the safe is ${game.formatList(
            this.contents.map((item) => `${item.article} ${item.name}`)
          )}.`
        );
      }
    },
    incorrectGuess () {
      game.state.objectMode = false;
      game.log.digi("PASSCODE INCORRECT");
    },
    open () {
      if (this.locked) {
        this.unlock.call(this);
      } else {
        Object.getPrototypeOf(this).open.call(this);
      }
    },
    lock () {
      game.state.objectMode = false;
      this.closed = true;
      this.locked = true;
      game.log.p("You lock the wall safe.");
    },
    unlock () {
      game.state.solveMode = true;
      game.state.objectMode = false;
      if (!this.locked) {
        game.log.p("The safe is already unlocked.");
      } else {
        game.log.codeInline([
          `To enter the 8-digit numerical passcode, you must type an underscore `,
          `_`,
          `, followed by the value enclosed in parentheses or backticks.`,
        ]);
        game.log.codeInline([`For example: `, `_(01234567)`, ` or `, "_`01234567`"]);
        game.log.digi("ENTER PASSCODE:");
      }
    },
    use () {
      this.unlock.call(this);
    },
  };
};
