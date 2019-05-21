// Global preference values.
export var defaultFont = "monaco";
export var defaultTextColor = "#32cd32";
export var defaultFontSize = "100%";

export var prefs = Object.keys(localStorage).some((key) => {
	return key.indexOf("ConsoleGame.prefs") !== -1;
});

console.log(!prefs ? "no user preferences detected." : "user preferences applied.");

export var primaryFont = localStorage.getItem("ConsoleGame.prefs.font") || defaultFont;
export var textColor = localStorage.getItem("ConsoleGame.prefs.color") || defaultTextColor;
export var fontSize = localStorage.getItem("ConsoleGame.prefs.size") || defaultFontSize;

export var pStyle = `font-size:calc(1.2 *${fontSize});color:${textColor};font-family:${primaryFont};padding:0 1em;line-height:1.5;`;

export default (!prefs ? "no user preferences detected." : "user preferences applied.");												