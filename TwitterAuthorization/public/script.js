/**
 * Created by temp_user on 11/30/2016.
 */
var isDesc = true;
$(document).ready(function() {
    getAuthors(10,1,"asc","id","");
    getBooks(10,1,"asc","id","");
    getLibraries(10,1,"asc","id","");
});
function getAuthors(limit,page,order,field,added) {
    $.get('/api/authors?limit='+limit+'&page='+page+'&order='+order+'&orderField='+field+added, function (data) {
        var header = generateHeader(["Имя","Страна","Псевдоним",],"authors");
        var body = '';
        var tail ='';
        for(var i=0;i<data.length;i++){
            body+='<tr>' +
                '<td class="hidden">' +
                data[i].id+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'name\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].name+
                '</span>'+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'country\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].country+
                '</span>'+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'pseudonym\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].pseudonym+
                '</span>'+
                '</td>'+
                '<td class="moderator">' +
                '<button onclick="editAuthor('+data[i].id+',$(this).closest(\'tr\').index())">Изменить</button><button onclick="deleteAuthor('+data[i].id+')">Удалить</button>'+
                '</td>'+
                '</tr>';
        }
        tail +='<tr class="moderator">' +
            '<td>' +
            '<input id="authorName" required type="text">'+
            '</td>'+
            '<td>' +
            '<input id="authorCountry" required type="text">'+
            '</td>'+
            '<td>' +
            '<input id="authorNickname" required type="text">'+
            '</td>'+
            '<td class="moderator">' +
            '<input type="submit" value="Добавить" onclick="addAuthor()"> '+
            '</td>'+
            '</tr>'+
            '<tr style="border: none">' +
            '<td>' +
            '<span onclick="prevPage(\'authors\',document.getElementById(\'authorLimit\').value,document.getElementById(\'authorCurPage\').value)" class="pointer">←</span>'+
            '<input id="authorCurPage" style="width: 15px;" value="'+page+'" type="text">'+
            '<span onclick="nextPage(\'authors\',document.getElementById(\'authorLimit\').value,document.getElementById(\'authorCurPage\').value)" class="pointer">→</span><br>'+
            '<input value="'+limit+'" id="authorLimit" style="width: 20px" type="text">'+
            '</td>'+
            '</tr>';
        $("#authors").html(header+body+tail);
        checkPermissions();
    });
}
function getBooks(limit,page,order,field,added) {
    $.get('/api/books?limit='+limit+'&page='+page+'&order='+order+'&orderField='+field+added, function (data) {
        var header = generateHeader(["Имя","Год выпуска","Жанр","Автор","Библиотека"],"books");
        var body = '';
        var tail='';
        for(var i=0;i<data.length;i++){
            body+='<tr>' +
                '<td class="hidden">' +
                data[i].id+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'title\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].title+
                '</span>'+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'releaseDate\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].releaseDate+
                '</span>'+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'genre\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].genre+
                '</span>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'author\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i]['author.name']+
                '</span>'+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'library\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i]['library.title']+
                '</span>'+
                '</td>'+
                '<td class="moderator">' +
                '<button onclick="editBook('+data[i].id+',$(this).closest(\'tr\').index())">Изменить</button><button onclick="deleteBook('+data[i].id+')">Удалить</button>'+
                '</td>'+
                '</tr>';
            console.log(data[i])
        }
        tail +='<tr class="moderator">' +
            '<td>' +
            '<input id="bookName" required type="text">'+
            '</td>'+
            '<td>' +
            '<input id="bookDate" required type="text">'+
            '</td>'+
            '<td>' +
            '<input id="bookGenre" required type="text">'+
            '</td>'+
            '<td>' +
            '<select  id="bookAuthor">';
        $.get('/api/authors?limit=10&page=1&order=asc&orderField=id', function (data) {
            for(var i=0;i<data.length;i++){
                tail+='<option value='+data[i].id+'>' +
                    data[i].name+
                    '</option>';
            }
            tail+='</select>'+
                '</td>'+
                '<td>' +
                '<select id="bookLibrary">';
            $.get('/api/library?limit=10&page=1&order=asc&orderField=id', function (data) {
                for(var i=0;i<data.length;i++){
                    tail+='<option value='+data[i].id+'>' +
                        data[i].title+
                        '</option>';
                }
                tail+='</select>'+
                    '</td>'+
                    '<td class="moderator">' +
                    '<input onclick="addBook()" type="submit" value="Добавить"> '+
                    '</td>'+
                    '</tr>'+
                    '<tr style="border: none">' +
                    '<td>' +
                    '<span onclick="prevPage(\'books\',document.getElementById(\'bookLimit\').value,document.getElementById(\'bookCurPage\').value)" class="pointer">←</span>'+
                    '<input id="bookCurPage" style="width: 15px;" value="'+page+'" type="text">'+
                    '<span onclick="nextPage(\'books\',document.getElementById(\'bookLimit\').value,document.getElementById(\'bookCurPage\').value)" class="pointer">→</span><br>'+
                    '<input value="'+limit+'" id="bookLimit" style="width: 20px" type="text">'+
                    '</td>'+
                    '</tr>';
                $("#books").html(header+body+tail);
                checkPermissions();
            });
        });
    })}
