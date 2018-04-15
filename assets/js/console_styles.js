const customConsole = (() => {
	const primaryFont = "courier";

	const customLog = function (message, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") {
		return console[logType](`%c${message}`, `font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style}`);
	}

	const inlineStyle = (styleProperty, styleValue, before, styled, after, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") => {
	return console.log(
		`%c${before}%c${styled}%c${after}`,
		`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};`,
		`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};${styleProperty}:${styleValue};`,
		`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};`);
}

	console.h1 = (message) => {
		return customLog(message, "log", "150%", "pink", "bold", "normal", primaryFont);
	}

	console.gameTitle = (message) => {
		return customLog(message, "log", "50%", "pink", "bold", "normal", primaryFont, lineHeight=".5rem");
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

	console.italic = (before, italicized, after) => {
		return inlineStyle("font-style", "italic", before, italicized, after, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.bold = (before, italicized, after) => {
		return inlineStyle("font-weight", "bold", before, italicized, after, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.color = (colorValue, before, italicized, after) => {
		return inlineStyle("color", colorValue, before, italicized, after, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.title = (message) => {
		return customLog(message, "log", "125%", "#32cd32", "bold", "normal", primaryFont);
	}

	console.groupTitle = (title) => {
		return customLog(title, "group", "125%", "#75EA5B", "normal", "normal", primaryFont);
	}

	// console.strikethrough = function (message, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") {
	// 	return console[logType](`%c${message}`, `font-size:${size};color:"red";text-decoration:"underline";font-family:"inherit";`);
	// }

})();


