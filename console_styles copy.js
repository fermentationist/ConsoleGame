const customConsole = (() => {

	const customLog = function (message, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") {
		console[logType](`%c${message}`, `font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style}`);
	}

	const inlineStyle = (styleProperty, styleValue, before, styled, after, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") => {
		console.log(
			`%c${before}%c${styled}%c${after}`,
			`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};`,
			`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};${styleProperty}:${styleValue};`,
			`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};`);
}
	console.custom = (message, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") => {
		customLog(message, logType, size, color, weight, style, font, lineHeight);
	}
	console.h1 = message => {
		customLog(message, "log", "125%", "pink", "normal", "normal", primaryFont);
	}

	console.gameTitle = message => {
		customLog(message, "log", "50%", "pink", "bold", "normal", primaryFont, lineHeight=".5rem");
	}

	console.intro = message => {
		console.custom(message, "log", "125%", "thistle", "normal", "normal", "helvetica");
	}

	console.note = message => {
		console.log(`%c${message}`, "font-size:110%;font-family:courier new;font-weight:bold;color:#75715E;background-color:white");
	}

	console.warning = message => {
		customLog(message, "warn", "115%", "orange")//, "normal", "normal", "inherit");
	}

	console.papyracy = message => {
		customLog(message, "log", "140%", "yellow", "normal", "normal", "Papyrus");
	}

	console.p = message => {
		customLog(message, "log", "120%", textColor, "normal", "normal", primaryFont);
	}

	console.tiny = message => {
		customLog(message, "log", "60%", "#75715E", "normal", "normal", primaryFont);
	}

	console.info = message => {
		customLog(message, "log", "100%", "#B9AFAF", "normal", "normal", primaryFont);
	}

	console.italic = message => {
		customLog(message, "log", "120%", textColor, "italic", "normal", primaryFont);
	}

	console.invalid = message => {
		customLog(message, "log", "120%", "red", "normal", "normal", primaryFont);
	}

	console.inventory = message => {
		customLog(message, "log", "120%", "cyan", "normal", "normal", primaryFont);
	}

	console.italicInline = (before, italicized, after) => {
		inlineStyle("font-style", "italic", before, italicized, after, "log", "120%", textColor, "normal", "normal", primaryFont);
	}

	console.boldInline = (before, bold, after) => {
		inlineStyle("font-weight", "bold", before, bold, after, "log", "120%", textColor, "normal", "normal", primaryFont);
	}

	console.colorInline = (colorValue, before, colored, after) => {
		inlineStyle("color", colorValue, before, colored, after, "log", "120%", textColor, "normal", "normal", primaryFont);
	}

	console.title = message => {
		customLog(message, "log", "125%", textColor, "bold", "normal", primaryFont);
	}

	console.header = (currentHeader) => {
		customLog(currentHeader, "log", "125%", textColor, "bold", "normal", primaryFont);
	}

	console.groupTitle = (title) => {
		customLog(title, "group", "125%", "#75EA5B", "normal", "normal", primaryFont);
	}

	console.inline = (stringSegmentArray, styleArray) => {
		const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
		console.log(stringSegments, ...styleArray);
	}

})();


