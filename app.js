const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const emptyState = document.getElementById("emptyState");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Create Task
function createTask(text) {
    return {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
    };
}


// Add Task
taskForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Task cannot be empty!");
        return;
    }

    tasks.push(createTask(text));

    saveTasks();
    renderTasks();

    taskInput.value = "";
});


// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Filter
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Search
    const searchText = searchInput.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    // Empty State
    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `
            <div class="task-left">
                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span>${task.text}</span>
            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑️
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}


// Toggle Complete
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Delete Task
function deleteTask(id) {

    const confirmDelete =
        confirm("Delete this task?");

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// Edit Task
function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    const newText = prompt(
        "Edit Task:",
        task.text
    );

    if (
        newText === null ||
        newText.trim() === ""
    ) {
        return;
    }

    task.text = newText.trim();

    saveTasks();
    renderTasks();
}


// Statistics
function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}


// Search
searchInput.addEventListener(
    "input",
    renderTasks
);


// Filter Buttons
document
.querySelectorAll(".filter-btn")
.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(".filter-btn")
            .forEach(button =>
                button.classList.remove("active")
            );

            btn.classList.add("active");

            currentFilter =
                btn.dataset.filter;

            renderTasks();
        }
    );
});


// Dark Mode
themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );
    }
);


// Load Theme
if (
    localStorage.getItem("theme")
    === "dark"
) {
    document.body.classList.add("dark");
}


// Initial Render
renderTasks();