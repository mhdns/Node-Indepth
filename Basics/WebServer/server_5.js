/* eslint-disable no-bitwise */
/* eslint-disable no-console */
// Refactoring server_4.js to use streams that will reduce the load on the memory
// http.sever uses streams with request and response
// you can read and write files using streams and also do compressing/decompressing
// files on disk

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

function streamFile(filepath) {
  return new Promise((resolve, reject) => {
    // createReadStream and all other streams are event emitters
    // when createReadStream starts to read the file, it throws an event called 'open'
    // there is also an 'error' event
    // .on method allows you to listen for events
    const fileStream = fs.createReadStream(filepath);

    fileStream.on('open', () => {
      resolve(fileStream);
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

function webserver(req, res) {
  const baseURI = url.parse(req.url);
  const filepath = path.join(__dirname, (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname));
  const contentType = mimes[path.extname(filepath)];

  fileAccess(filepath)
    .then(streamFile)
    .then((fileStream) => {
      res.writeHead(200, { 'Content-Type': contentType });
      // res.end(content, 'utf-8');
      // a Stream is a continuos flow of data so instead of using res.end()
      // we pipe the readable stream (fileStream) to write stream (res)
      fileStream.pipe(res);
    })
    .catch((error) => {
      res.writeHead(404);
      res.end(JSON.stringify(error));
    });
}

http.createServer(webserver).listen(3000, () => console.log('Server running in port 3000...'));
