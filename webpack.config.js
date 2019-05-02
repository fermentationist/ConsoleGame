const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "console_game.js",
        path: path.resolve(__dirname, "dist")
    }
}