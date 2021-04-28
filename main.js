var http = require('http');
var url = require('url');
var topic = require('./lib/topic')
var author = require('./lib/author')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      }
      else{
        topic.viewDetails(request, response, queryData);
      }
    }
    else if(pathname === '/create'){
      topic.create(request, response);
    }
    else if(pathname === '/create_process'){
      topic.createProcess(request, response);
    }
    else if(pathname === `/update`){
      topic.update(request, response, queryData);
    }
    else if(pathname === '/update_process'){
      topic.updateProcess(request, response);
    }
    else if(pathname === '/delete_process'){
      topic.deleteProcess(request, response);
    }
    else if(pathname === '/author'){
      author.home(request, response);
    }
    else if(pathname === `/author/create_process`){
      author.createProcess(request, response);
    }
    else if(pathname === `/author/update`){
      author.update(request, response, queryData);
    }
    else if(pathname === '/author/update_process'){
      author.updateProcess(request, response, queryData);
    }
    else if(pathname === `/author/delete`){
      author.delete(request, response, queryData);
    }
    else if(pathname === `/search_process`){
      topic.searchProcess(request, response, queryData);
    }
    else if(pathname === '/author/search_process'){
      author.searchProcess(request, response, queryData);
    }
    else{
      topic.errorHtml(request, response);
    }
});
app.listen(3000);
