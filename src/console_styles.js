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
		customLog(message, `font-size:calc(2.5 * ${fontSize});font-weight:bold;color:gold;text-shadow:orange 2px 2px 5px;goldenrod -2px -2px 5px;font-family:Courier;padding:0 1em;margin:0 auto 0 35%;`);
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
        // console.log("TCL: customConsole -> spacedText", spacedText)
		// customLog(message, `font-family:'courier new';color:orangered;font-size:2em;letter-spacing:1.5px;font-kerning:none;`)
	}
	// console.ransom = (message) => {
	// 	const splitText = randomCase(message).split("");//.join(" ").split("");
	// 	const blankStyle = "background-color: unset;"
	// 	const styles = splitText.map(char => {
	// 		const [r, g, b] = randomRGBValues([255,68,0], 128);
	// 		const [br, bg, bb] = randomRGBValues([255, 255, 255], 75);
	// 		const style = `font-family:${randomFont()};color:rgb(${r}, ${g}, ${b});font-size:${2.5 + (Math.random() / 2)}em;filter:saturate(0);line-height:${Math.random() + 0.5}em;background-color:rgb(${br}, ${bg}, ${bb});${randomPadding()}${randomOutline()}`
	// 		return char === " " ? blankStyle: style;
	// 	});
	// 	const spacedText = splitText.join(" ").split("");
	// 	const spacedStyles = styles.map(item => [item, `font-size:${1 + (Math.random())}em;`]).flat();
	// 	console.inline(spacedText, spacedStyles);
	// }
	
})();

// export const randomPadding = (max = 3) => `padding: ${Math.random() * max}px ${Math.random() * max}px ${Math.random() * max}px ${Math.random() * max}px;`

// export const randomRGBValues = ([r, g, b] = [128, 128, 128], maxVariance = 25) => {
// 	const randomlyVary = (baseValue, maxVary) => {
// 		const randomAbsoluteVariance = Math.floor(Math.random() * maxVariance);
// 		const randomActualVariance = Math.random() >= 0.5 ? randomAbsoluteVariance * -1 : randomAbsoluteVariance;
// 		return Math.max(Math.min(255, baseValue + randomActualVariance), 0);
// 	}
// 	return [randomlyVary(r, maxVariance), randomlyVary(g, maxVariance), randomlyVary(b, maxVariance)]
// }
// export const randomCase = message => {
// 	const randomizedArray = message.split("").map(char => {
// 		const rand = Math.random();
// 		return rand < 0.25 ? char : rand < 0.66 ? char.toUpperCase() : char.toLowerCase();
// 	});
// 	return randomizedArray.join("");
// }
// export const randomOutline = () => {
// 	const width = Math.random() > 0.45 ? Math.random() * 1.75 : 0;
// 	const [r, g, b] = randomRGBValues([128, 128, 128], 128);
// 	const color = `rgb(${r}, ${g}, ${b})`;
// 	return `text-shadow: -${width}px -${width}px ${color}, ${width}px -${width}px ${color}, -${width}px ${width}px ${color}, ${width}px ${width}px ${color};`;
// }
// export const randomFont = () => {
// 	const number = Math.floor(Math.random() * fonts.length);
// 	return fonts[number];
// }
export default customConsole;
