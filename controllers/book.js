import { MongoClient, ObjectId } from 'mongodb';
import config from '../config.js';

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

client.connect()
  .then(() => {
    db = client.db('books'); 
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));

export const createBook = async (req, res) => {
    try {
     
      const book = req.body;
      if (!book.name || !book.summary || !book.img) {
        return res.status(400).json({ error: 'Title and author are required' });
      }
  
      const result = await db.collection('books').insertOne(book);
  
      if (result && result.insertedId) {
        res.status(201).json({ insertedId: result.insertedId });
      } else {
        res.status(500).json({ error: 'Failed to insert book' });
      }
    } catch (err) {
      console.error('Error creating book:', err);
      res.status(400).json({ error: err.message });
    }
  };


export const getAllBooks = async (req, res) => {
  try {
    const Book = await db.collection('Book').find().toArray();
    res.status(200).json(Book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await db.collection('Book').findOne({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBook = req.body;
    const result = await db.collection('Book').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBook }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const book = await db.collection('Book').findOne({ _id: new ObjectId(id) });
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('Book').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
