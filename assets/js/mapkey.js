const mapKey = (function (){
	const key = {
		"#": {
			description: "You are on a worn oak staircase connecting the first and second floors of the old abandoned house.",
			env: []
		},

		"@": {
			description: "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
			env: []
		},

		"$": {
			dark: false,
			des1: "The small closet is dark, although you can see a small chain hanging in front of you.",
			des2 : "The inside of this small broom closet is devoid of brooms, or anything else, for that matter, with the exception of a single, orphaned work glove which occupies a dusty corner.",
			get description(){
				return this.dark ? this.des1 : this.des2;
			},
			get env(){
				return this.dark ? ["chain"] : ["chain", "glove"];
			}
		}
	}
	return key;
})();