/* eslint-disable no-console */
// When making a request to a server you are doing one four things
// Read, Create, Update, Delete
// These are GET, POST, PUT and DELETE request repectively
// GET and PUT are Idempotent
// Idempotent means the element will not change itself regardless the number of calls
// In this case, GET and PUT will always do the exact same thing for each call
// POST is not idempotent as it creates data
// DELETE may or may not be idempotent depending on the implementation
// GET requests are cacheable, the others are not because you don't want them
// stored in the history, so use the appropriate methods

const http = require('http');
// helps to parse the req.url to its components
const url = require('url');

const routes = {
  GET: {
    '/': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Hello Router</h1>');
    },
    '/about': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>This is the about page</h1>');
    },
    '/api/getinfo': (req, res) => {
      // if you want to send a valid json change the content type to 'application/json'
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(JSON.stringify(req.queryParams));
    }
  },
  POST: {

  },
  // For unknown methods
  NA: (req, res) => {
    res.writeHead(404);
    res.end('Content not found');
  }
};


// The req cobject has many properties req.url will give the path from'/api/list?<parameters>'
// req.method will give you the method
// req.headers will give the header
// baseURI.query will cotain an object of containing all the query parameters
// baseURI.pathname will give you the pathname without the quuery parameters
const router = (req, res) => {
  console.log(`Req route ${req.url}`);
  console.log(`Req method ${req.method}`);

  // Parse req.url, true paremeter ensure that queries are parsed
  const baseURI = url.parse(req.url, true);
  console.log(baseURI);

  // Identify the method so that you can channel it to the correct keys in routes
  const resolveRoute = routes[req.method][baseURI.pathname];

  // if the resolveRoute is not undefined, then we can invoke the function with req, res
  if (resolveRoute) {
    // req.quueryParams is a custom element created to hold the query parameters from baseURI
    // This will ensure that the function can access the query parameters
    req.queryParams = baseURI.query;
    resolveRoute(req, res);
  } else {
    routes.NA(req, res);
  }
};

http.createServer(router).listen(3000, () => console.log('Server Running in Port 3000...'));
