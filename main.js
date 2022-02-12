var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, description, control){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${description}
    </body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ul>';
    var i = 0;

    // 파일이 새로 생성되도 알아서 생성해줌.
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    
    return list;
}
var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathName = url.parse(_url, true).pathname;

    console.log(url.parse(_url, true));

    // if(_url == '/'){
    //     //_url = '/index.html';
    //     title = 'Welcome';
    // }
    // // 404 Error
    // if(_url == '/favicon.ico'){
    //     return response.writeHead(404);
    // }
    // response.writeHead(200);
    // console.log(__dirname + _url);

    //
    if(pathName === '/'){
        //undefined
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, filelist){
                console.log(filelist);
                
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                // var list = `<ul>
                // <li><a href="/?id=HTML">HTML</a></li>
                // <li><a href="/?id=CSS">CSS</a></li>
                // <li><a href="/?id=JavaScript">JavaScript</a></li>
                // </ul>
                // `
                var list = templateList(filelist);

                var template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">createPage</a>`);
                response.writeHead(200);
                response.end(template);
            });
           
        }else{
            // id값이 있는경우 코드
            fs.readdir('./data', function(error, filelist){
                // var list = `<ul>
                // <li><a href="/?id=HTML">HTML</a></li>
                // <li><a href="/?id=CSS">CSS</a></li>
                // <li><a href="/?id=JavaScript">JavaScript</a></li>
                // </ul>
                // `
                
                // templateList 함수로 대체
                // var list = '<ul>';
                // var i = 0;

                // // 파일이 새로 생성되도 알아서 생성해줌.
                // while(i < filelist.length){
                //     list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                //     i = i + 1;
                // }
                // list = list + '</ul>';

                fs.readFile(`data/${queryData.id}`, function(error, description){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list,
                         `<h2>${title}</h2>${description}`,
                         `
                            <a href="/create">createPage</a>
                            <a href="/update?id=${title}">update</a>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                            </form>
                         `
                    );
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }else if(pathName === '/create'){
        // create Page
        fs.readdir('./data', function(error, filelist){
            console.log(filelist);
            
            var title = 'WEB - create';
            var list = templateList(filelist);

            var template = templateHTML(title, list, `
                <form action = "http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `);
            response.writeHead(200);
            response.end(template);
        });       
    }else if(pathName === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            // console.log(post);
            // console.log(post.title);

            //file Write
            fs.writeFile(`data/${title}`,description, 'utf-8', function(err){
                // 302 - redirection
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });

    }else if(pathName === '/update'){
        fs.readdir('./data', function(error, filelist){
            fs.readFile(`data/${queryData.id}`, function(error, description){
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list,
                     `
                    <form action = "/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                     <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                     <p>
                         <textarea name="description" placeholder="description">${description}</textarea>
                     </p>
                     <p>
                         <input type="submit">
                     </p>
                    </form>
                     `,
                     `<a href="/create">createPage</a><a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(template);
            });
        });
    }
    else if(pathName === '/update_process'){
        var body = '';
        request.on('data', function(data){  // 데이터를 받아와서 body에 계속 저장
            body = body + data;
        });
        request.on('end', function(){       //데이터의 끝일 때
            var post = qs.parse(body);
            var id= post.id;        // 기존 제목
            var title = post.title; //새 제목
            var description = post.description; // 내용

            // 파일 수정
            fs.rename(`data/${id}`, `data/${title}`, function(error){
                fs.writeFile(`data/${title}`,description, 'utf-8', function(err){
                    // 302 - redirection
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            })
        });
    }else if(pathName === '/delete_process'){
        var body = '';
        request.on('data', function(data){  // 데이터를 받아와서 body에 계속 저장
            body = body + data;
        });
        request.on('end', function(){       //데이터의 끝일 때
            var post = qs.parse(body);
            var id= post.id;        // 기존 제목
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    }         
    else{
        response.writeHead(404);
        response.end('Not Found');
    }  
    
});
app.listen(3000);