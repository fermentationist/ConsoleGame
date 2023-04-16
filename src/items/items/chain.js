export default (game) => {
  return {
			name: "chain",
			weight: 0,
			description: "The thin ball chain dangling in front of you is exactly the sort often connected to a lightbulb. Perhaps you should \"pull\" it...",
			takeable: false,
			listed: false,
			pull () {
				game.state.objectMode = false;
				let dark = game.state.currentMapCell.hideSecrets;
				dark ? game.log.p("An overhead lightbulb flickers on, faintly illuminating the room.") : game.log.p("The lightbulb is extinguished.");
				game.state.currentMapCell.hideSecrets = !dark;
				return game.describeSurroundings();
			},
			use () {
				return this.pull();
			}
		}
}