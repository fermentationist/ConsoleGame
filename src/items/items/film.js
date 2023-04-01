export default (game) => {
  return {
    name: "film",
    listed: true,
    flammable: true,
    article: "a reel of",
    text: "Canned Laughs",
    description:
      'The Super 8 film cartridge is made primarily of a clear, smoky plastic body containing a single spool of developed film. It looks a lot like an audio cassette tape, though it is a little thicker, and it is square instead of being merely rectangular. The title, "Canned Laughs", is hand written on a curling paper label.',
    play () {
      if (!game.inEnvironment("projector") && !game.inInventory("projector")) {
        game.log.p(
          "First, you will need to find something to project the film with."
        );
        return;
      }
      if (!game.inEnvironment("screen") && !game.inInventory("screen")) {
        game.log.p("You are going to need a screen to project onto.");
        return;
      }
      return game.displayItem({
        title: "\nCanned Laughs",
        artist: "Dennis Hodges",
        year: "2001",
        info: "Super 8mm film to video transfer with dubbed audio",
        source:
          "https://drive.google.com/file/d/1loiWbLQgHVVoCtJVscJe2sYiPle8u7Tf/preview?usp=sharing",
        width: "720px",
        height: "480px",
      });
    },
    use () {
      this.play.call(this);
    },
    project () {
      this.play.call(this);
    },
  };
};
