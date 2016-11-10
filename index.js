var express = require('express');
var app = express();
var cors = require('cors');
var pg = require('pg');

pg.defaults.ssl = true;
client = new pg.Client(process.env.DATABASE_URL);
client.connect();
query = client.query('CREATE TABLE IF NOT EXISTS reports (id SERIAL PRIMARY KEY, content TEXT)');
query.on('end', function() {
  console.log('Initialized!');
});

app.use(cors());
app.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

app.post('/', function(req, res) {
  client.query('INSERT INTO "reports" (content) VALUES($1)', [req.body], function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.send('true');
    }
  });
});

app.get('/count', function(req, res) {
  client.query('SELECT COUNT(*) FROM "reports"', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/last', function(req, res) {
  client.query('SELECT * FROM "reports" ORDER BY "id" DESC LIMIT 10', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/all', function(req, res) {
  client.query('SELECT * FROM "reports" ORDER BY "id" DESC', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening...");
});
