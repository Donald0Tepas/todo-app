const API = 'http://localhost:3000';

async function loadTasks() {
  const res = await fetch(API + '/tasks');
  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.title + (t.completed ? ' ✅' : '');
    li.onclick = () => toggleTask(t.id, !t.completed);
    const del = document.createElement('button');
    del.textContent = '❌';
    del.onclick = e => { e.stopPropagation(); deleteTask(t.id); };
    li.appendChild(del);
    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById('taskInput').value;
  await fetch(API + '/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  document.getElementById('taskInput').value = '';
  loadTasks();
}

async function toggleTask(id, completed) {
  await fetch(API + `/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(API + `/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

loadTasks();
