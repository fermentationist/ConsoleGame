export default (game) => {
  return {
    name: "books",
    listed: false,
    takeable: false,
    description: "While you notice many of the titles as familiar works of classic literature, nothing stands out as being of particular interest.",
    read () {
      game.log.p("You cannot possibly read all of these books, and considering you have been abducted by persons unknown and are trapped in a strange house, you have neither the presence of mind, nor the time to sit down with a good book right now.");
    },
    proto: "bookshelves",
  }
}