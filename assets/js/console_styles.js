const customConsole = (() => {
	const primaryFont = "courier";

	const customLog = function (message, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") {
		return console[logType](`%c${message}`, `font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};`);
	}

	console.h1 = (message) => {
		return customLog(message, "log", "200%", "pink", "bold", "normal", primaryFont);
	}

	console.note = (message) => {
		return customLog(message, "log", "100%", "gray", "inherit" , "italic", primaryFont);
	}

	console.warning = (message) => {
		return customLog(message.toUpperCase(), "warn", "115%", "orange", "normal", "normal", "inherit");
	}

	console.papyracy = (message) => {
		return customLog(message, "log", "140%", "yellow", "normal", "normal", "Papyrus");
	}

	console.p = (message) => {
		return customLog(message, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.groupTitle = (title) => {
		return customLog(title, "group", "125%", "#75EA5B", "normal", "normal", primaryFont);
	}

})();


