export default (game) => {
  return {
    name: "booklet",
    article: "a",
    flammable: true,
    description: "This booklet appears to be the exhibition catalogue for some fancy art show. ",
    read () {
      game.state.objectMode = false;
      if (!game.inInventory(this.name)) {
        return game.log.p(`You will need to pick up the ${this.name} first.`);
      }
      game.displayItem({
        title: "Ministry of Culture",
        artist: "Isak Berbic, Emiliano Cerna-Rios, Dennis Hodges and Zdenko Mandusic",
        year: "2008",
        info: "Exhibition catalog",
        source: "https://drive.google.com/file/d/1pJcIPQZxY1JhRZ3ssV-EPL6eWY-XLdpI/preview",
        width: "800px",
        height: "800px"
      });
    }
  }
}