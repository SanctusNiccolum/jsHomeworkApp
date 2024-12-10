import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const { Pool } = pkg;

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    user: 'erick',
    host: 'localhost',
    database: 'examples',
    password: '123',
    port: 5432
});


router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.send('Пользователь уже существует.');
        }
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.send('Ошибка при регистрации.');
    }
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});
 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (user.rows.length > 0) {
            req.session.user = username;
            const isAdmin = await pool.query(
                `SELECT admin FROM users WHERE username = $1`, 
                 [username])
            if (!isAdmin.rows[0].admin){
            res.redirect('/account');
            }
            else {
                res.redirect('pets/admin')
            }
        } else {
            res.send('Неверное имя пользователя или пароль.');
        }
    } catch (err) {
        console.error(err);
        res.send('Ошибка при авторизации.');
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/account', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router