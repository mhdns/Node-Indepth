/* eslint-disable no-bitwise */
/* eslint-disable no-console */
// Serve the files based on the requests

const http = require('http');
const url = require('url');
// path is a built-in module to handle paths
const path = require('path');
// fs is a built-in module to  handle file i/o
// fs module let us read/write, changing file permission and etc with files
const fs = require('fs');

function webserver(req, res) {
  // if the route requested is '/', then load 'index.htm' else
  // load the requested file(s)
  // <link rel="stylesheet" href="./css/style.css"> note that the href

  const baseURI = url.parse(req.url);

  // In order to link to the file path you use __dirname, __dirname tells the
  // exact file path to the file, it's local filepath
  // An alternative option will be process.cwd(), but it is slightly different
  // it tells the directory of the calling prosess (server_3.js)
  const filepath = path.join(__dirname, (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname));


  const mimes = {
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
  };
  // Check if the requested file is accessible or not
  // the second parameter of fs.access() is the mode that will check the file on
  // fs.constants.F_OK (default)checks if file is available, F_ROK, F_WOK, F_XOK checks if file's
  // read, write and execute permissions, you can combine modes with the pipe (|) operator
  fs.access(filepath, fs.constants.F_OK | fs.constants.F_ROK, (error) => {
    if (!error) {
      // Read and serve the file, .readFile will read the file into memory
      fs.readFile(filepath, (err, content) => {
        if (!err) {
          // Resolve for the mime type of the file
          const contentType = mimes[path.extname(filepath)];
          // Serve the file
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        } else {
          // Serve 500 status
          res.writeHead(500);
          res.end('Server Error');
        }
      });
    } else {
      // Serve 404
      res.writeHead(404);
      res.end('Content not found');
    }
  });
}

http.createServer(webserver).listen(3000, () => console.log('Server running in port 3000...'));
