const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];
let nextId = 1;

// GET - Obtener todas las tareas
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST - Crear nueva tarea
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'El texto de la tarea es requerido' });
  }
  const todo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH - Marcar tarea como completada/pendiente
app.patch('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Tarea no encontrada' });
  todo.completed = !todo.completed;
  res.json(todo);
});

// DELETE - Eliminar tarea
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
