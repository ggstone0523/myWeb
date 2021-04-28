var db = require('./db')
var qs = require('querystring');
var template = require('./template.js')
var sanitizeHtml = require(`sanitize-html`)

exports.home = function(request, response){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error, authors){
      var title = 'author';
      var list = template.list(topics);
      var create = `
      <form action="/author/create_process" method="post">
        <p><input type="text" name="authorName" placeholder="authorName"></p>
        <p>
          <textarea name="authorDescription" placeholder="authorDescription"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `
      var control = `
      <form action="/author/search_process" method="get">
        ${template.searchSelect(`authors`)}
        <input type="text" name="search" placeholder="search">
        <input type="submit" value="search">
      </form>
      `;
      var html = template.html(list, title, `<h2>${title}</h2><p>${template.authorList(authors)}</p>
      <p>${control}</p><p>${create}</p>`, ``);
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.createProcess = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query('INSERT INTO author (name, profile) VALUES(?, ?)',
      [post.authorName, post.authorDescription],
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
      }
    )
  });
}

exports.update = function(request, response, queryData){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error, authors){
      db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error, author){
        var title = 'author';
        var list = template.list(topics);
        var create = `
        <form action="/author/update_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}">
          <p><input type="text" name="authorName" placeholder="authorName" value="${sanitizeHtml(author[0].name)}"></p>
          <p>
            <textarea name="authorDescription" placeholder="authorDescription">${sanitizeHtml(author[0].profile)}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `
        var html = template.html(list, title, `<h2>${title}</h2><p>${template.authorList(authors)}</p><p>${create}</p>`, ``);
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

exports.updateProcess = function(request, response, queryData){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.authorName, post.authorDescription, post.id],
    function(error, result){
      if(error){
        throw error
      }
      response.writeHead(302, {Location: `/author`});
      response.end();
    })
  });
}

exports.searchProcess = function(request, response, queryData){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    db.query(`SELECT * FROM author WHERE ${queryData.searchSubject}=?`, [queryData.search], function(error, result){
      if(error){
        throw error;
      }
      var title = 'Search result';
      var discription = `This is result of ${sanitizeHtml(queryData.search)}`;
      var list = template.list(topics);
      var list2 = template.authorList(result);
      var html = template.html(list, title, `<h2>${title}</h2><p>${discription}</p>`, list2);
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.delete = function(request, response, queryData){
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function(error1, result){
      if(error1){
        throw error1
      }
      db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error2, result){
        if(error2){
          throw error2
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
      })
    })
  })
}