function getLibraries(limit,page,order,field,added) {
    $.get('/api/library?limit='+limit+'&page='+page+'&order='+order+'&orderField='+field+added, function (data) {
        var header = generateHeader(["Название","Вместимость"],"libraries");
        var body = '';
        var tail ='';
        for(var i=0;i<data.length;i++){
            body+='<tr>' +
                '<td class="hidden">' +
                data[i].id+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'title\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].title+
                '</span>'+
                '</td>'+
                '<td>' +
                '<span ondblclick="showInput(this,\'capacity\',$(this).closest(\'tr\').index(),this.innerText)">'+
                data[i].capacity+
                '</span>'+
                '</td>'+
                '<td class="moderator">' +
                '<button onclick="editLibrary('+data[i].id+',$(this).closest(\'tr\').index())">Изменить</button><button onclick="deleteLibrary('+data[i].id+')">Удалить</button>'+
                '</td>'+
                '</tr>';
        }
        tail +='<tr class="moderator">' +
            '<td>' +
            '<input id="libraryName" required type="text">'+
            '</td>'+
            '<td>' +
            '<input id="libraryCapacity" required type="text">'+
            '</td>'+
            '<td class="moderator">' +
            '<input  onclick="addLibrary()" type="submit" value="Добавить"> '+
            '</td>'+
            '</tr>'+
            '<tr style="border: none">' +
            '<td>' +
            '<span onclick="prevPage(\'libraries\',document.getElementById(\'libraryLimit\').value,document.getElementById(\'libraryCurPage\').value)" class="pointer">←</span>'+
            '<input id="libraryCurPage" style="width: 15px;" value="'+page+'" type="text">'+
            '<span onclick="nextPage(\'libraries\',document.getElementById(\'libraryLimit\').value,document.getElementById(\'libraryCurPage\').value)" class="pointer">→</span><br>'+
            '<input value="'+limit+'" id="libraryLimit" style="width: 20px" type="text">'+
            '</td>'+
            '</tr>';
        $("#libraries").html(header+body+tail);
        checkPermissions();
    });
}
function getUsers(limit,page,order,field,added) {
    $.get('/api/users?limit='+limit+'&page='+page+'&order='+order+'&orderField='+field+added, function (data) {

        $.get('/api/roles/', function (data2) {
            var header = generateHeader(["E-mail", "Имя", "Фамилия", "Пароль", "Роль"]);
            var body = '';
            for (var i = 0; i < data.length; i++) {
                body += '<tr>' +
                    '<td class="hidden">' +
                    data[i].id +
                    '</td>' +
                    '<td>' +
                    '<span ondblclick="showInput(this,\'email\',$(this).closest(\'tr\').index(),this.innerText)">' +
                    data[i].email +
                    '<\span>' +
                    '</td>' +
                    '<td>' +
                    '<span ondblclick="showInput(this,\'firstname\',$(this).closest(\'tr\').index(),this.innerText)">' +
                    data[i].firstname +
                    '</span>' +
                    '</td>' +
                    '<td>' +
                    '<span ondblclick="showInput(this,\'lastname\',$(this).closest(\'tr\').index(),this.innerText)">' +
                    data[i].lastname +
                    '</span>' +
                    '</td>' +
                    '<td>' +
                    '<span ondblclick="showInput(this,\'password\',$(this).closest(\'tr\').index(),this.innerText)">' +
                    data[i].password +
                    '</span>' +
                    '</td>' +
                    '<td>' +
                    '<select id="idRole' + (i + 1) + '">';
                var ij = i;
                for (var j = 0; j < data2.length; j++) {
                    body += '<option ';
                    data[ij]['roles.id'] == data2[j].id ? body+='selected': body+=' ';
                    body+=' value='+data2[j].id+'>'+data2[j].name+'</option>';
                }
                body += '</select>' +
                    '</td>' +
                    '<td class="admin">' +
                    '<button onclick="editUser(' + data[ij].id + ',$(this).closest(\'tr\').index())">Изменить</button>' +
                    '</td>' +
                    '</tr>';
                $("#users").html(header + body);

            }
        })
    });
}

