var db = require('./db')
var qs = require('querystring');
var template = require('./template.js')
var sanitizeHtml = require(`sanitize-html`)

exports.home = function(request, response){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    var title = 'Welcome';
    var discription = 'Hello, Node.js';
    var control = `
    <a href="/create">create</a>
    <form action="/search_process" method="get">
      ${template.searchSelect(`topics`)}
      <input type="text" name="search" placeholder="search">
      <input type="submit" value="search">
    </form>
    `;
    var list = template.list(topics);
    var html = template.html(list, title, `<h2>${title}</h2><p>${discription}</p>`, control);
    response.writeHead(200);
    response.end(html);
  });
}

exports.viewDetails = function(request, response, queryData){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){
      if(error2){
        throw error2;
      }
      var title = topic[0].title;
      var discription = topic[0].description;
      var control = `<a href="/create">create</a>`;
      var list = template.list(topics);
      var control = `
      <a href="/create">create</a>
      <a href="/update?id=${queryData.id}">update</a>
      <form action="/delete_process" method="post">
        <input type="hidden", name="id", value="${queryData.id}">
        <input type="submit", value="delete">
      </form>
      `;
      var html = template.html(list, title, `<h2>${sanitizeHtml(title)}</h2><p>${sanitizeHtml(discription)}</p>by ${sanitizeHtml(topic[0].name)}`, control);
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create = function(request, response){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    db.query('SELECT * FROM author', function(error, authors){
      var title = 'WEB - create';
      var list = template.list(topics);
      var html = template.html(list, sanitizeHtml(title), `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="discription" placeholder="discription"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, `<a href="/create">create</a>`);
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
    db.query('INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)',
      [post.title, post.discription, post.author],
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end();
      }
    )
  });
}

exports.update = function(request, response, queryData){
  db.query(`SELECT * FROM topic ORDER BY created`, function(error, topics){
    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error, topic){
      db.query(`SELECT * FROM author`, function(error, authors){
        var title = sanitizeHtml(topic[0].title);
        var control = `<a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a>`;
        var list = template.list(topics);
        var html = template.html(list, title,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="discription" placeholder="discription">${sanitizeHtml(topic[0].description)}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        control)
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

exports.updateProcess = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data
  });
  request.on('end', function(){
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var author = post.author;
    var discription = post.discription;
    db.query(`UPDATE topic SET description=?, title=?, author_id=? WHERE id=?`,
      [discription, title, author, id],
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${id}`});
        response.end();
      })
  });
}

exports.deleteProcess = function(request, response){
  var body = '';
  request.on('data', function(data){
    body = body + data
  });
  request.on('end', function(){
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result){
      response.writeHead(302, {Location: `/`});
      response.end();
    })
  });
}

exports.searchProcess = function(request, response, queryData){
  db.query(`SELECT * FROM author INNER JOIN topic ON topic.author_id=author.id WHERE ${queryData.searchSubject}=? ORDER BY created`, [queryData.search], function(error, result){
    if(error){
      throw error;
    }
    var title = 'Search result';
    var discription = `This is result of ${sanitizeHtml(queryData.search)}`;
    var control = `
    <a href="/create">create</a>
    `;
    var list = template.list(result);
    var html = template.html(list, title, `<h2>${title}</h2><p>${discription}</p>`, control);
    response.writeHead(200);
    response.end(html);
  })
}

exports.errorHtml = function(request, response){
  response.writeHead(404);
  response.end('Not found');
}
