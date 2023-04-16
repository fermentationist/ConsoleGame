export default (game) => {
  return {
    name: "collar",
    points: 2,
    description: `It is ${game.state.dogName}'s collar! Whoever assaulted you and took your dog must have come this way!`,
    smell () {
      game.log.p("The collar smells like leather and scared doggie!");
    }
  }
}