const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();



//Middleware is just a function that takes three parameters...
function logBeginningAndEnd(req, res, next) {
  console.log('Request start');
  next();
  console.log('Request end');
}

//...and is passed into the `use` function for the app.
app.use(logBeginningAndEnd);

//So is the express static file stuff!
app.use(express.static('public'));

//This is middleware that adds very unrestrictive CORS headers.
const allowCrossDomain = function(req, res, next) {
  console.log('adding CORS headers')

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '*');

  next();
  console.log('leaving CORS headers middleware');
}

app.use(allowCrossDomain);

//You don't have to create a named function. This works too.
app.use(function(req, res, next) {
  console.log('Do we have a request body before?', req.body);
  next();
  console.log('Do we have a request body after?', req.body);
});

//Body parser is middleware!
app.use(bodyParser.urlencoded({ extended: true }));

//This is a silly piece of middleware to show you what happens if you `send` instead of `next`.
app.use(function(req, res, next) {
  console.log('stop me', req.query);

  if (req.query.stopme) {
    res.send('I have altered the request. Pray that I do not alter it further.');
  }
  else if (req.query.makeerror) {
    console.log('Error time')
    throw new Error('Bad things happening.');
  }
  else {
    next();
  }
});

//Error handling middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.redirect('https://youtu.be/aV2DLkDPwM8?t=51s');
});




app.post('/post-here', function(req, res) {
  console.log('post route');
  res.json(req.body);
});

app.get('/not-static', function(req, res) {
  console.log('not a static file')
  res.send('not a static file');
});

app.listen(3005, function() {
  console.log('Listening on port 3005');
});
