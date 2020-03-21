// Need for starting a server - Built-in module
const http = require('http');

// The createServer method is async
// Server listens for reqs and responds, hence callback function has two aguments req and res
// req brings in users request, res allows the server to dispatch a appropriate response to the user

// Data flows through gateways within the computer as ports and typically webservers work on port 80
// but we are going to listen in port 3000 using .listen(<port>, <callback>)
http.createServer((req, res) => {
  // Sends the res header
  res.writeHead(200, { 'Content-type': 'text/html' });

  // Sends the response and ends the response
  res.end('<h1>Hello Node.js</h1>');
// eslint-disable-next-line no-console
}).listen(3000, () => console.log('Server Running in Port 3000...'));
