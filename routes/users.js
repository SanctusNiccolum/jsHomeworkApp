import pkg from 'pg';
import path from 'path';

const { Pool } = pkg;
import express from 'express';
import { fileURLToPath } from 'url';

const router = express.Router();

const pool = new Pool({
    user: 'erick',
    host: 'localhost',
    database: 'examples',
    password: '123',
    port: 5432
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}



router.get('/users', checkAuth, async (req, res) =>{
    const user = req.session.user

    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])

    if(!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' });
    }
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
})

router.post('/users', checkAuth, async(req, res) =>{
    const { username, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.send('Пользователь уже существует.');
        }
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
        res.redirect('/users/admin')
    } catch (err) {
        console.error(err);
        res.send('Ошибка при регистрации.');
    }
})

router.get('/users/admin', checkAuth, async(req, res) => {
    const user = req.session.user

    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])

    if(!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' });
    }
    const result = await pool.query('SELECT * FROM users');
    res.sendFile(path.join(__dirname, '../views/users.html'));
});

router.get('/users/:id', checkAuth, async(req, res) => {
    const {id} = req.params;
    console.log(id)
    const user = req.session.user

    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])

    if(!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' });
    }
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(result.rows);

})

router.get('/users/admin/:id', checkAuth, async(req, res) =>{
    const {id} = req.params;
    console.log('Admin ' + id);
    const user = req.session.user

    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])

    if(!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' });
    }
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.sendFile(path.join(__dirname, '../views/user_info.html'))
    
})

router.put('/users/:id', checkAuth, async(req, res) =>{
    const {id} = req.params;
    const user = req.session.user;
    const {username, password} = req.body;
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
        return res.send('Пользователь уже существует.');
    }
    const userIdQuery = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const result = await pool.query(
        'UPDATE users SET username= $1, password=$2 WHERE id = $3 RETURNING *',
        [username, password, id]
    );
    res.json(result.rows[0]);
})

router.delete('/users/:id', checkAuth, async(req, res) =>{
    const user = req.session.user
    const { id } = req.params
    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])

    if(!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' });
    }
    try {

        const result = pool.query('DELETE FROM users WHERE id = $1 RETURNING *' , [id]);
        if (result.rowCount > 0) {
            res.redirect('/users/admin')
        } else {
            res.status(400).json({error: `такого пользователя нет`})
        }
    }catch (error) {
        console.log(error);
        res.status(500).json({error: `что-то пошло прям совсем не так`})
    }

})

export default router;