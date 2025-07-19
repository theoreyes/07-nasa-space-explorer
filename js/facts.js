const facts = [
    "More than 1,300 Earths would fit into Jupiter's vast sphere",
    "Mercury is the fastest planet in our solar system, zipping around the sun at an average of 107,000 miles per hour",
    "Saturn is the only planet in our solar system that is less dense than water. It could float in a bathtub if anybody could build a bathtub big enough",
    "Jupiter's moon \"lo\" is the most volcanically active body in our solar system",
    "Ceres is the largest, most massive body in the main asteroid belt between Mars and Jupiter, totaling about a third of the total mass of the entire belt",
    "In order to listen for tiny signals from space, NASA's Deep Space Network uses dish antennas with diameters of up to 230 feet",
    "The average temperature on Venus is roughly 900 degrees Fahrenheit",
    "Neptune's winds are the fastest in the solar system, reaching 1,600 miles per hour! Neptune's giant, spinning storms could swallow the whole Earth",
]

// My implementation of the Fisher-Yates Sorting algorithm
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        let swapItem = list[randIndex];
        list[randIndex] = list[i];
        list[i] = swapItem;
    }
}

function getFact() {
    let str = "Did you know: " + facts[curIndex];
    if (curIndex === facts.length - 1)
        curIndex = 0;
    else
        curIndex += 1;
    return str;
}

shuffle(facts);
let curIndex = 0;
let factsLen = facts.length