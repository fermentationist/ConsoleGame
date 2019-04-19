const customConsole = (() => {
	const customLog = function (message, style, logType = "log") {
		console[logType](`%c${message}`, style);
	}
	console.custom = (message, style) => {
		customLog(message, style);
	}
	console.h1 = message => {
		customLog(message, `font-size:125%;color:pink;font-family:${primaryFont}`);
	}
	console.intro = message => {
		customLog(message, `font-size:125%;color:thistle;font-family:helvetica;`);
	}
	console.note = message => {
		customLog(message, "font-size:110%;font-family:courier new;font-weight:bold;color:#75715E;background-color:white");
	}
	console.warning = message => {
		customLog(message, "size:115%;color:orange;", logType = "warn");
	}
	console.papyracy = message => {
		customLog(message, "font-size:140%;color:beige;font-family:Papyrus;");
	}
	console.p = message => {
		customLog(message, `font-size:120%;color:${textColor};font-family:${primaryFont};`);
	}
	console.tiny = message => {
		customLog(message, `font-size:60%;color:#75715E;font-family:${primaryFont}`);
	}
	console.info = message => {
		customLog(message, `color:#B9AFAF;font-family:${primaryFont}`);
	}
	console.invalid = message => {
		customLog(message, `font-size:120%;color:red;font-family:${primaryFont}`);
	}
	console.inventory = message => {
		customLog(message, `font-size:120%;color:cyan;font-family:${primaryFont}`);
	}
	console.title = message => {
		customLog(message, `font-size:125%;font-weight:bold;color:${textColor};font-family:${primaryFont};`);
	}
	console.header = (currentHeader) => {
		customLog(currentHeader, `font-size:125%;font-weight:bold;color:${textColor};font-family:${primaryFont};`);
	}
	console.groupTitle = (title) => {
		customLog(title, `font-size:125%;color:#75EA5B;font-family:${primaryFont}`, "group");
	}
	console.inline = (stringSegmentArray, styleArray) => {
		const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
		console.log(stringSegments, ...styleArray);
	}
	console.codeInline = (stringSegmentArray, baseStyle, codeStyle) => {
		baseStyle = `font-family:${primaryFont};font-weight:inherit;line-height:1.5;` + (baseStyle ? baseStyle : "");
		codeStyle = "font-family:courier;font-weight:bold;line-height:1.5;font-size:125%;" + (codeStyle ? codeStyle : "");
		const styleArray = Array(stringSegmentArray.length).fill(baseStyle).map((baseStyle, index) => {
			return index % 2 !== 0 ? codeStyle : baseStyle;
		})
		console.inline(stringSegmentArray, styleArray);
	}
})();

export default customConsole;
