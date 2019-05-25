import fonts from "./webFonts.js";

export default console.ransom = (message) => {
    const splitText = randomCase(message).split("");//.join(" ").split("");
    const blankStyle = `background-color: unset;font-size:${Math.random()}em`;
    const styles = splitText.map(char => {
        const {foreground, background, border} = getColors();
        const [r, g, b] = foreground;
        const [br, bg, bb] = background;
        const style = `font-family:${randomFont()};color:rgb(${r}, ${g}, ${b});font-size:${3 + (Math.random() / 2)}em;line-height:${Math.random() + 0.5}em;background-color:rgb(${br}, ${bg}, ${bb});${randomPadding()}${randomOutline(border)}`
        return char === " " ? blankStyle: style;
    });
    const spacedText = splitText.join(" ").split("");
    const spacedStyles = styles.map(item => [item, `font-size:${1 + (Math.random())}em;`])
        .flat()
        .splice(styles.length - 1);
	console.log("TCL: defaultconsole.ransom -> spacedStyles", spacedStyles)
    console.inline(spacedText, spacedStyles);
}

const getColors = () => {
    const isGray = Math.random() > 0.85;
    const foreground = isGray ? randomRGBGrayValues(0, 64) : randomRGBValues([64,64,64], 128);
    const background = isGray ? randomRGBGrayValues(192, 255) : randomRGBValues([255, 255, 255], 75);
    const border = isGray ? randomRGBGrayValues(0, 128) : randomRGBValues([128, 128, 128], 128);
    return {foreground, background, border};
}

const randomPadding = (max = 3) => `padding: ${Math.random() * max}px ${Math.random() * max}px ${Math.random() * max}px ${Math.random() * max}px;`

const randomRGBValues = ([r, g, b] = [128, 128, 128], maxVariance = 25) => {
    const randomlyVary = (baseValue, maxVary) => {
        const randomAbsoluteVariance = Math.floor(Math.random() * maxVariance);
        const randomActualVariance = Math.random() >= 0.5 ? randomAbsoluteVariance * -1 : randomAbsoluteVariance;
        return Math.max(Math.min(255, baseValue + randomActualVariance), 0);
    }
    return [randomlyVary(r, maxVariance), randomlyVary(g, maxVariance), randomlyVary(b, maxVariance)];
}

const randomRGBGrayValues = (min, max) => {
    const value = Math.floor(Math.random() * (max - min) + min);
    return [value, value, value];
}

const randomCase = message => {
    const randomizedArray = message.split("").map(char => {
        const rand = Math.random();
        return rand < 0.25 ? char : rand < 0.66 ? char.toUpperCase() : char.toLowerCase();
    });
    return randomizedArray.join("");
}

const randomOutline = (color) => {
    const width = Math.random() > 0.45 ? Math.random() * 1.75 : 0;
    const [r, g, b] = color || randomRGBValues([128, 128, 128], 128);
    const colorString = `rgb(${r}, ${g}, ${b})`;
    return `text-shadow: -${width}px -${width}px ${colorString}, ${width}px -${width}px ${colorString}, -${width}px ${width}px ${colorString}, ${width}px ${width}px ${colorString};`;
}

const randomFont = () => {
    const number = Math.floor(Math.random() * fonts.length);
    return fonts[number];
}