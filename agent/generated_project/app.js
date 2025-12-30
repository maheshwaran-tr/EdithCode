// app.js – Todo App core functionality
// -------------------------------------------------
// This script implements the data model, task manager, rendering logic,
// and all required event listeners for the Todo application.
// It assumes the existence of the HTML structure defined in index.html
// and the CSS classes defined in styles.css.

// ----------------------------
// 1. Data Model
// ----------------------------
class Task {
  /**
   * @param {string|number} id - Unique identifier for the task.
   * @param {string} text - The task description.
   * @param {boolean} [completed=false] - Completion state.
   */
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

// ----------------------------
// 2. Task Manager
// ----------------------------
const TaskManager = {
  tasks: [], // array of Task instances (or plain objects with same shape)

  /** Load tasks from localStorage and populate the internal array. */
  loadFromStorage() {
    const raw = localStorage.getItem('todo-tasks');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Ensure each item is an instance of Task (or at least has required props)
        this.tasks = parsed.map(item => new Task(item.id, item.text, item.completed));
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
        this.tasks = [];
      }
    } else {
      this.tasks = [];
    }
  },

  /** Save the current tasks array to localStorage. */
  saveToStorage() {
    try {
      const data = JSON.stringify(this.tasks);
      localStorage.setItem('todo-tasks', data);
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  },

  /** Generate a unique id for a new task. */
  _generateId() {
    // Simple unique id based on timestamp + random component
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /** Add a new task with the given text. */
  addTask(text) {
    if (!text || typeof text !== 'string') return;
    const id = this._generateId();
    const newTask = new Task(id, text.trim(), false);
    this.tasks.push(newTask);
    this.saveToStorage();
    return newTask;
  },

  /** Edit the text of an existing task identified by id. */
  editTask(id, newText) {
    const task = this.tasks.find(t => t.id === id);
    if (task && typeof newText === 'string') {
      task.text = newText.trim();
      this.saveToStorage();
    }
  },

  /** Toggle the completed flag of a task. */
  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToStorage();
    }
  },

  /** Delete a task by id. */
  deleteTask(id) {
    const originalLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== originalLength) {
      this.saveToStorage();
    }
  },

  /** Remove all completed tasks. */
  clearCompleted() {
    const hasCompleted = this.tasks.some(t => t.completed);
    if (hasCompleted) {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.saveToStorage();
    }
  },

  /** Return tasks filtered by the provided criteria. */
  getFilteredTasks(filter = 'all') {
    switch (filter) {
      case 'active':
        return this.tasks.filter(t => !t.completed);
      case 'completed':
        return this.tasks.filter(t => t.completed);
      case 'all':
      default:
        return this.tasks.slice(); // shallow copy
    }
  }
};

// Export for testing/debugging
window.TaskManager = TaskManager;

// ----------------------------
// 3. DOM Rendering
// ----------------------------
let currentFilter = 'all'; // default filter state

/**
 * Render the list of tasks based on the current filter.
 * @param {string} [filter=currentFilter]
 */
function renderTaskList(filter = currentFilter) {
  const listEl = document.getElementById('task-list');
  if (!listEl) return;

  // Clear existing content
  listEl.innerHTML = '';

  const tasksToRender = TaskManager.getFilteredTasks(filter);

  tasksToRender.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    if (task.completed) li.classList.add('completed');

    // Checkbox toggle
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-toggle';
    checkbox.checked = task.completed;
    // Add a small margin via CSS if needed (handled by layout)

    // Text span (click to edit)
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn task-btn'; // reuse generic task-btn styling
    delBtn.textContent = '✕';

    // Assemble li: checkbox, span, delete button
    const leftContainer = document.createElement('div');
    leftContainer.style.display = 'flex';
    leftContainer.style.alignItems = 'center';
    leftContainer.style.gap = '0.5rem';
    leftContainer.appendChild(checkbox);
    leftContainer.appendChild(span);

    li.appendChild(leftContainer);
    li.appendChild(delBtn);

    listEl.appendChild(li);
  });
}

// Export for testing/debugging
window.renderTaskList = renderTaskList;

// ----------------------------
// 4. Event Listeners & Interaction Logic
// ----------------------------
function attachEventListeners() {
  // Add task via button click
  const addBtn = document.getElementById('add-task-btn');
  const inputEl = document.getElementById('new-task-input');

  if (addBtn && inputEl) {
    addBtn.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (text) {
        TaskManager.addTask(text);
        inputEl.value = '';
        renderTaskList();
      }
    });

    // Enter key on input
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addBtn.click();
      }
    });
  }

  // Delegate task list interactions
  const listEl = document.getElementById('task-list');
  if (listEl) {
    // Toggle completed via checkbox
    listEl.addEventListener('change', e => {
      if (e.target && e.target.matches('.task-toggle')) {
        const li = e.target.closest('li');
        const id = li?.dataset?.id;
        if (id) {
          TaskManager.toggleTask(id);
          renderTaskList();
        }
      }
    });

    // Delete task button
    listEl.addEventListener('click', e => {
      if (e.target && e.target.matches('.delete-btn')) {
        const li = e.target.closest('li');
        const id = li?.dataset?.id;
        if (id) {
          TaskManager.deleteTask(id);
          renderTaskList();
        }
      }
    });

    // Double‑click to edit task text
    listEl.addEventListener('dblclick', e => {
      if (e.target && e.target.matches('.task-text')) {
        const span = e.target;
        const li = span.closest('li');
        const id = li?.dataset?.id;
        if (!id) return;

        // Create input element for inline editing
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = span.textContent;
        editInput.style.flex = '1';
        // Replace span with input
        span.replaceWith(editInput);
        editInput.focus();
        editInput.select();

        const finishEdit = () => {
          const newVal = editInput.value.trim();
          if (newVal && newVal !== span.textContent) {
            TaskManager.editTask(id, newVal);
          }
          // Restore span
          editInput.replaceWith(span);
          span.textContent = newVal || span.textContent; // keep old if empty
          renderTaskList();
        };

        // Save on blur
        editInput.addEventListener('blur', finishEdit);
        // Save on Enter key
        editInput.addEventListener('keydown', ev => {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            editInput.blur();
          }
        });
      }
    });
  }

  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (filter) {
        currentFilter = filter;
        // Update active class
        filterButtons.forEach(b => b.classList.toggle('active', b === btn));
        renderTaskList();
      }
    });
  });

  // Clear completed button
  const clearBtn = document.getElementById('clear-completed-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      TaskManager.clearCompleted();
      renderTaskList();
    });
  }
}

// ----------------------------
// 5. Initialization
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  TaskManager.loadFromStorage();
  // Set default active filter button (All)
  const defaultBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (defaultBtn) defaultBtn.classList.add('active');
  renderTaskList();
  attachEventListeners();
});
