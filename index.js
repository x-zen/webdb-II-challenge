const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

// endpoints here
server.post('/api/zoos' (req,res) => {
  const zoo = req.body;

  if (!zoo.name) {
    res.status(400).json({ error: 'Please provide the name of this zoo'.})
  } else {
    db
      .insert(zoo)
      .into('zoos')
      .then(id => {
        res.status(201).json(id);
      })
      .catch(err => {
        res.status(500).json(err);
      })
  }
});

server.get('/api/zoos' (req,res) => {
  db
    .get()
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json({ error: 'The zoo information could not be retrieved.' });
    })
});

server.get('/api/zoos/:id' (req,res) => {
  const { id } = req.params;

  db
    .get(id)
    .then(zoo => {
      if (zoo.length === 0) {
        res.status(404).json({ error: 'The zoo with the specified ID does not exist.'});
        return;
      }
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json({ error: 'The zoo information could not be retrieved.'});
    })
});

server.delete('/api/zoos/:id' (req,res) => {
  const { id } = req.params;

  db('zoos')
    .where({ id })
    .del()
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});

server.put('/api/zoos/:id' (req,res) => {
  const changes = req.body;
  const { id } = req.params;

  db('zoos')
    .where('id', '=', id)
    .update(changes)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json(err);
    })
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
