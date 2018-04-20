const thesaurus = require("thesaurus-com");
const fs = require("fs");
let word = "take";
// var updated_thesaurus = thesaurus.load("./th_en_US_new.dat");
// thesaurus.search("take").synonyms.then((syns) => {
// 	fs.writeFile("./thesaurus.js", syns, (err) => {
// 		console.log('take', take);
// 		console.log(err ? err : "write to file complete");
// 	});
// });


// async function consultThesaurus (word, outputFile){
// 	result = await Promise.resolve(() => {
// 		thesaurus.search(word).synonyms;
// 	});
// 	let parsed = result//JSON.parse(`[${result}]`);
// 	console.log('parsed', parsed)
// 	fs.writeFile("./thesaurus.json", parsed, (err) => console.log(err ? err : `data written to file ${outputFile}`))
// }

// consultThesaurus("take", "./thesaurus.json");

(async () => {
	const consultThesaurus = (word) => {
		return thesaurus.search(word).synonyms
	}
	let parsed = await consultThesaurus(word);
	console.log('parsed', parsed);

})();