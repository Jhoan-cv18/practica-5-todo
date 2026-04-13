const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  renderTodos(todos);
}

function renderTodos(todos) {
  todoList.innerHTML = '';

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  totalCount.textContent = `${total} tarea${total !== 1 ? 's' : ''}`;
  completedCount.textContent = `${completed} completada${completed !== 1 ? 's' : ''}`;

  emptyState.style.display = total === 0 ? 'block' : 'none';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <button class="todo-check" title="Marcar como ${todo.completed ? 'pendiente' : 'completada'}">
        ${todo.completed ? '✓' : ''}
      </button>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="todo-delete" title="Eliminar tarea">✕</button>
    `;

    li.querySelector('.todo-check').addEventListener('click', () => toggleTodo(todo.id));
    li.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

async function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (res.ok) {
    todoInput.value = '';
    fetchTodos();
  }
}

async function toggleTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'PATCH' });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  fetchTodos();
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

fetchTodos();
