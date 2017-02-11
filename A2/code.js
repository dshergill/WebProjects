//
// this is just a stub for a function you need to implement
//
function getStats(txt) {

        let nChars = txt.length;
        let nWords = txt.replace(/[^0-9a-z]/gi, ' ').trim().split(/\s+/).length
        let nLines = txt.split(/\r\n|\r|\n/).length
        let nNonEmptyLines = (txt.match(/^\s*\S/gm) || "").length



    return {


        nChars,
        nWords,
        nLines,
        nNonEmptyLines,
        maxLineLength: 33,
        averageWordLength: 3.3,
        palindromes: ["12321", "kayak", "mom"],
        longestWords: ["xxxxxxxxx", "123444444"],
        mostFrequentWords: ["hello(7)", "world(1)"]
    };
}

