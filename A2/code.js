//
// this is just a stub for a function you need to implement
//
function getStats(txt) {
        /*
        * Calculates number of characters
        * */
        let nChars = txt.length;
        /*
        * Calculates number of words lines and non-empty lines with a regular expression
        * */
        let nWords = txt.replace(/[^0-9a-z]/gi, ' ').trim().split(/\s+/).length;
        let nLines = txt.split(/\r\n|\r|\n/).length;
        let nNonEmptyLines = (txt.match(/^\s*\S/gm) || "").length;

        /*
        * Returns the length of the longest line
        * */
        function getMaxLineLength() {
            let lines = txt.split(/\n/);
            let longestLine = 0;
            for (let i=0; i<lines.length;i++) {
                let lenOfLine = lines[i].length;
                if (lenOfLine > longestLine) {
                    longestLine = lenOfLine;
                }
            }
            return {
                longestLine
            }
        }
        let maxLineLength = getMaxLineLength().longestLine;

        function getAverageWordLength() {
            let alphaNumericWords = txt.replace(/[^0-9a-z]/gi, ' ');
            let words = alphaNumericWords.trim().split(/\s+/);
            let sumOfWords = 0;
            for (let i=0; i<words.length;i++) {
                let lenOfWord = words[i].length;
                sumOfWords += lenOfWord;
            }
            return {
                sumOfWords
            }
        }
        let averageWordLength = (getAverageWordLength().sumOfWords)/nWords;


    return {
        nChars,
        nWords,
        nLines,
        nNonEmptyLines,
        maxLineLength,
        averageWordLength,
        palindromes: ["12321", "kayak", "mom"],
        longestWords: ["xxxxxxxxx", "123444444"],
        mostFrequentWords: ["hello(7)", "world(1)"]
    };
}