function generateHeader(headers,table) {
    var field ="";
    var header ='<tr>'+
        '<th class="hidden">' +
        "id"+
        '</th>';
    for(var i=0;i<headers.length;i++){
        if( headers[i]=="Имя") field="name";
        if( headers[i]=="Страна") field="country";
        if( headers[i]=="Псевдоним") field="pseudonym";
        if( headers[i]=="Год выпуска") field="releaseDate";
        if( headers[i]=="Жанр") field="genre";
        if( headers[i]=="Автор") field="author";
        if( headers[i]=="Библиотека") field="library";
        if( headers[i]=="Вместимость") field="capacity";

        header += '<th>' +
            headers[i]+
            '<span onclick="sort(\''+table+'\',\'desc\',\''+field+'\')" class="pointer">⇵</span>'+
            '</th>';
        if(i+1==headers.length)
        {
            header +=   '<th class="moderator">' +
                "Управление"+
                '</th>'+
                '</tr>';
        }
    }
    return header;
}
function checkPermissions(){
    var role = getCookie("role");
    var elements;
    if(role == "user"){
        elements = document.querySelectorAll('.moderator');
        for(var i=0;i<elements.length;i++){
            document.querySelectorAll('.moderator')[i].style.display = "none";
        }
    }
    if(role == "moderator"){
        elements = document.querySelectorAll('.admin');
        for(var i=0;i<elements.length;i++){
            document.querySelectorAll('.admin')[i].style.display = "none";
        }
    }
    else {
        getUsers(10,1,"asc","id","");
    }
}
function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset);
            if (end == -1) {
                end = cookie.length;
            }
            setStr = cookie.substring(offset, end);
        }
    }
    return setStr;
}

