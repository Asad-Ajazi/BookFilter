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
    var docLength = document.getElementById("doclength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    //look for characters between spaces, return into an array.
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    //count every word in the wordArray, add 1 to count if found, else add to the dictionary.
    for(let word in wordArray){
        let wordValue = wordArray[word];
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
}

function ULTemplate(items,element){
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for(i=0;i<items.length-1;i++){
        //resultsHTML += templateHTML.replace('{{val}}',items[i][0]+ " : "+ items[i][1] + "time(s)");
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
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
