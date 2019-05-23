const thesaurus = {
    booklet: [
        "catalog",
        "catalogue",
        "book",
        "program"
    ],

    contemplate: [
        "consider",
        "meditate",
        "think",
        "cogitate",
        "cerebrate",
        "ponder",
        "excogitate",
        "muse",
        "reflect",
        "mull",
        "ruminate"
    ],
    drink: [
        "intake",
        "uptake",
        "imbibe",
        "consume",
        "ingest",
        "have",
        "chug",
        "guzzle"
    ],
    drop: [
        "unload",
        "discharge",
        "dismiss",
        "shed",
        "discard",
        "release",
        "shitcan",
        "trash",
        "expel"
    ],
    examine: [
        "analyze",
        "analyse",
        "study",
        "investigate",
        "inspect",
        "scan"
    ],
    glove: [
        "mitt",
        "gloves",
        "handwear",
        "mitten",
        "mittens"
    ],
    go: [
        "travel",
        "locomote",
        "proceed",
        "depart",
        "exit",
        "leave",
        "run"
    ],
    grue_repellant: [
        "repellant",
        "aerosol",
        "spray"
    ],
    inventory: [
        "booty",
        "bounty",
        "hoard",
        "possessions",
        "belongings"
    ],
    listen: [
        "hear"
    ],
    lock: [
        "deadbolt"
    ],
    look: [
        "see",
        "observe"
    ],
    move: [
        "displace",
        "upend",
        "push"
    ],
    note: [
        "letter",
        "missive",
        "paper",
        "epistle",
        "treatise"
	],
	open: [
		"unclose"
	],
    pull: [
        "tug",
        "yank",
        "jerk"
    ],
    read: [
        "skim",
        "peruse"
    ],
    smell: [
        "sniff"
    ],
    spray: [
        "squirt",
        "spurt",
        "spirt",
        "scatter",
        "sprinkle",
        "disperse",
        "dispense"
    ],
    take: [
        "acquire",
        "steal",
        "purloin",
        "pilfer",
        "obtain",
        "gank",
        "get",
        "appropriate",
        "arrogate",
        "confiscate",
        "retrieve",
        "remove"
    ],
    turn: [
        "flip",
        "rotate",
        "revolve", 
        "twist"
    ],
    use: [
        "utilize",
        "utilise",
        "apply",
        "employ",
        "exploit",
        "expend"
    ],
    wait: [
        "abide",
        "await",
        "delay",
        "tarry",
        "dawdle",
        "dillydally",
        "loiter",
        "pause",
        "rest",
        "relax",
        "remain",
        "hesitate",
        "procrastinate"
    ]
}
const allWords = Object.entries(thesaurus).reduce((accum, entry) => [accum, ...entry]);
const duplicates = allWords.filter((word, currentIndex) => allWords.indexOf(word) !== currentIndex)

if (duplicates.length) {
    throw Error(`Duplicates found in thesaurus.js:\n${duplicates}`);
}
export default thesaurus;