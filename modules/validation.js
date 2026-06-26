// modules/validation.js

export function validateTask(text) {
    const task = text.trim();

    if (task === "") {
        alert("Task cannot be empty!");
        return false;
    }

    if (task.length < 3) {
        alert("Task must contain at least 3 characters.");
        return false;
    }

    if (task.length > 100) {
        alert("Task cannot exceed 100 characters.");
        return false;
    }

    return true;
}
