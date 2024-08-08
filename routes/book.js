import express from 'express';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controllers/book.js';
import authMiddleware from '../middleware/auth.js'

const bookRoutes = express.Router();

bookRoutes.post('/books', authMiddleware, createBook);
bookRoutes.get('/books', authMiddleware, getAllBooks);
bookRoutes.get('/books/:id', authMiddleware, getBookById);
bookRoutes.put('/books/:id', authMiddleware, updateBook);
bookRoutes.delete('/books/:id', authMiddleware, deleteBook);

export default bookRoutes;
