const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const clrbtnbox = document.querySelector(".clear-btn-box");

// localStorage
window.onload = function() {
  loadTasks();
};

// onenter
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// taskadd
function addTask() {
  let text = taskInput.value.trim();
  if (!text) {
    alert("Please enter a task!");
    return;
  }

  createTaskElement(text, false, null);
  taskInput.value = "";
  taskInput.focus();
  saveTasks();
}

function createTaskElement(text, done, reminderTime) {
  const li = document.createElement("li");
  li.className = "task-card";

  li.innerHTML = '<div class="task-top">' +
    '<div class="task-left">' +
    '<input type="checkbox" onchange="toggleComplete(this)" ' + (done ? 'checked' : '') + '>' +
    '<span class="' + (done ? 'done' : '') + '">' + text + '</span>' +
    '</div>' +
    '<div class="btn-group">' +
    '<button class="up-btn" onclick="moveUp(this)">Up</button>' +
    '<button class="down-btn" onclick="moveDown(this)">Down</button>' +
    '<button class="reminder-btn" onclick="toggleReminder(this)">Reminder</button>' +
    '<button class="delete-btn" onclick="deleteTask(this)">Delete</button>' +
    '</div>' +
    '</div>' +
    '<div class="reminder-section">' +
    '<input type="datetime-local" onchange="setReminder(this,\'' + text + '\')">' +
    '<button class="close-btn" onclick="this.parentElement.style.display=\'none\'">X</button>' +
    '</div>';

  if (reminderTime) {
    li.setAttribute("data-reminder", reminderTime);
  }

  taskList.appendChild(li);
  updateClearBtn();
}

// task completed
function toggleComplete(cb) {
  let span = cb.closest("li").querySelector("span");
  if (cb.checked) {
    span.classList.add("done");
  } else {
    span.classList.remove("done");
  }
  saveTasks();
}

// task updown
function moveUp(btn) {
  let li = btn.closest("li");
  if (li.previousElementSibling) {
    taskList.insertBefore(li, li.previousElementSibling);
  }
  saveTasks();
}

function moveDown(btn) {
  let li = btn.closest("li");
  if (li.nextElementSibling) {
    taskList.insertBefore(li.nextElementSibling, li);
  }
  saveTasks();
}

// delete
function deleteTask(btn) {
  btn.closest("li").remove();
  saveTasks();
  updateClearBtn();
}

// clearall
function clearAll() {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateClearBtn();
}

// reminder
function toggleReminder(btn) {
  let r = btn.closest("li").querySelector(".reminder-section");
  if (r.style.display === "flex") {
    r.style.display = "none";
  } else {
    r.style.display = "flex";
  }
}

// set reminder
function setReminder(input, text) {
  let dt = input.value;
  if (!dt) {
    return;
  }

  let delay = new Date(dt) - Date.now();
  if (delay <= 0) {
    alert("Choose future time");
    input.value = "";
    return;
  }

  input.closest("li").setAttribute("data-reminder", dt);

  setTimeout(function() {
    alert("Reminder for : " + text);
  }, delay);

  input.parentElement.style.display = "none";
  saveTasks();
}

// saingtasks2localStorage
function saveTasks() {
  let tasks = [];
  let lis = taskList.querySelectorAll("li");
  for (let i = 0; i < lis.length; i++) {
    let li = lis[i];
    tasks.push({
      text: li.querySelector("span").textContent,
      done: li.querySelector("input[type='checkbox']").checked,
      reminder: li.getAttribute("data-reminder") || null
    });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// load tasks from localStorage
function loadTasks() {
  let saved = JSON.parse(localStorage.getItem("tasks")) || [];
  for (let i = 0; i < saved.length; i++) {
    let t = saved[i];
    createTaskElement(t.text, t.done, t.reminder);
  }
}

// clearbutton
function updateClearBtn() {
  if (taskList.children.length > 0) {
    clrbtnbox.style.display = "block";
  } else {
    clrbtnbox.style.display = "none";
  }
}

updateClearBtn();
