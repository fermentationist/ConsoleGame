const mapKey = (function (){
	const MapCell = {
		hideSecrets: false,
		description: "You find yourself in a non-descript, liminal, non-place– a locational limbo. That, or it is so boring that you have already forgotten what it looks like. Either way, nothing of interest is likely to ever happen here.",
		hiddenEnv: [],
		visibleEnv: [],
		get env (){
			if (this.hideSecrets){
				return this.visibleEnv;
			}
			this.visibleEnv = this.visibleEnv.concat(this.hiddenEnv);
			this.hiddenEnv = [];
			return this.visibleEnv;
			
		},
		set env (newEnv){
			return this.visibleEnv = newEnv;
		},
		removeFromEnv: function (item) {
			const index = this.visibleEnv.map((item) => item.name).indexOf(item.name);
			return index !== -1 ? this.env.splice(index, 1): console.log("Cannot remove as item is not present in environment.");
		},
		addToEnv: function (itemName) {
			const itemObj = Items[`_${itemName}`];
			return this.visibleEnv.push(itemObj);

		}
	}

	const mapkey = {
		"#": {
			description: "You are on a worn oak staircase connecting the first and second floors of the old abandoned house.",
			visibleEnv: ["key", "note"]
		},

		"@": {
			description: "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
		},

		"$": {
			hideSecrets: true,
			des1: "The small closet is dark, although you can see a small chain hanging in front of you.",
			des2 : "The inside of this small broom closet is devoid of brooms, or anything else, for that matter, with the exception of a single, orphaned work glove which occupies a dusty corner.",
			get description(){
				return this.hideSecrets ? this.des1 : this.des2;
			},
			hiddenEnv: ["glove"],
			visibleEnv: ["chain"]
		}
	}

	Object.keys(mapkey).map((cell) => {
		Object.setPrototypeOf(mapkey[cell], MapCell);
	});

	return mapkey;
})();

