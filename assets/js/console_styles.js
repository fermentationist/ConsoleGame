const customConsole = (() => {

	const customLog = function (message, {logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem"} = {}) {
		console[logType](`%c${message}`, `font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style}`);
	}

	const inlineStyle = (styleProperty, styleValue, before, styled, after, logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem") => {
		console.log(
			`%c${before}%c${styled}%c${after}`,
			`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};`,
			`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};${styleProperty}:${styleValue};`,
			`font-size:${size};color:${color};font-weight:${weight};font-family:${font};line-height:${lineHeight};font-style:${style};`);
}
	console.custom = (message, {logType = "log", size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", lineHeight = "1rem"} = {}) => {
		customLog(message, {logType, size, color, weight, style, font, lineHeight});
	}
	console.h1 = message => {
		customLog(message, {size: "125%", color: "pink", font: primaryFont});
	}

	console.gameTitle = message => {
		customLog(message, {size: "50%", color: "pink", weight: "bold", font: primaryFont, lineHeight: ".5rem"});
	}

	console.intro = message => {
		console.custom(message, {size: "125%", color: "thistle", font: "helvetica"});
	}

	console.note = message => {
		console.log(`%c${message}`, "font-size:110%;font-family:courier new;font-weight:bold;color:#75715E;background-color:white");
	}

	console.warning = message => {
		customLog(message, { logType: "warn", size: "115%", color: "orange"})//, "normal", "normal", "inherit");
	}

	console.papyracy = message => {
		customLog(message, {size: "140%", color: "yellow", font: "Papyrus"});
	}

	console.p = message => {
		customLog(message, {size: "120%", color: textColor, font: primaryFont});
	}

	console.tiny = message => {
		customLog(message, {size: "60%", color: "#75715E", font: primaryFont});
	}

	console.info = message => {
		customLog(message, { color: "#B9AFAF", font: primaryFont});
	}

	console.italic = message => {
		customLog(message, {size: "120%", color: textColor, weight: "italic", font: primaryFont});
	}

	console.invalid = message => {
		customLog(message, {size: "120%", color: "red", font: primaryFont});
	}

	console.inventory = message => {
		customLog(message, {size: "120%", color: "cyan", font: primaryFont});
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
		customLog(message, {size: "125%", color: textColor, weight: "bold", font: primaryFont});
	}

	console.header = (currentHeader) => {
		customLog(currentHeader, {size: "125%", color: textColor, weight: "bold", font: primaryFont});
	}

	console.groupTitle = (title) => {
		customLog(title, { logType: "group", size: "125%", color: "#75EA5B", font: primaryFont});
	}

	console.inline = (stringSegmentArray, styleArray) => {
		const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
		console.log(stringSegments, ...styleArray);
	}
	console.codeInline = (stringSegmentArray, baseStyle, codeStyle) => {
		baseStyle = `font-family:${primaryFont};font-weight:inherit;` + (baseStyle ? baseStyle : "");
		codeStyle = "font-family:courier;font-weight:bold;" + (codeStyle ? codeStyle : "");
		const styleArray = Array(stringSegmentArray.length).fill(baseStyle).map((baseStyle, index) => {
			return index % 2 !== 0 ? codeStyle : baseStyle;
		})
		console.inline(stringSegmentArray, styleArray);
	}
})();


