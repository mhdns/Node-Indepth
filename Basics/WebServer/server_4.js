/* eslint-disable no-bitwise */
/* eslint-disable no-console */
// Refactoring server_3 to get rid of the callback hell using promises
// Promises can resolved or rejected, until it is resolved or rejected, promise is pending
// Else it is settled

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimes = {
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png'
};

function fileAccess(filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK | fs.constants.F_ROK, (error) => {
      if (!error) {
        resolve(filepath);
      } else {
        reject(error);
      }
    });
  });
}

function fileReader(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (error, content) => {
      if (!error) {
        resolve(content);
      } else {
        reject(error);
      }
    });
  });
}

function webserver(req, res) {
  const baseURI = url.parse(req.url);
  const filepath = path.join(__dirname, (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname));
  const contentType = mimes[path.extname(filepath)];

  fileAccess(filepath)
    .then(fileReader)
    .then((content) => {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    })
    .catch((error) => {
      res.writeHead(404);
      res.end(JSON.stringify(error));
    });
}

http.createServer(webserver).listen(3000, () => console.log('Server running in port 3000...'));
