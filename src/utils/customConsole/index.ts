import logStyles from "./styles";
import getRansomArray from "./console_ransom";

const inline = (stringSegmentArray: string[], styleArray: string[]) => {
	const stringSegments = stringSegmentArray.map((segment) => `%c${segment}`).join("");
	console.log(stringSegments, ...styleArray);
}

const customLog = function (message: (string | string[]), style: (string | string[]), logType = "log") {
	if ((window as any).CONSOLE_GAME_DEBUG) {
		(window as any).debugLog.push({gameOutput: message});
	}
	if (Array.isArray(message) && Array.isArray(style)) {
		inline(message, style);
	} else {
		(console as any)[logType](`%c${message}`, style);
	}
}

const codeInline = (stringOrStringSegmentArray: (string | string[])) => {
	const baseStyle = logStyles.codeInlineBaseStyle;
	const codeStyle = logStyles.codeInlineCodeStyle;
	if (typeof stringOrStringSegmentArray === "string") {	
		customLog(stringOrStringSegmentArray, codeStyle);
	} else {
		const styleArray = Array(stringOrStringSegmentArray.length).fill(baseStyle).map((baseStyle, index) => {
			// alternate between baseStyle and codeStyle
			return index % 2 !== 0 ? codeStyle : baseStyle;
		})
		customLog(stringOrStringSegmentArray, styleArray);
	}
}

const digi = (message: string) => {
	const spacedText = message.toUpperCase().split("").join(" ").split("");
	const styles = spacedText.map(char => logStyles.getDigiStyle());
	customLog(spacedText, styles);
}

const map = (floorMap: string[][]) => console.table(floorMap.map(row => row.join("")));

const scream = (message: string) => {
	const splitText = [...message];
	const styles = splitText.map((char, index) => {
		return logStyles.getScreamStyle(index);
	});
	customLog(splitText, styles);
}

const ransom = (message: string) => {
	const [text, styles] = getRansomArray(message);
	inline(text, styles);
}

const customConsole = (() => {
	(window as any).debugLog = [];
  
	const log: Record<string, any> = {
		inline,
		codeInline,
		digi,
		map,
		scream,
		custom: customLog,
		ransom,
		table: console.table,
		groupCollapsed: console.groupCollapsed,
		groupEnd: console.groupEnd,
	}

	// remaining log methods are created dynamically from the logStyles object
	for (const styleName in logStyles) {
		const styleDetails = logStyles[styleName as keyof typeof logStyles];
		// only iterate over the style objects, not the methods
		if (typeof styleDetails === "object") {
			const {style, logType} = styleDetails;
			log[styleName] = (message: string) => customLog(message, style, logType);
		}
	}

  return log;
})();

export default customConsole;
