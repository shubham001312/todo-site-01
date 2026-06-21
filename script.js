/* ==========================================
   DATA
========================================== */

const WEEKLY_TASKS = {
  1: [
    'Variables and Data Types',
    'Operators',
    'Input/Output',
    'Conditional Statements',
    'Loops',
    'Functions',
    'Basic Pattern Problems',
    'Mini Quiz'
  ],
  2: [
    'Arrays',
    '2D Arrays',
    'Strings',
    'Pointers',
    'Pointer Arithmetic',
    'Functions with Pointers',
    'Recursion',
    'Practice Problems'
  ],
  3: [
    'Structures',
    'Array of Structures',
    'Dynamic Memory Allocation',
    'File Handling',
    'Header Files',
    'Student Management System',
    'Library Management System',
    'Final Revision'
  ]
};

const TOTAL_TASKS = Object.values(WEEKLY_TASKS).flat().length;

const PROJECTS = [
  {
    id: 1,
    title: 'Student Management System',
    difficulty: 'Intermediate',
    concepts: 'Structures · Arrays · Functions · File Handling · Dynamic Memory',
    desc: 'Manage student records — add, display, search, and delete entries with persistent storage.'
  },
  {
    id: 2,
    title: 'Library Management System',
    difficulty: 'Intermediate',
    concepts: 'Structures · Strings · File I/O · Pointers · Search Algorithms',
    desc: 'Manage a library catalog — issue, return books, track members, and search by title or author.'
  },
  {
    id: 3,
    title: 'Simple Banking System',
    difficulty: 'Advanced',
    concepts: 'Structures · Functions · File Handling · Menu-Driven Interface · Pointers',
    desc: 'Simulate a banking system — create accounts, deposit, withdraw, check balance, and view history.'
  }
];

const TOTAL_PROJECTS = PROJECTS.length;

const FOCUS_MESSAGES = [
  'Start your journey — every expert was once a beginner.',
  'Consistency beats intensity. Show up every day.',
  'Debug your mind before you debug your code.',
  'Small progress daily adds up to massive results.',
  'The only way to learn C is to write C. Keep typing.',
  'When stuck, break it down. When tired, break through.',
  "You don't need to be perfect — you just need to begin.",
  'Code is like poetry — every line has meaning.',
  'Mistakes are just compiler errors in the school of life.',
  'Trust the process. One concept at a time.',
  "Pointers are not scary — they're just addresses to success.",
  "Your future self will thank you for today's effort.",
  'Recursion: trust the smaller version of yourself.',
  'Memory allocated today yields wisdom tomorrow.',
  'Structures hold data together — just like routines hold goals.',
  'File handling teaches persistence — in code and in life.',
  "You've come this far. Don't stop now.",
  'Projects turn knowledge into skills. Build something!',
  'The best debugger is a clear mind. Take a breath.',
  'You are 80% of the way — finish strong!',
  'Congratulations! You have mastered C programming!'
];

const DAILY_TOPICS = [
  'Welcome & Setup',
  'Variables & Data Types',
  'Operators & Expressions',
  'Input / Output Functions',
  'Conditional Statements',
  'Loops (for, while, do-while)',
  'Functions & Scope',
  'Basic Pattern Problems',
  'Arrays & 2D Arrays',
  'Strings & String Functions',
  'Pointers Fundamentals',
  'Pointer Arithmetic',
  'Functions with Pointers',
  'Recursion Concepts',
  'Practice & Revision',
  'Structures & Array of Structures',
  'Dynamic Memory Allocation',
  'File Handling (read/write)',
  'Header Files & Modular Programming',
  'Build: Student Management System',
  'Build: Library & Banking Systems'
];

const VALID_PAGES = ['dashboard', 'week1', 'week2', 'week3', 'projects', 'notes', 'readiness'];

/* ==========================================
   STATE
========================================== */

let completedTasks = new Set();
let completedProjects = new Set();
let notes = '';
let currentPage = 'dashboard';
let currentTheme = 'dark';

/* ==========================================
   LOCAL STORAGE
========================================== */

