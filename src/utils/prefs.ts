// Global preference values.
export let defaultFont = "monaco";
export let defaultTextColor = "#32cd32";
export let defaultFontSize = "100%";

export let prefsAreSet = Object.keys(localStorage).some((key) => {
	return key.indexOf("ConsoleGame.prefs") !== -1;
});

console.log(!prefsAreSet ? "no user preferences detected." : "user preferences applied.");

export let primaryFont = localStorage.getItem("ConsoleGame.prefs.font") || defaultFont;
export let textColor = localStorage.getItem("ConsoleGame.prefs.color") || defaultTextColor;
export let fontSize = localStorage.getItem("ConsoleGame.prefs.size") || defaultFontSize;

export let pStyle = `font-size:calc(1.2 *${fontSize});color:${textColor};font-family:${primaryFont};line-height:1.5;`;												