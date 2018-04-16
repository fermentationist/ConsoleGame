const customConsole = (() => {
	const primaryFont = "monaco";

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
		return customLog(message, "info", "120%", "gray", "inherit" , "italic", primaryFont);
	}

	console.warning = (message) => {
		return customLog(message, "warn", "115%", "orange")//, "normal", "normal", "inherit");
	}

	console.papyracy = (message) => {
		return customLog(message, "log", "140%", "yellow", "normal", "normal", "Papyrus");
	}

	console.p = (message) => {
		return customLog(message, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.invalid = (message) => {
		return customLog(message, "log", "120%", "red", "normal", "normal", primaryFont);
	}

	console.inventory = (message) => {
		return customLog(message, "log", "120%", "cyan", "normal", "normal", primaryFont);
	}

	console.italic = (before, italicized, after) => {
		return inlineStyle("font-style", "italic", before, italicized, after, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.bold = (before, bold, after) => {
		return inlineStyle("font-weight", "bold", before, bold, after, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.color = (colorValue, before, colored, after) => {
		return inlineStyle("color", colorValue, before, colored, after, "log", "120%", "#32cd32", "normal", "normal", primaryFont);
	}

	console.title = (message) => {
		return customLog(message, "log", "125%", "#32cd32", "bold", "normal", primaryFont);
	}

	console.descriptionTitle = (name, turnNumber) => {
		const turn = `Turn : ${turnNumber}`;
		const gapSize = 60 - name.length - turn.length;
		const gap = " ".repeat(gapSize);
		const title = `${name}${gap}${turn}`;
		return customLog(title, "log", "125%", "#7BF65E", "bold", "normal", primaryFont);
	}

	console.groupTitle = (title) => {
		return customLog(title, "group", "125%", "#75EA5B", "normal", "normal", primaryFont);
	}

	console.inline = (stringSegmentArray, styleArray) => {
		const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
		return console.p(stringSegments, ...styleArray);
	}

})();


