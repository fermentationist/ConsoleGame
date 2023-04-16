export default (game) => {
  return {
    name: "scroll",
    flammable: true,
    points: 10,
    description:
      'There is some small text, printed on a thin leather strap that was used to bind the rolled up scroll. It says, "rezrov: Open even locked or enchanted objects". As you unfurl the scroll, there appears to be some writing on the inside surface of the parchment, but each line of text seems to disappear as soon as it is revealed.',
    text: "rezrov: Open even locked or enchanted objects",
    use () {
      game.log.p("You unfurl the scroll and read aloud the text on the inside surface. As you finish, the text fades away, and the scroll disappears! You have memorized \"rezrov\", an incantation capable of opening locked or closed things.");
      this.listed = false;
    },
    cast () {
      this.use.call(this);
    },
  };
};
