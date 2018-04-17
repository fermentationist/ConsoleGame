// Global preference values.
var defaultFont = "monaco";
var defaultTextColor = "#32cd32";
var pStyle = `font-size:120%;color:#32cd32;font-family:${primaryFont}`;

var prefs = Object.keys(localStorage).some((key) => {
	return key.indexOf("ConsoleGame.prefs") !== -1;
});

console.log(!prefs ? "no user preferences detected." : "user preferences applied.");

var primaryFont = localStorage.getItem("ConsoleGame.prefs.font") || defaultFont;
var textColor = localStorage.getItem("ConsoleGame.prefs.color") || defaultTextColor;