function addAuthor() {
    var name = document.getElementById('authorName').value;
    var country = document.getElementById('authorCountry').value;
    var nickname = document.getElementById('authorNickname').value;
    var author = {
        name: name,
        country: country,
        pseudonym: nickname
    };
    $.ajax({
        type: 'POST',
        data: author,
        url: '/api/authors/create',
        success: function(data) {
            getAuthors(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function addLibrary() {
    var name = document.getElementById('libraryName').value;
    var capacity = document.getElementById('libraryCapacity').value;
    var library = {
        title: name,
        capacity: capacity,
    };
    $.ajax({
        type: 'POST',
        data: library,
        url: '/api/library/create',
        success: function(data) {
            getLibraries(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function addBook() {
    var name = document.getElementById('bookName').value;
    var date = document.getElementById('bookDate').value;
    var genre = document.getElementById('bookGenre').value;
    var author = document.getElementById('bookAuthor').value;
    var library = document.getElementById('bookLibrary').value;

    var book = {
        title: name,
        releaseDate: date,
        genre: genre,
        author: author,
        library: library
    };
    $.ajax({
        type: 'POST',
        data: book,
        url: '/api/books/create',
        success: function(data) {
            getBooks(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}

function editAuthor(id,rowIndex) {
    var name = document.getElementById('name'+rowIndex).value;
    var country = document.getElementById('country'+rowIndex).value;
    var pseudonym = document.getElementById('pseudonym'+rowIndex).value;
    var author = {
        id: id,
        name: name,
        country: country,
        pseudonym: pseudonym
    };
    $.ajax({
        type: 'POST',
        data: author,
        url: '/api/authors/update',
        success: function(data) {
            getAuthors(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function editLibrary(id,rowIndex) {
    var name = document.getElementById('name'+rowIndex).value;
    var country = document.getElementById('country'+rowIndex).value;
    var pseudonym = document.getElementById('pseudonym'+rowIndex).value;
    var author = {
        id: id,
        name: name,
        country: country,
        pseudonym: pseudonym
    };
    $.ajax({
        type: 'POST',
        data: author,
        url: '/api/library/update',
        success: function(data) {
            getLibraries(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function editBook(id,rowIndex) {
    var name = document.getElementById('name'+rowIndex).value;
    var country = document.getElementById('country'+rowIndex).value;
    var pseudonym = document.getElementById('pseudonym'+rowIndex).value;
    var author = {
        id: id,
        name: name,
        country: country,
        pseudonym: pseudonym
    };
    $.ajax({
        type: 'POST',
        data: author,
        url: '/api/books/update',
        success: function(data) {
            getBooks(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function editUser(id,rowIndex) {
    //var email = document.getElementById('email'+rowIndex).value;
    console.log(rowIndex);
    var firstname = document.getElementById('firstname'+rowIndex).value;
    var lastname = document.getElementById('lastname'+rowIndex).value;
    var password = document.getElementById('password'+rowIndex).value;
    var role = document.getElementById('idRole'+rowIndex).value;
    var user = {
        id: id,
        firstname: firstname,
        lastname: lastname,
        password: password,
    };
    var rol = {
        userId : id,
        roleId: role
    }
    $.ajax({
        type: 'POST',
        data: user,
        url: '/api/users/update',
        success: function(data) {
            getUsers(10,1,"asc","id","");
            $.ajax({
                type: "POST",
                data: rol,
                url: '/api/users/grant',
                success: function () {
                    getUsers(10,1,"asc","id","");
                }
            })
        },
        error: function(error) {
            console.log(error);
        }

    });

}

function deleteAuthor(id) {
    console.log(id);
    var obj = {
        id: id
    };
    $.ajax({
        type: 'POST',
        data: obj,
        url: '/api/authors/delete',
        success: function(data) {
            getAuthors(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function deleteLibrary(id) {
    console.log(id);
    var obj = {
        id: id
    };
    $.ajax({
        type: 'POST',
        data: obj,
        url: '/api/library/delete',
        success: function(data) {
            getLibraries(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
function deleteBook(id) {
    console.log(id);
    var obj = {
        id: id
    };
    $.ajax({
        type: 'POST',
        data: obj,
        url: '/api/books/delete',
        success: function(data) {
            getBooks(10,1,"asc","id","");
        },
        error: function(error) {
            console.log(error);
        }

    });

}
/*    function deleteUser(id) {
 console.log(id);
 var obj = {
 id: id
 };
 $.ajax({
 type: 'POST',
 data: obj,
 url: '/api/users/delete',
 success: function(data) {
 console.log(data);
 getUsers(10,1);
 },
 error: function(error) {
 console.log(error);
 }

 });

 }*/

function showInput(self,name, rowIndex,value) {
    var input = document.createElement("input");
    input.id = name+rowIndex;
    input.value = value;
    $(self).replaceWith(input);
}

function nextPage(table,limit,curPage) {
    if(table=="authors")
    {
        getAuthors(limit,+curPage+1,"asc","id","");
    }
    else if(table=="books"){
        getBooks(limit,+curPage+1,"asc","id","")
    }
    else if(table=="libraries"){
        getLibraries(limit,+curPage+1,"asc","id","")
    }
    else if(table=="users"){
        getUsers(limit,+curPage+1,"asc","id","")
    }
}
function prevPage(table,limit,curPage) {
    if(table=="authors")
    {
        getAuthors(limit,+curPage-1,"asc","id","");
    }
    else if(table=="books"){
        getBooks(limit,+curPage-1,"asc","id","")
    }
    else if(table=="libraries"){
        getLibraries(limit,+curPage-1,"asc","id","")
    }
    else if(table=="users"){
        getUsers(limit,+curPage-1,"asc","id","")
    }
}
function sort(table,order,field) {
    if(table=="authors") {
        if(isDesc) {
            getAuthors(10, 1, "asc", field, "");
            isDesc=false;
        }
        else{
            getAuthors(10, 1, "desc", field, "");
            isDesc=true;
        }
    }
    else if(table=="books"){
        if(isDesc) {
            getBooks(10, 1, "asc", field, "");
            isDesc=false;
        }
        else{
            getBooks(10, 1, "desc", field, "");
            isDesc=true;
        }
    }
    else if(table=="users"){
        if(isDesc) {
            getUsers(10, 1, "asc", field, "");
            isDesc=false;
        }
        else{
            getUsers(10, 1, "desc", field, "");
            isDesc=false;

        }
    }
    else if(table=="libraries"){
        if(isDesc) {
            getLibraries(10, 1, "asc", field, "")
            isDesc=false;
        }
        else{
            getLibraries(10, 1, "desc", field, "")
            isDesc=false;

        }
    }
}
