const customConsole = (() => {
	const customLog = function (message, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit") {
		console[logType](`%c${message}`, `font-size:${size};color:${color};font-weight:${weight};font-family:${font}`);
	}

	console.h1 = (message) => {
		return customLog(message, "info", "200%", "pink", "bold", "normal", "arial");
	}

	console.note = (message) => {
		return customLog(message, "info", "75%", "gray", "inherit" , "italic", "Lucida Console");
	}

	console.warning = (message) => {
		return customLog(message.toUpperCase(), "error", "115%", "yellow", "normal", "normal", "arial");
	}

	console.papyracy = (message) => {
		return customLog(message, "log", "140%", "yellow", "normal", "normal", "Papyrus");
	}
})();
// console.papyracy("Holy Shit it's Avatar!\n\n");
