import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { hashPassword, comparePassword } from '../utils/user.js';

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

const JWT_SECRET = 'your_jwt_secret_key';

client.connect()
  .then(() => {
    db = client.db('books'); 
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection('users').insertOne({ username, password: hashedPassword });
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.collection('users').findOne({ username });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
};