function loadState() {
  try {
    const raw = localStorage.getItem('cMasteryTracker');
    if (raw) {
      const data = JSON.parse(raw);
      completedTasks = new Set(data.tasks || []);
      completedProjects = new Set(data.projects || []);
      notes = data.notes || '';
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem('cMasteryTracker', JSON.stringify({
      tasks: [...completedTasks],
      projects: [...completedProjects],
      notes: notes
    }));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

/* ==========================================
   THEME
========================================== */

function updateThemeUI(theme) {
  const icon = $('theme-icon');
  const label = $('theme-label');
  if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
  if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function loadTheme() {
  const saved = localStorage.getItem('cMasteryTheme');
  if (saved === 'light' || saved === 'dark') {
    // User has manually chosen — apply and persist
    applyTheme(saved);
  } else {
    // No manual choice — use system preference without saving to localStorage
    currentTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeUI(currentTheme);
  }
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cMasteryTheme', theme);
  updateThemeUI(theme);
}

function toggleTheme() {
  const next = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

/* ==========================================
   DOM HELPER
========================================== */

const $ = (id) => document.getElementById(id);

/* ==========================================
   NAVIGATION
========================================== */

function navigateTo(page, updateHash) {
  if (!VALID_PAGES.includes(page)) page = 'dashboard';

  currentPage = page;

  // Switch pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = $('page-' + page);
  if (target) {
    // Force reflow to restart animation
    void target.offsetWidth;
    target.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-page="' + page + '"]');
  if (activeNav) activeNav.classList.add('active');

  // Hash
  if (updateHash !== false) {
    window.location.hash = page;
  }

  // Close mobile sidebar
  closeSidebar();

  // Scroll to top
  window.scrollTo(0, 0);
}

function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  // Hash navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (VALID_PAGES.includes(hash) && hash !== currentPage) {
      navigateTo(hash, false);
    }
  });
}

/* ==========================================
   MOBILE SIDEBAR
========================================== */

function openSidebar() {
  $('sidebar').classList.add('open');
  $('sidebar-overlay').classList.add('active');
  $('menu-toggle').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebar-overlay').classList.remove('active');
  $('menu-toggle').classList.remove('open');
  document.body.style.overflow = '';
}

function initMobileMenu() {
  $('menu-toggle').addEventListener('click', () => {
    const isOpen = $('sidebar').classList.contains('open');
    isOpen ? closeSidebar() : openSidebar();
  });

  $('sidebar-overlay').addEventListener('click', closeSidebar);
}

/* ==========================================
   RENDER TASKS
========================================== */

function renderTasks() {
  Object.entries(WEEKLY_TASKS).forEach(([week, tasks]) => {
    const list = $('week-' + week + '-tasks');
    if (!list) return;

    list.innerHTML = '';

    tasks.forEach((task, index) => {
      const taskId = week + '-' + index;
      const isDone = completedTasks.has(taskId);

      const li = document.createElement('li');
      li.className = 'task-item' + (isDone ? ' completed' : '');

      li.innerHTML =
        '<span class="task-num">' + (index + 1) + '</span>' +
        '<label class="cb-wrap">' +
          '<input type="checkbox" data-task="' + taskId + '"' + (isDone ? ' checked' : '') + ' />' +
          '<span class="cb"></span>' +
        '</label>' +
        '<span class="task-text">' + task + '</span>';

      // Click entire row to toggle
      li.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        const cb = li.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      });

      list.appendChild(li);
    });

    // Update week badge
    const badge = $('week-' + week + '-badge');
    const linear = $('week-' + week + '-linear');
    const done = tasks.filter((_, i) => completedTasks.has(week + '-' + i)).length;

    if (badge) badge.textContent = done + ' / ' + tasks.length;
    if (linear) linear.style.width = (tasks.length > 0 ? (done / tasks.length) * 100 : 0) + '%';
  });

  // Attach checkbox events
  document.querySelectorAll('.task-check, .task-item input[type="checkbox"]').forEach(cb => {
    cb.removeEventListener('change', handleTaskToggle);
    cb.addEventListener('change', handleTaskToggle);
  });
}

/* ==========================================
   HANDLE TASK TOGGLE
========================================== */

function handleTaskToggle(e) {
  const taskId = e.target.dataset.task;
  if (!taskId) return;

  if (e.target.checked) {
    completedTasks.add(taskId);
  } else {
    completedTasks.delete(taskId);
  }

  saveState();
  renderTasks();
  updateDashboard();
  updateReadiness();
}

/* ==========================================
   RENDER PROJECTS
========================================== */

function renderProjects() {
  const grid = $('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';

  PROJECTS.forEach(project => {
    const isDone = completedProjects.has(String(project.id));

    const card = document.createElement('div');
    card.className = 'project-card glass';
    card.dataset.project = project.id;

    card.innerHTML =
      '<div class="project-top">' +
        '<h3>' + project.title + '</h3>' +
        '<span class="difficulty' + (project.difficulty === 'Advanced' ? ' advanced' : '') + '">' + project.difficulty + '</span>' +
      '</div>' +
      '<p class="project-concepts">' + project.concepts + '</p>' +
      '<p class="project-desc">' + project.desc + '</p>' +
      '<label class="cb-wrap">' +
        '<input type="checkbox" class="project-check" data-project="' + project.id + '"' + (isDone ? ' checked' : '') + ' />' +
        '<span class="cb"></span>' +
        '<span>Mark complete</span>' +
      '</label>' +
      '<small class="project-reminder">Don\'t forget to push to GitHub →</small>';

    // Click card row to toggle
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.closest('.cb-wrap')) return;
      const cb = card.querySelector('.project-check');
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event('change'));
    });

    grid.appendChild(card);
  });

  // Attach events
  document.querySelectorAll('.project-check').forEach(cb => {
    cb.addEventListener('change', function () {
      if (this.checked) {
        completedProjects.add(this.dataset.project);
      } else {
        completedProjects.delete(this.dataset.project);
      }
      saveState();
      updateDashboard();
      updateReadiness();
    });
  });
}

