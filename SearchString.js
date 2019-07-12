//Load a book from disk
function loadBook(filename,displayName){
    let currentBook = "";
    let url = "books/"+filename;

    //reset the UI, and the searchstat footer.
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    //create a http server request to load the books.
    var xhr = new XMLHttpRequest();
    // true to run async
    xhr.open("GET", url, true);
    xhr.send();
    
    //wait for book to load. And set it in the scroll box, reset to top.
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            currentBook = xhr.responseText;

            //retrieve book statistics before sorting 
            getDocStats(currentBook);

            //remove line breaks and returns with a <br> to format text properly.
            // regular expression.
            currentBook = currentBook.replace(/(?:\r\n|\r\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    };
}

// retrieve the statistics for the selected book.
function getDocStats(fileContent){
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    //look for characters between spaces, return into an array.
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    var uncommonWords = [];
    // filter out the uncommon words
    uncommonWords = filterStopwords(wordArray);

    //count every word in the wordArray, add 1 to count if found, else add to the dictionary.
    for(let word in uncommonWords){
        let wordValue = uncommonWords[word];
        if(wordDictionary[wordValue] > 0){
            wordDictionary[wordValue] += 1;
        }
        else{
            wordDictionary[wordValue] = 1;
        }
    }

    //sort array
    let wordList = sortProperties(wordDictionary);

    // Return the top 5 used words/ least 5 used words
    var top5Words = wordList.slice(0,6);
    var least5Words = wordList.slice(-6,wordList.length);

    // display them on the page.
    ULTemplate(top5Words,document.getElementById("mostUsed"));
    ULTemplate(least5Words,document.getElementById("leastUsed"));

    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;

}

function ULTemplate(items,element){
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for(i=0;i<items.length-1;i++){
        resultsHTML += templateHTML.replace('{{val}}',items[i][0]+ " : "+ items[i][1] + " time(s)");
        //resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }
    element.innerHTML = resultsHTML;
}

function sortProperties(obj){
    // convert the object to an array.
    let rtnArray = Object.entries(obj);

    //sort the array.
    rtnArray.sort(function (first, second){
        return second[1] - first[1];
    });
    return rtnArray;
}

// filter out the overly common stopwords.
function filterStopwords(wordArray){
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];
    
    for (i = 0; i < commonWords.length; i++) {
          commonObj[commonWords[i].trim()] = true;
    }

    for (i = 0; i < wordArray.length; i++){
        word = wordArray[i].trim().toLowerCase();
        if(!commonObj[word]){
            uncommonArr.push(word);
        }
    }
    return uncommonArr;

}

// A generic list of words that are very common and will not be included in the frequest word section.
function getStopWords(){
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

// highlight the word the user is searching.
function performMark(){
    
    //read the user keyword.
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent = "";

    //Find all currently marked items.
    // <mark></mark> . returns the contents between tags as an array.
    let spans = document.querySelectorAll('mark');

    // loop will make <mark>Frodo</mark> to Frodo. 
    for(var i = 0; i < spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }

    var re = new RegExp(keyword, "gi");
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;
    
    //add mark to book content.
    newContent = bookContent.replace(re,replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "Matches Found: "+ count;

    if(count>0){
        var element = document.getElementById("markme");
        element.scrollIntoView();
    }
}