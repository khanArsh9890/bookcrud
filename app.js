import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/book.js';
import authRoutes from './routes/user.js';

const app = express();

app.use(bodyParser.json());

app.use('/api', bookRoutes);
app.use('/api/auth', authRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
