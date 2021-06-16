const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const app = require('./app');
const dotenv = require('dotenv')


dotenv.config({ path: './config/.env' })
const DBConnection = require('./config/db')

console.log ('ghhhhhh');



app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});