const STORAGE_KEYS = {
  REMINDERS: 'reminders',
  ARCHIVES: 'archivedReminders'
};

// === Add/Update Task ===
document.addEventListener('DOMContentLoaded', () => {
  const addTaskBtn = document.getElementById('addTaskBtn');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      const isEdit = urlParams.has('id');

      const taskData = {
        id: isEdit ? parseInt(urlParams.get('id')) : Date.now(),
        title: document.getElementById('taskTitle').value.trim(),
        purpose: document.getElementById('taskPurpose').value.trim(),
        deadline: document.getElementById('taskDeadline').value,
        category: document.getElementById('taskType').value,
        highPriority: document.getElementById('taskPriority').checked,
        archived: false
      };

      if (!taskData.title || !taskData.deadline) {
        alert('Title and Deadline are required!');
        return;
      }

      const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS)) || [];
      if (isEdit) {
        const index = reminders.findIndex(t => t.id === taskData.id);
        if (index !== -1) reminders[index] = taskData;
      } else {
        reminders.push(taskData);
      }

      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
      window.location.href = 'storage.html';
    });
  }

  // === Load Reminders ===
  function loadReminders() {
    const container = document.getElementById('remindersContainer');
    if (!container) return;

    const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS)) || [];
    container.innerHTML = reminders.map(task => `
      <li class="reminder-item">
        <div class="reminder-content">
          <strong>${task.title}</strong> 
          <span class="category">(${task.category})</span>
          <p>${task.purpose}</p>
          <small>Deadline: ${task.deadline}</small>
          ${task.highPriority ? ' <span class="priority">🔥</span>' : ''}
        </div>
        <div class="reminder-actions">
          <a href="schoolwork.html?id=${task.id}" class="edit-btn">✏️ Edit</a>
          <button class="archive-btn">📦 Archive</button>
        </div>
      </li>
    `).join('');

    container.addEventListener('click', handleArchiveActions);
  }

  // === Archive Task ===
  function handleArchiveActions(event) {
    if (!event.target.classList.contains('archive-btn')) return;

    const reminderItem = event.target.closest('.reminder-item');
    const taskId = parseInt(reminderItem?.querySelector('.edit-btn').href.split('id=')[1]);
    if (!taskId) return;

    const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS)) || [];
    const taskIndex = reminders.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const archives = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARCHIVES)) || [];
    archives.push(reminders[taskIndex]);
    localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(archives));

    reminders.splice(taskIndex, 1);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    loadReminders();
  }

  // === Load Edit Form ===
  function loadEditForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    if (!taskId) return;

    const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS)) || [];
    const task = reminders.find(t => t.id === parseInt(taskId));
    if (!task) return;

    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskPurpose').value = task.purpose;
    document.getElementById('taskDeadline').value = task.deadline;
    document.getElementById('taskType').value = task.category;
    document.getElementById('taskPriority').checked = task.highPriority;
  }

  // === Load Archived Tasks ===
  function loadArchivedItems() {
    const container = document.getElementById('archivesContainer');
    if (!container) return;

    const archives = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARCHIVES)) || [];
    container.innerHTML = archives.map(task => `
      <li class="archived-item" data-id="${task.id}">
        <div class="reminder-content">
          <strong>${task.title}</strong> 
          <span class="category">(${task.category})</span>
          <p>${task.purpose}</p>
          <small>Deadline: ${task.deadline}</small>
          ${task.highPriority ? ' <span class="priority">🔥</span>' : ''}
        </div>
        <div class="reminder-actions">
          <button class="delete-permanent">Delete Permanently</button>
        </div>
      </li>
    `).join('');

    container.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-permanent')) return;

      const item = e.target.closest('.archived-item');
      const taskId = item.dataset.id;
      const updated = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARCHIVES)).filter(t => t.id != taskId);
      localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(updated));
      item.remove();
    });
  }

  // === Todo List ===
  const todoList = document.getElementById('todoList');
  const addTodoBtn = document.getElementById('add-todo');

  const getTodos = () => JSON.parse(localStorage.getItem('todos')) || [];

  const loadTodos = () => {
    if (!todoList) return;
    const todos = getTodos();
    todoList.innerHTML = todos.map(todo => `
      <li class="todo-item" data-id="${todo.id}">
        <div class="todo-content">
          <input type="checkbox" ${todo.completed ? 'checked' : ''}>
          <span>${todo.text}</span>
        </div>
        <button class="delete-todo">&times;</button>
      </li>
    `).join('');
  };

  if (addTodoBtn) {
    addTodoBtn.addEventListener('click', () => {
      const text = prompt('Enter todo item:');
      if (text) {
        const newTodo = {
          id: Date.now(),
          text: text.trim(),
          completed: false,
          date: new Date().toLocaleDateString()
        };
        const todos = [...getTodos(), newTodo];
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
      }
    });
  }

  if (todoList) {
    todoList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-todo')) {
        const li = e.target.closest('li');
        const todos = getTodos().filter(todo => todo.id !== parseInt(li.dataset.id));
        localStorage.setItem('todos', JSON.stringify(todos));
        li.remove();
      }
    });

    todoList.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const li = e.target.closest('li');
        const todos = getTodos().map(todo =>
          todo.id === parseInt(li.dataset.id)
            ? { ...todo, completed: e.target.checked }
            : todo
        );
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    });
  }

  loadTodos();

  // === Initial Load ===
  if (document.getElementById('remindersContainer')) loadReminders();
  if (document.getElementById('taskTitle')) loadEditForm();
  if (document.getElementById('archivesContainer')) loadArchivedItems();

  const calendarEl = document.getElementById('mini-calendar');
  if (calendarEl && typeof FullCalendar !== 'undefined') {
    new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: false,
      height: 250,
      contentHeight: 250,
      aspectRatio: 1
    }).render();
  }
});

