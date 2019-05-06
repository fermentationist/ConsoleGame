const mapKey = game => {
	const MapCell = {
		name: "Nowhere",
		locked: false,
		lockText: "",
		unlockText: "",
		hideSecrets: false,
		description: "You find yourself in a non-descript, unremarkable, non-place. Nothing of interest is likely to ever happen here.",
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
			const itemObj = game.items[`_${itemName}`];
			return this.visibleEnv.push(itemObj);

		}
	}
	const mapkey = {
		"0": {

		},
		"A": {
			name: "Freedom!",
			locked: true,
			lockText: "The formidable oak front door will not open. It looks as old as the rest of the building, and like the wood panelled walls of the entrance hall, it is dark with countless murky layers of varnish that coat its carved ornamentation. This makes the cause of the obstruction easy to determine: a shiny, new-looking stainless steel deadbolt that looks like it was installed just days ago."
		},
		"^": {
			name: "Second floor hallway",
			description: "You are at the top of a wide wooden staircase, on the second floor of the old house.",
			visibleEnv: []
		},

		"#": {
			name: "Staircase landing",
			description: "You are on the landing of a worn oak staircase connecting the first and second floors of the old abandoned house.",
			visibleEnv: ["key", "note", "catalogue"]
		},

		"%": {
			name: "Entrance hall",
			description: "You are in the main entrance hall of a seemingly abandoned house. There are three doors on either side of the hall, and facing you in the center is a wide oak staircase that connects the first and second floors of the old abandoned house.",
			visibleEnv: []
		},

		"@": {
			name: "Stone staircase",
			description: "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
		},

		"$": {
			name: "Broom closet",
			hideSecrets: true,
			hiddenEnv: ["glove"],
			visibleEnv: ["chain"],
			des1: "The small closet is dark, although you can see a small chain hanging in front of you.",
			get des2 (){
				const hidden = this.hiddenEnv;
				const text = "The inside of this small broom closet is devoid of brooms, or much of anything else, for that matter";
				const plural = hidden.length > 1 ? "y" : "ies";
				return text + (hidden.length ? `, with the exception of ${game.formatList(hidden.map(item => `${item.article} ${item.name}`))} which occup${plural} a dusty corner.`: ".");
			},
			get description (){
				return this.hideSecrets ? this.des1 : this.des2;
			}
		}
	}

	Object.keys(mapkey).map((cell) => {
		Object.setPrototypeOf(mapkey[cell], MapCell);
	});

	return mapkey;
};

export default mapKey;