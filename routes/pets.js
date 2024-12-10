import pkg from 'pg';
import path from 'path';

const { Pool } = pkg;
import express from 'express';

const router = express.Router();

const pool = new Pool({
    user: 'erick',
    host: 'localhost',
    database: 'examples',
    password: '123',
    port: 5432
});

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkAuth(req, res, next) {
    console.log(req.session.user)
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}



  
//Добавление
router.post('/pets', checkAuth, async (req, res) => {
    const {name, age} = req.body;
    const user = req.session.user;


    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])
    if (!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' })
    }
    const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
    const userId = userIdQuery.rows[0].id;

    if (name && age) {
        const result = await pool.query(
            'INSERT INTO pets (user_id, name, age) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, age]
    );
    res.redirect('/pets/admin')
    } else {
        res.status(400).json({error: 'Pet is required'})
    }
});



router.get('/pets', checkAuth, async (req, res) =>{
    const query = 'SELECT * FROM pets';
    const result = await pool.query(query);
    res.json(result.rows);
});

router.get('/pets/list', checkAuth, async(req, res) =>{
    res.sendFile(path.join(__dirname, '../views/pets.html'));
})

router.get('/pets/admin', checkAuth, async (req, res) => {
    const user = req.session.user

    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])

    if(!isAdmin.rows[0].admin){
        return res.status(403).json({ error: 'Access denied' });
    }
    const result = await pool.query('SELECT * FROM pets');
    res.sendFile(path.join(__dirname, '../views/pets_admin.html'));
});

router.get('/pets/user', checkAuth, async (req, res) =>{
    const user = req.session.user;
    const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
    const userId = userIdQuery.rows[0].id;

    const result = await pool.query('SELECT * FROM pets WHERE user_id = $1', [userId]);
    res.json(result.rows);
})


router.put('/pets/:pet', checkAuth, async (req, res) => {
    const {pet} = req.params;
    const user = req.session.user;
    const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [user]);
    const userId = userIdQuery.rows[0].id;

    // const {name, age} = req.body;

    const result = await pool.query(
        'UPDATE pets SET user_id= $1 WHERE id = $2 RETURNING *',
        [userId, pet]
    );
    res.redirect('/account');
})

router.delete('/pets/:pet', checkAuth, async (req, res) => {
    const { pet } = req.params;
    const user = req.session.user

    const isAdmin = await pool.query(
          `SELECT admin FROM users WHERE username = $1`, 
           [user])
    if(!isAdmin.rows[0].admin){
            return res.status(403).json({ error: 'Access denied' });
        }

    try
        {const result = await pool.query(
            'DELETE FROM pets WHERE id = $1 RETURNING *',
            [pet] 
        );

        if (result.rowCount > 0) {
            res.redirect('/pets/list')
        } else {
            res.status(400).json({error: `что-то пошло не так, такого бобика нет в базе`})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: `что-то пошло прям совсем не так`})
    }
})

export default router;