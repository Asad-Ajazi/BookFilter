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

            //remove line breaks and returns with a <br> to format text properly.
            // regular expression.
            currentBook = currentBook.replace(/(?:\r\n|\r\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    }
}