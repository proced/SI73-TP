#!/usr/bin/env node
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var fs = require('fs');

var app = express();
var data = JSON.parse(fs.readFileSync('data.json'));
var sess = {};
var request;

app.use(session({
  secret: 'si73',
  resave: false,
  saveUninitialized: true
}));


app.use(function (req, res, next) {
  var views = req.session.views;

  if (!views) {
    views = req.session.views = {};
  }

  // get the url pathname
  var pathname = parseurl(req).pathname;

  // count the views
  views[pathname] = (views[pathname] || 0) + 1;
  next();
});

function saveUser(username, password) {
  if (data[username] === undefined) {
    var user = { password: password };
    data[username] = user;
    console.log(JSON.stringify(data));
    fs.writeFileSync("data.json", JSON.stringify(data), "utf8");
    return true;
  } else {
    return false;
  }
}

app.get('/signin', function(req, res) {
  console.log('Sign in request');
  request = req;
  var username = req.query.username;
  var password = req.query.password;
  if ((data[username] !== undefined)
      && (data[username].password === password)) {
    sess[req.session.id] = username;
    res.json({ connection: "OK" });
  } else {
    res.json({ connection: "NOK" });
  }
});

app.get('/signup', function(req, res) {
  console.log('Sign up request');
  request = req;
  var username = req.query.username;
  var password = req.query.password;
  if (saveUser(username, password)) {
    res.json({ success: 'User ' + username + ' created.' });
  } else {
    res.json({ err: 'Username ' + username + ' is already taken.' });
  }
});

app.get('/signout', function(req, res) {
  console.log('Sign out request');
  if (sess[req.session.id] !== undefined) {
    res.json({ user: sess[req.session.id] });
    delete sess[req.session.id];
  } else {
    res.json({ err: 'no user connected' })
  }
});

app.get('/content', function(req, res) {
  console.log('Access request');
  var username = sess[req.session.id];
  if (username === undefined) {
    res.json({ access: "denied" });
  } else {
    res.json({ access: "allowed", user: username });
  }
});

app.listen(3000, function() {
  console.log('SI73 server running on 3000');
});

exports.r = function() {
    return request;
}
