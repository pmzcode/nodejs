/**
 * Created by MSI on 26.12.2016.
 */

function validateLibrary(data) {
        if(data.title == "" || data.capacity =="")
            return true;
        return false;
    }

function validateBook(data) {
    if(data.title=="" || data.releaseDate=="" || data.genre=="" || data.author=="" || data.library=="")
        return true;
    return false;
}

function validateAuthor(data) {
    if(data.title=="" || data.releaseDate=="" || data.genre=="" || data.author=="" || data.library=="")
        return true;
    return false;
}












exports.validateLibrary=validateLibrary;
exports.validateBook=validateBook;

