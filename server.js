// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Read all saved notes
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Add a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique ID for the note

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading notes' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error writing note' });
      }
      res.json(newNote);
    });
  });
});

