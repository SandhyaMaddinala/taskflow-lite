// modules/render.js

export function renderTasks(
    tasks,
    currentFilter,
    searchText,
    taskList,
    emptyState,
    updateStats
) {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
    );

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
                    data-id="${task.id}"
                    class="toggle-task"
                >

                <div>

                    <span>${task.text}</span>

                    <small>
                        ${task.createdAt}
                    </small>

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    data-id="${task.id}">
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}">
                    🗑️
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateStats(tasks);

}
export function updateStats(
    tasks,
    totalTasks,
    completedTasks,
    pendingTasks
){

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent =
        total - completed;

}
