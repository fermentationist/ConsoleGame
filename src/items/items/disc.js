export default (game) => {
  return {
    name: "disc",
    text: "Untitled (Litany)",
    get description() {
      return `It is a disc made of a shiny black polymer, lined with hundreds of tiny concentric grooves. It looks to be about seven inches in diameter, with a one and one-half inch hole in its center. It bears a label that says, "${this.text}".`;
    },
    play () {
      if (!game.inEnvironment("phonograph") && !game.inInventory("phonograph")) {
        game.log.p("First, you will need to find a phonograph.")
        return;
      }
      return game.displayItem({
        title: "\nUntitled (litany)",
        artist: "Dennis Hodges",
        year: "2010",
        info: "Found audio recordings",
        source: "https://drive.google.com/file/d/1s02tHvAU0E7dMJgbhUnIPNg8ayWGNmxZ/preview?usp=sharing"
      });
    },
    use () {
      this.play.call(this)
    },
  }
}