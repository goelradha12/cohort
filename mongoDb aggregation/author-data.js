// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("learn");

// Find a document in a collection.
db.getCollection("authors").insertMany(
    [
    {
      "_id": 100,
      "name": "F. Scott Fitzgerald",
      "birth_year": 1896
    },
    {
      "_id": 101,
      "name": "George Orwell",
      "birth_year": 1903
    },
    {
      "_id": 102,
      "name": "Harper Lee",
      "birth_year": 1926
    }
  ]
);