/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateDashboard() {
  const completed = completedTasks.size;
  const pending = Math.max(0, TOTAL_TASKS - completed);
  const pct = TOTAL_TASKS > 0 ? Math.round((completed / TOTAL_TASKS) * 100) : 0;

  $('total-tasks').textContent = TOTAL_TASKS;
  $('completed-tasks').textContent = completed;
  $('pending-tasks').textContent = pending;
  $('progress-percentage').textContent = pct + '%';
  $('linear-progress-fill').style.width = pct + '%';

  // Circular progress
  const circumference = 534.07;
  const offset = circumference - (pct / 100) * circumference;
  const ring = $('progress-ring-fill');
  if (ring) ring.style.strokeDashoffset = offset;
}

/* ==========================================
   UPDATE READINESS SCORE
========================================== */

function updateReadiness() {
  const taskPct = TOTAL_TASKS > 0 ? completedTasks.size / TOTAL_TASKS : 0;
  const projectPct = TOTAL_PROJECTS > 0 ? completedProjects.size / TOTAL_PROJECTS : 0;
  const score = Math.round(taskPct * 70 + projectPct * 30);

  $('readiness-score').textContent = score;
  $('readiness-bar-fill').style.width = score + '%';
  $('task-score').textContent = Math.round(taskPct * 100) + '%';
  $('project-score').textContent = Math.round(projectPct * 100) + '%';

  let message;
  if (score === 0) {
    message = 'Start tracking your progress to see your readiness score.';
  } else if (score < 30) {
    message = 'Just getting started — every line of code counts! Keep going.';
  } else if (score < 50) {
    message = "Building momentum — you're laying a strong foundation.";
  } else if (score < 70) {
    message = 'Halfway there! Consistency is key to mastery.';
  } else if (score < 90) {
    message = 'Almost there! Push through the final concepts.';
  } else if (score < 100) {
    message = 'So close! Finish those last tasks to reach full readiness.';
  } else {
    message = 'You are fully ready! Go build something amazing in C.';
  }
  $('readiness-message').textContent = message;
}

/* ==========================================
   DAILY FOCUS
========================================== */

function updateDailyFocus() {
  // Use stored start date or set it now
  let startStr = localStorage.getItem('cMasteryStartDate');
  if (!startStr) {
    startStr = new Date().toISOString();
    localStorage.setItem('cMasteryStartDate', startStr);
  }

  const start = new Date(startStr);
  const now = new Date();
  const diffMs = now - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dayIndex = Math.min(diffDays, DAILY_TOPICS.length - 1);
  const week = Math.min(3, Math.floor(dayIndex / 7) + 1);
  const dayInWeek = (dayIndex % 7) + 1;

  $('focus-title').textContent = DAILY_TOPICS[dayIndex];
  $('focus-message').textContent = FOCUS_MESSAGES[dayIndex];
  $('focus-week-day').textContent = 'Week ' + week + ' · Day ' + dayInWeek;
}

/* ==========================================
   NOTES
========================================== */

function initNotes() {
  const editor = $('notes-editor');
  const saveBtn = $('save-notes-btn');
  const clearBtn = $('clear-notes-btn');
  const status = $('notes-status');

  // Load saved notes
  editor.value = notes;

  function showStatus(msg) {
    status.textContent = msg;
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 2000);
  }

  saveBtn.addEventListener('click', () => {
    notes = editor.value;
    saveState();
    showStatus('Notes saved');
  });

  clearBtn.addEventListener('click', () => {
    editor.value = '';
    notes = '';
    saveState();
    showStatus('Notes cleared');
  });

  // Auto-save on typing (debounced)
  let debounce;
  editor.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      notes = editor.value;
      saveState();
    }, 800);
  });
}

/* ==========================================
   RESET PROGRESS
========================================== */

function initReset() {
  $('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;

    completedTasks.clear();
    completedProjects.clear();
    notes = '';
    localStorage.removeItem('cMasteryTracker');
    localStorage.removeItem('cMasteryStartDate');

    // Re-init
    $('notes-editor').value = '';
    renderTasks();
    renderProjects();
    updateDashboard();
    updateReadiness();
    updateDailyFocus();
  });
}

/* ==========================================
   THEME INIT
========================================== */

function initTheme() {
  // Load saved or system preference
  loadTheme();

  // Toggle button
  $('theme-toggle').addEventListener('click', toggleTheme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually chosen
    if (!localStorage.getItem('cMasteryTheme')) {
      applyTheme(e.matches ? 'light' : 'dark', true);
    }
  });
}

/* ==========================================
   INIT
========================================== */

function init() {
  loadState();

  // Determine initial page from hash
  const hash = window.location.hash.slice(1);
  currentPage = VALID_PAGES.includes(hash) ? hash : 'dashboard';

  // Render everything
  renderTasks();
  renderProjects();
  updateDashboard();
  updateReadiness();
  updateDailyFocus();
  initNotes();
  initNavigation();
  initMobileMenu();
  initReset();
  initTheme();

  // Navigate to initial page (don't update hash since it's already set)
  navigateTo(currentPage, false);
}

document.addEventListener('DOMContentLoaded', init);
