import { primaryFont, textColor, fontSize } from "./prefs.js";
import fonts from "./webFonts.js";
import ransom from "./consoleRansom.js";

const customConsole = (() => {
	const customLog = function (message, style, logType = "log") {
		console[logType](`%c${message}`, style);
	}
	console.custom = (message, style) => {
		customLog(message, style);
	}
	console.h1 = message => {
		customLog(message, `font-size:125%;color:pink;font-family:${primaryFont};`);
	}
	console.intro = message => {
		customLog(message, `font-size:calc(1.25 * ${fontSize});color:orange;font-family:${primaryFont};padding:0 1em;line-height:1.5;`);
	}
	console.note = message => {
		customLog(message, `font-size:calc(1.2 * ${fontSize});font-family:courier new;font-weight:bold;color:#75715E;background-color:white;line-spacing:2em;padding:0 1em 1em;margin:0 auto  0 0;white-space:pre-wrap;`);
	}
	console.warning = message => {
		customLog(message, `font-size:calc(1.15 * ${fontSize});color:orange;`, logType = "warn");
	}
	console.papyracy = message => {
		customLog(message, `font-size:calc(1.4 * ${fontSize});color:beige;font-family:Papyrus;`);
	}
	console.p = message => {
		customLog(message, `font-size:calc(1.2 *${fontSize});color:${textColor};font-family:${primaryFont};padding:0 1em;line-height:1.5;`);
	}
	console.tiny = message => {
		customLog(message, `font-size:calc(0.5 * ${fontSize});color:#75715E;font-family:${primaryFont};`);
	}
	console.info = message => {
		customLog(message, `font-size:calc(1.15*${fontSize});padding:0.5em 1em 0 0.5em;font-family:${primaryFont};`);
	}
	console.invalid = message => {
		customLog(message, `font-size:calc(1.2 * ${fontSize});color:red;font-family:${primaryFont};padding:0 1em;`);
	}
	console.inventory = message => {
		customLog(message, `font-size:calc(1.2 * ${fontSize});color:cyan;font-family:${primaryFont};padding:0 1em;`);
	}
	console.title = message => {
		customLog(message, `font-size:calc(2.5 * ${fontSize});font-weight:bold;color:gold;text-shadow:orange 2px 2px 5px;goldenrod -2px -2px 5px;font-family:Courier;padding:0 1em;margin:0 auto 0 35%;border: 2px dashed goldenrod;`);
	}
	console.win = message => {
		customLog(message, `font-size:calc(2.5 * ${fontSize});font-weight:bold;color:gold;text-shadow:orange 2px 2px 5px;goldenrod -2px -2px 5px;font-family:Courier;padding:0 1em;animation:flashing 0.8s infinite;`);
	}
	console.header = (currentHeader) => {
		customLog(currentHeader, `font-size:calc(1.25 * ${fontSize});font-weight:bold;color:${textColor};font-family:${primaryFont};padding:0 1em;`);
	}
	console.groupTitle = (title) => {
		customLog(title, `font-size:calc(1.25 * ${fontSize});color:#75EA5B;font-family:${primaryFont}`, "group");
	}
	console.inline = (stringSegmentArray, styleArray) => {
		const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
		console.log(stringSegments, ...styleArray);
	}
	console.codeInline = (stringSegmentArray, baseStyle, codeStyle) => {
		baseStyle = `font-size:calc(1.15*${fontSize});font-family:${primaryFont};font-weight:inherit;line-height:1.5;padding-top:0.5em;` + (baseStyle ? baseStyle : "");
		codeStyle = `font-family:courier;font-weight:bold;line-height:1.5;padding-top:0.5em;font-size:calc(1.35*${fontSize});color:lime;` + (codeStyle ? codeStyle : "");
		const styleArray = Array(stringSegmentArray.length).fill(baseStyle).map((baseStyle, index) => {
			return index % 2 !== 0 ? codeStyle : baseStyle;
		})
		console.inline(stringSegmentArray, styleArray);
	}
	console.digi = message => {
		const spacedText = message.split("").join(" ").split("");
		const styles = spacedText.map(char => {
			return `font-family:'courier new';color:rgb(${255 + Math.floor(Math.random() * 10)}, ${68 + Math.floor(Math.random() * 10)}, ${0 + Math.floor(Math.random() * 10)});font-size:${2 + (Math.random() / 2)}em;`
		});
		console.inline(spacedText, styles);
	}
	console.map = floorMap => console.table(floorMap.map(row => row.join("")))
})();

export default customConsole;
