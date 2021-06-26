const http = require('http');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;
const app = require('./app');
const dotenv = require('dotenv')


dotenv.config({ path: './config/.env' })
const DBConnection = require('./config/db')

app.set('port', port);
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});