#!/usr/bin/env node
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var mustache = require('mustache');
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');

var sel = 'difvzhbvubororifxtrzhockbihoxri';

var app = express();
var data;
var sess = {};
var request;

var lastLoginFailed = false;

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

function log(s) {
  console.log('[' + new Date() + '] ' + s);
}

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

function md5(s) {
  return crypto.createHash('md5').update(sel + s).digest('hex');
}

function saveUser(username, password, name, email) {
  if (data.users[username] === undefined) {
    var user = {
        password: md5(password),
        name: name,
        email: email,
    };
    data.users[username] = user;
    fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');
    return true;
  } else {
    return false;
  }
}

function signIn(username, password, sessId) {
  if ((data.users[username] !== undefined)
      && (data.users[username].password === md5(password))) {
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

function register(res, err) {
  var isRegisterErr = true;
  if (err === '') {
    isRegisterErr = false;
  }
  serv(res, 'login.html', {
    signin: '',
    signup: 'active',
    isLoginErr: false,
    loginErr: '',
    isRegisterErr: isRegisterErr,
    registerErr: err,
  });
}

function isConnected(sessId) {
  return sess[sessId] !== undefined;
}

function getUser(sessId) {
  return data.users[sess[sessId]];
}

app.get('/login', function(req, res) {
  log('Login request');
  var isLoginErr = false;
  if (lastLoginFailed) {
    isLoginErr = true;
  }
  serv(res, 'login.html', {
    signin: 'active',
    isLoginErr: isLoginErr,
    loginErr: 'Identifiants incorrects',
    signup: '',
    isRegisterErr: false,
    registerErr: '',
  });
});

app.post('/signup', function(req, res) {
  log('Sign up request');
  request = req;
  lastLoginFailed = false;
  var username = req.body.un;
  var name = req.body.name;
  var email = req.body.email;
  var password;
  if ((req.body.pw[0] !== '') && (req.body.pw[0] === req.body.pw[1])) {
    password = req.body.pw[0];
    log('    ' + username);
    if (saveUser(username, password, name, email)) {
      signIn(username, password, req.session.id);
      res.redirect('/attendee');
    } else {
      log('User ' + username + ' already exists');
      register(res, 'Login déjà utilisé');
    }
  } else {
    log(req.body.pw[0] + ' != ' + req.body.pw[1]);
    register(res, 'Les mots de passe ne correspondent pas');
  }
});

app.post('/signin', function(req, res) {
  log('Sign in request');
  request = req;
  var username = req.body.un;
  var password = req.body.pw;
  log('    ' + username);
  if (signIn(username, password, req.session.id)) {
    log('    OK');
    lastLoginFailed = false;
    res.redirect('/attendee');
  } else {
    log('    NOK');
    lastLoginFailed = true;
    res.redirect('login.html');
  }
});

app.use(function(req, res, next) {
  if (!isConnected(req.session.id)) {
    res.redirect('/login');
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.redirect('/attendee');
});

app.get('/signout', function(req, res) {
  log('Sign out request');
  if (sess[req.session.id] !== undefined) {
    log('    ' + sess[req.session.id]);
    delete sess[req.session.id];
  } else {
  }
  res.redirect('/login');
});

app.get('/attendee', function(req, res) {
  log('Attendee request');
  serv(res, 'attendee.html', {
    name: getUser(req.session.id).name,
  });
});

app.get('/training', function(req, res) {
  log('Training request');
  serv(res, 'training.html', {
    name: getUser(req.session.id).name,
  })
});

app.get('/manage', function(req, res) {
  log('Manage request');
  serv(res, 'manage.html', {
    name: getUser(req.session.id).name,
  })
});

//app.get('/test', function(req, res) {
//  log('Test request');
//  fs.readFile('html/test.html', 'utf-8', function(err, html) {
//    if (err) throw err;
//    var pdata = {
//      i: 'abc',
//      ii: 'def',
//      t: [1, 2, 3, 4, 5].map(function(x) {
//          return {n: x};
//      }),
//    };
//    res.send(mustache.render(html, pdata));
//  });
//});

app.get('/*', function(req, res){
  log('Invalid GET request: ' + req.url);
  res.status(404);
  serv(res, '404.html', {})
});

app.post('/*', function(req, res){
  log('Invalid POST request: ' + req.url);
  res.status(404).send('404 Not found');
});

app.listen(80, function() {
  log('SI73 server running on port 80');
});

exports.r = function() {
    return request;
}