let activeTab = 'work';

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab:contains(${tab.charAt(0).toUpperCase() + tab.slice(1)})`)?.classList.add('active');
  updateScheduleView();
}

function updateScheduleView() {
  const container = document.getElementById('scheduleContainer');
  container.innerHTML = `<p>Currently viewing: <strong>${activeTab.toUpperCase()}</strong> schedule.</p>`;
}

function addSchedule() {
  alert("Add Schedule clicked!");
}

function addTodo() {
  const item = prompt("Enter a new to-do:");
  if (item) {
    const li = document.createElement("li");
    li.textContent = item;
    document.getElementById("todoList").appendChild(li);
  }
}

window.onload = () => {
  updateScheduleView();
};



function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
  updateScheduleView();
}

function updateScheduleView() {
  const grid = document.querySelector('.schedule-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const scheduleData = {
    work: [
      'Meeting', '', 'Project', '', 'Report', '', ''
    ],
    personal: [
      '', 'Grocery', '', 'Gym', '', 'Family', ''
    ],
    study: [
      'Math', 'Physics', '', 'CS', '', '', 'Review'
    ]
  };

  // Headers
  days.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'schedule-day-header';
    cell.textContent = day;
    grid.appendChild(cell);
  });

  // Tasks
  const tasks = scheduleData[activeTab] || [];
  tasks.forEach(task => {
    const cell = document.createElement('div');
    cell.textContent = task;
    grid.appendChild(cell);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  updateScheduleView();

  const calendarEl = document.getElementById('mini-calendar');
  if (calendarEl && typeof FullCalendar !== 'undefined') {
    new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: false,
      height: 250
    }).render();
  }
});

// Update button ID in event listener
let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
let editingId = null;

document.getElementById('addScheduleBtn').addEventListener('click', () => {
    showScheduleForm();
});

function showScheduleForm(schedule = null) {
    const formHtml = `
        <div class="schedule-form">
            <input type="text" id="scheduleName" placeholder="Schedule Name" 
                   value="${schedule?.name || ''}" required>
            <input type="text" id="schedulePurpose" placeholder="Purpose" 
                   value="${schedule?.purpose || ''}" required>
            <input type="date" id="scheduleDate" 
                   value="${schedule?.date || ''}" required>
            <input type="time" id="scheduleTime" 
                   value="${schedule?.time || ''}" required>
            <div class="form-actions">
                <button onclick="saveSchedule('${schedule?.id || ''}')">
                    <i class="fas fa-check"></i> Save
                </button>
                <button onclick="closeForm()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

function saveSchedule(id = null) {
    const schedule = {
        id: id || Date.now().toString(),
        name: document.getElementById('scheduleName').value,
        purpose: document.getElementById('schedulePurpose').value,
        date: document.getElementById('scheduleDate').value,
        time: document.getElementById('scheduleTime').value
    };

    if (id) {
        const index = schedules.findIndex(s => s.id === id);
        schedules[index] = schedule;
    } else {
        schedules.push(schedule);
    }

    localStorage.setItem('schedules', JSON.stringify(schedules));
    renderSchedules();
    closeForm();
}

function renderSchedules() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = schedules.map(schedule => `
        <tr data-id="${schedule.id}">
            <td>${schedule.name}</td>
            <td>${schedule.purpose}</td>
            <td>${schedule.date}</td>
            <td>${schedule.time}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editSchedule('${schedule.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="confirmDelete('${schedule.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editSchedule(id) {
    const schedule = schedules.find(s => s.id === id);
    showScheduleForm(schedule);
}

function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        deleteSchedule(id);
    }
}

function deleteSchedule(id) {
    schedules = schedules.filter(s => s.id !== id);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    renderSchedules();
}

function closeForm() {
    const form = document.querySelector('.schedule-form');
    if (form) form.remove();
}

// Initial load
document.addEventListener('DOMContentLoaded', renderSchedules);
