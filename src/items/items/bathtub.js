export default (game) => {  
  return {
    name: "bathtub",
    takeable: false,
    description: "The old cast iron tub rests atop four taloned feet. It does not look functional.",
    use () {
      game.log.p("This is hardly an appropriate time for a bath!");
    }
  }
}