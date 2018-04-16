const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();
const books = [
  {
    title: 'book 1',
    genre: 'book 1 genre',
    author: 'book 1 author',
    read: false,
  },
  {
    title: 'book 2',
    genre: 'book 2 genre',
    author: 'book 2 author',
    read: false,
  },
  {
    title: 'book 3',
    genre: 'book 3 genre',
    author: 'book 3 author',
    read: false,
  },
  {
    title: 'book 4',
    genre: 'book 4 genre',
    author: 'book 4 author',
    read: false,
  },
  {
    title: 'book 5',
    genre: 'book 5 genre',
    author: 'book 5 author',
    read: false,
  },
];

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected mongo');

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });
  return adminRouter;
}

module.exports = router;
