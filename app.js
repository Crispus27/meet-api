const express = require('express');
const app = express();
const eventRoutes = require('./routes/events')
const orgRoutes = require('./routes/organisations')
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use('/api/v1/events', eventRoutes)
app.use('/api/v1/organisations', orgRoutes)

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });
 
 app.get('/ko', function(req, res) {
    res.send('Hello World')
  })
  app.get('/', (req, res) => {
    res.send('Hello World')
  })
module.exports = app;