var sanitizeHtml = require(`sanitize-html`);

module.exports = {
  html:function(list, title, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`
      i = i + 1;
    }
    return list + '</ul>';
  },
  authorSelect:function(authors, author_id){
    var tag = '';
    var i=0;
    while(i<authors.length){
      var selected = '';
      if(authors[i].id == author_id){
        selected = ' selected'
      }
      tag = tag + `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`;
      i = i + 1;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `
  },
  authorList:function(authors){
    var tag = '<table>';
    var i = 0;
    while(i<authors.length){
      tag += `
      <tr>
        <td>${sanitizeHtml(authors[i].name)}</td>
        <td>${sanitizeHtml(authors[i].profile)}</td>
        <td><a href="/author/update?id=${authors[i].id}">update</a></td>
        <td>
          <form action="/author/delete" method="post">
            <input type="hidden" name="id" value="${authors[i].id}">
            <input type="submit" value="delete">
          </form>
        </td>
      </tr>
      `
      i++;
    }
    tag += `</table>`;
    tag += `
    <style>
      table{
        border-collapse: collapse;
      }
      td{
        border: 1px solid black;
      }
    </style>
    `;
    return tag;
  },
  searchSelect:function(table){
    if(table === 'topics'){
      var subject = ['title', 'author_id', 'name'];
    }
    else if(table === 'authors'){
      var subject = ['name', 'profile'];
    }
    var i = 0;
    var tag = '';
    while(i<subject.length){
      tag += `<option value="${subject[i]}">${subject[i]}</option>`;
      i = i + 1;
    }
    return `
    <select name = "searchSubject">
      ${tag}
    </select>
    `
  }
}
