const express = require('express');
const mysql = require('mysql');
var cors = require('cors')
const bodyParser = require('body-parser');
const url = require('url');

const app = express();
const port = 3000;
app.use(cors());

// Database connection parameters
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'home_iot'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Middleware for parsing JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle different paths
app.get('', (req, res) => {
  return res.send('hello');
});

app.get('/check_status', (req, res) => {
  const device = req.query.device || '';

  const sql = 'SELECT * FROM iot WHERE name = ?';
  db.query(sql, [device], (err, results) => {
    if (err) {
      return res.status(500).send('Database query failed');
    }

    if (results.length > 0) {
      return res.send(results[0].status.toString());
    } else {
      return res.send('0 results');
    }
  });
});

app.post('/replace', (req, res) => {
  const { name, status } = req.body;
  console.log(status)
  const sql = `INSERT INTO iot (name, status) VALUES (?, ?) 
               ON DUPLICATE KEY UPDATE status = VALUES(status)`;
  db.query(sql, [name, status], (err, result) => {
    if (err) {
      return res.status(500).send('Database query failed');
    }
    return res.send('Record replaced successfully');
  });
});

app.use((req, res) => {
  res.status(404).send('Invalid path');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
