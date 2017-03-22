'use strict'
//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');

var comment = new Comment({author: 'JSON', text: 'false'});

// Save it to database
comment.save(function(err){
  console.log('THIS IS THE ERROR: ', err)
  if(err)
    console.log('error', err);
  else
    console.log('right?', comment);
});

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');

  next();
});

//now we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'index'});
});

router.get('/api', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

router.get('/api/comments', function(req, res) {
  Comment.find(function (err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('Something broke!')
    } else {
      console.log(data)
      res.json(data);
    }
  });
});

//adding the /comments route to our /api router
router.route('/api/comments')
  //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Comment.find(function(err, comments) {
      if (err){
        console.log(err);
        res.send(err);
      } else {
        //responds with a json object of our database comments.
        res.json(comments)
      }
    });
  })

  //post new comment to the database
  .post(function(req, res) {
    var comment = new Comment();
    //body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;
    comment.save(function(err) {
      if (err){
        res.send(err);
      } else {
        res.json({ message: 'Comment successfully added!' });
      }
  });
});

//Use our router configuration when we call /api
app.use('/', router);
app.use('/api', router);
app.use('/api/comments', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
