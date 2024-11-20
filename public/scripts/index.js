function formatDate(isoString) {
    const date = new Date(isoString);

    // Extract individual components
    const day = date.toLocaleString('en-US', { day: '2-digit' });
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });
    const time = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Combine components in the desired format
    return `${day} ${month} ${year}, ${time}`;
}


function renderTaskCards(tasks) {
    const toDoWindow = document.querySelector('.window.to-do');
    const inProgressWindow = document.querySelector('.window.in-progress');
    const completedWindow = document.querySelector('.window.completed');

    toDoWindow.innerHTML = '';
    inProgressWindow.innerHTML = '';
    completedWindow.innerHTML = '';

    tasks.forEach(task => {

        const taskCard = `
            <div class="card">
                <div class="card-content">
                    <div class="card-content-left">
                        <h3 class="task-title">${task.title}</h3>
                        <p class="task-subtitle">${task.description}</p>
                    </div>
                    <div class="card-content-right">
                        <i class="fa-solid fa-pen-to-square" onclick="openUpdatePop('${task._id}', '${task.title}', '${task.description}', '${task.status}')"></i>
                        <i class="fa-solid fa-trash" onclick="deleteTask('${task._id}')"></i>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="status ${task.status.toLowerCase()}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</div>
                    <div class="date">${formatDate(task.updatedAt)}</div>
                </div>
            </div>
        `;

        if (task.status === 'to-do') {
            toDoWindow.innerHTML += taskCard;
        } else if (task.status === 'in-progress') {
            inProgressWindow.innerHTML += taskCard;
        } else if (task.status === 'completed') {
            completedWindow.innerHTML += taskCard;
        }
    });
}



async function getAllTasks() {
    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

    try {
        const response = await fetch('/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Send token for authentication
            },
        });

        if (response.ok) {
            let tasks = await response.json();
            for (const task of tasks) {
                delete task["userId"];
                delete task["__v"];
            }

            return tasks;
        }
    } catch (error) {
        console.error("Error while fetching tasks:", error);
        return []
    }
}


async function loadData() {
    const tasks = await getAllTasks();
    renderTaskCards(tasks);
}

loadData()