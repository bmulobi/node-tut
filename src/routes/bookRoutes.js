const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');
const { MongoClient, ObjectID } = require('mongodb');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected mongo');

          const db = client.db(dbName);

          const col = await db.collection('books');
          const books = await col.find().toArray();
          debug(books);
          res.render(
            'bookListView',
            {
              nav,
              title: 'Library',
              books,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());

      /* (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books: recordset,
          },
        );
      }());
      */
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      /* (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input('id', sql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        next();
      }());
      */
      next();
    })
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongo() {
        const { id } = req.params;
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to Mongo findOne');

          const db = client.db(dbName);
          const col = await db.collection('books');
          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);
          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book,
            },
          );
        } catch (error) {
          debug(error.stack);
        }
      }());
    });

  return bookRouter;
}

module.exports = router;
