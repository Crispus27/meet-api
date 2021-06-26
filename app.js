const express = require('express');
const app = express();
const eventRoutes = require('./routes/events')

app.use('/api/v1/events', eventRoutes)

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