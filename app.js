const express = require('express');
const app = express();
const eventRoutes = require('./routes/events')
const orgRoutes = require('./routes/organisations')
const bodyParser = require('body-parser')
const session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    redisClient =  require('./utils/redis_client');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "meet-api",
    store: new RedisStore({client:redisClient}),
    cookie: {
        httpOnly: false,
        secure: true,
        maxAge: 36000000 // Time is in miliseconds
    }
}));
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