import {
    saveTasks,
    loadTasks,
    saveTheme,
    loadTheme
} from "./modules/storage.js";

import {
    validateTask
} from "./modules/validation.js";

import {
    renderTasks,
    updateStats
} from "./modules/render.js";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const emptyState = document.getElementById("emptyState");
const themeBtn = document.getElementById("themeBtn");

let tasks = loadTasks();
let currentFilter = "all";

function refreshUI() {
    renderTasks(
        tasks,
        currentFilter,
        searchInput.value,
        taskList,
        emptyState,
        () => updateStats(
            tasks,
            totalTasks,
            completedTasks,
            pendingTasks
        )
    );
}

taskForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const text = taskInput.value;

    if (!validateTask(text)) return;

    tasks.push({
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
    });

    saveTasks(tasks);

    taskInput.value = "";

    refreshUI();

});

searchInput.addEventListener("input", refreshUI);

document.querySelectorAll(".filter-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        document
            .querySelectorAll(".filter-btn")
            .forEach(button =>
                button.classList.remove("active")
            );

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        refreshUI();

    });

});

taskList.addEventListener("click", (e) => {

    const id = Number(e.target.dataset.id);

    if (!id) return;

    if (e.target.classList.contains("delete-btn")) {

        if (confirm("Delete this task?")) {

            tasks = tasks.filter(task => task.id !== id);

            saveTasks(tasks);

            refreshUI();

        }

    }

    if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        const newText = prompt("Edit Task", task.text);

        if (newText && validateTask(newText)) {

            task.text = newText.trim();

            saveTasks(tasks);

            refreshUI();

        }

    }

});

taskList.addEventListener("change", (e) => {

    if (!e.target.classList.contains("toggle-task")) return;

    const id = Number(e.target.dataset.id);

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });

    saveTasks(tasks);

    refreshUI();

});

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    saveTheme(
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

});

if (loadTheme() === "dark") {

    document.body.classList.add("dark");

}

refreshUI();
