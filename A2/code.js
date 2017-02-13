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

        function getListOfWords () {
            let alphaNumericWords = txt.replace(/[^0-9a-z]/gi, ' ').toLowerCase();
            let listOfWords = alphaNumericWords.trim().split(/\s+/);
            return {
                listOfWords
            }
        }

        function getAverageWordLength() {
            let words = getListOfWords().listOfWords;
            let sumOfWords = 0;
            for (let w in words) {
                let lenOfWord = words[w].length;
                sumOfWords += lenOfWord;
            }
            return {
                sumOfWords
            }
        }
        let averageWordLength = (getAverageWordLength().sumOfWords)/nWords;

        function getPalindromes() {
            let words = getListOfWords().listOfWords;
            let arrayOfPalindromes = [];
            for (let w in words) {
                if ((words[w] == words[w].split('').reverse().join('') && (words[w].length > 1))) {
                    arrayOfPalindromes.push(words[w]);
                }
            }
            return {
                arrayOfPalindromes
            }
        }
        let palindromes = getPalindromes().arrayOfPalindromes;

        function getLongestWords() {
            let words = getListOfWords().listOfWords;
            let arrayOfLongestWords = words.sort(function(a, b) {
                return a.length - b.length ||
                    a.localeCompare(b);
                }).reverse();
            let nonRepetitiveWords = arrayOfLongestWords.filter(function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            let tenLongestWords = nonRepetitiveWords.slice(0, 10);
            return {
                tenLongestWords
            }
        }

        let longestWords = getLongestWords().tenLongestWords;


        function getFrequentWords() {
            let words = getListOfWords().listOfWords;
            let wordCounts = {};
            for(let word in words) {
                wordCounts[words[word]] = (wordCounts[words[word]] || 0) + 1;
            }
            let sorted = [];
            for (let w in wordCounts) {
                sorted.push([w, wordCounts[w]])
            }
            sorted.sort(function (a, b) {
                return a[1] - b[1]
            }).reverse();
            let tempArr1 = [];
            let tempArr2 = [];
            let tempArr3 = [];
            let j = 0, k = 1;
            for(let i = 0; i < sorted.length; i++)
            {
                tempArr1 = tempArr1.concat(sorted[i]);
            }
            for(let i = 0; i < (tempArr1.length)/2; i++)
            {
                tempArr2[i] = tempArr1[j];
                j+=2;
            }
            for(let i = 0; i < (tempArr1.length)/2; i++)
            {
                tempArr3[i] = tempArr1[k];
                k+=2;
            }
            let sortedArray = [];
            for(let i = 0; i < tempArr2.length; i++)
            {
                sortedArray[i] = tempArr2[i] + "(" + tempArr3[i] + ")";
            }
            let topTenFreq = sortedArray.slice(0,10);

            return {
                topTenFreq
            }
        }

        let mostFrequentWords = getFrequentWords().topTenFreq;



        return {
        nChars,
        nWords,
        nLines,
        nNonEmptyLines,
        maxLineLength,
        averageWordLength,
        palindromes,
        longestWords,
        mostFrequentWords,

    };
}

