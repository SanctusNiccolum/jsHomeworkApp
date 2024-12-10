import express from 'express';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import petsRoutes from './routes/pets.js';
import usersRoutes from './routes/users.js';

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 } // Сессия на 10 минут
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);
app.use('/', petsRoutes);
app.use('/', usersRoutes);

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});