const http = require('http');

response = "Wilson";

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('¡Hola, mundo!\n');
});

const port = 3000;

server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}/`);
});