#!/usr/bin/env node
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var mustache = require('mustache');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var data;
var sess = {};
var request;

fs.readFile('data.json', 'utf-8', function(err, jsontxt) {
  if (err) {
    data = {
      users: {},
    };
    fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8')
  } else {
      data = JSON.parse(jsontxt);
  }
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(session({
  secret: 'si73',
  resave: false,
  saveUninitialized: true
}));

app.use('/media', express.static('static/media'));
app.use('/files', express.static('static/files'));
app.use('/fonts', express.static('static/fonts'));
app.use('/css', express.static('static/css'));
app.use('/img', express.static('static/img'));
app.use('/js', express.static('static/js'));

function loginFailed(res) {
  res.send("<html><body><h1>Échec de connexion</h1></body></html>")
}

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
  if (data.users[username] === undefined) {
    var user = { password: password };
    data.users[username] = user;
    fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');
    return true;
  } else {
    return false;
  }
}

function signIn(username, password, sessId) {
  if ((data.users[username] !== undefined)
      && (data.users[username].password === password)) {
    sess[sessId] = username;
    return true;
  } else {
    return false;
  }
}

function serv(res, file, pdata) {
  fs.readFile('html/' + file, 'utf-8', function(err, html) {
    if (err) throw err;
    res.send(mustache.render(html, pdata));
  });
}

function register(res) {
  serv(res, 'login.html', {
    signin: '',
    signup: 'active',
  });
}

function isConnected(sessId) {
  return sess[sessId] !== undefined;
}

app.get('/', function(req, res) {
  if (isConnected(req.session.id)) {
      res.redirect('/content');
  } else {
      res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  console.log('Login request');
  serv(res, 'login.html', {
    signin: 'active',
    signup: '',
  });
});

app.post('/signup', function(req, res) {
  console.log('Sign up request');
  request = req;
  var username = req.body.un;
  var password;
  if ((req.body.pw[0] !== '') && (req.body.pw[0] === req.body.pw[1])) {
    password = req.body.pw[0];
    console.log('    ' + username + ' ' + password);
    if (saveUser(username, password)) {
      signIn(username, password, req.session.id);
      res.redirect('/content');
    } else {
      console.log('User ' + username + ' already exists');
      register(res);
    }
  } else {
    console.log(req.body.pw[0] + ' != ' + req.body.pw[1]);
    register(res);
  }
});

app.post('/signin', function(req, res) {
  console.log('Sign in request');
  request = req;
  var username = req.body.un;
  var password = req.body.pw;
  console.log('    ' + username + ' ' + password);
  if (signIn(username, password, req.session.id)) {
    res.redirect('/content');
  } else {
    serv(res, 'login.html', {err: "Identifiants incorrects"});
  }
});

app.get('/signout', function(req, res) {
  console.log('Sign out request');
  if (sess[req.session.id] !== undefined) {
    console.log('    ' + sess[req.session.id]);
    delete sess[req.session.id];
    //res.json({ user: sess[req.session.id] });
  } else {
    //res.json({ err: 'no user connected' })
  }
  res.redirect('/login');
});

app.get('/content', function(req, res) {
  console.log('Access request');
  var username = sess[req.session.id];
  if (username === undefined) {
    res.json({ access: 'denied' });
  } else {
    res.json({ access: 'allowed', user: username });
  }
});

app.get('/test', function(req, res) {
  console.log('Test request');
  fs.readFile('html/test.html', 'utf-8', function(err, html) {
    if (err) throw err;
    var pdata = {
      i: 'abc',
      ii: 'def',
      t: [1, 2, 3, 4, 5].map(function(x) {
          return {n: x};
      }),
    };
    res.send(mustache.render(html, pdata));
  });
});

app.get('/*', function(req, res){
  console.log('Invalid GET request: ' + req.url);
  res.status(404).send('404 Not found');
});

app.post('/*', function(req, res){
  console.log('Invalid POST request: ' + req.url);
  res.status(404).send('404 Not found');
});

app.listen(3000, function() {
  console.log('SI73 server running on 3000');
});

exports.r = function() {
    return request;
}
