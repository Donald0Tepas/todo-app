const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
  const r = await pool.query('SELECT * FROM tasks ORDER BY id');
  res.json(r.rows);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const r = await pool.query('INSERT INTO tasks(title) VALUES($1) RETURNING *', [title]);
  res.status(201).json(r.rows[0]);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const r = await pool.query('UPDATE tasks SET completed=$1 WHERE id=$2 RETURNING *', [completed, id]);
  res.json(r.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
  res.status(204).send();
});

app.listen(3000, () => console.log('✅ Backend corriendo en puerto 3000'));
