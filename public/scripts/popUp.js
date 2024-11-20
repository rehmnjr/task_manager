function popUp(actionType, task = {}) {
    const { title = '', description = '', status = 'to-do' } = task;

    return `
        <div class="form">
            <div class="form-header">
                <h2>${actionType} Task</h2>
                <i id="close-popup" class="fa-solid fa-close"></i>
            </div>
            <div>
                <div class="input-wrapper">
                    <input id="task-title" class="input" type="text" value="${title}" placeholder=" " required />
                    <p class="placeholder">Task Name</p>
                </div>
                <div class="input-wrapper">
                    <textarea id="task-desc" class="input" rows="4" placeholder=" " required>${description}</textarea>
                    <p class="placeholder">Description</p>
                </div>
                <select id="task-status">
                    <option value="to-do" ${status === 'to-do' ? 'selected' : ''}>To-Do</option>
                    <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>In-Progress</option>
                    <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button id="task-action">${actionType} Task</button>
            </div>
        </div>
    `;
}

function removeFun(text){

    while(text[text.length-1] === "'"){
        text = text.substring(0,text.length-2)
     }
     return text
}

function setupPopUpEvents(actionType, taskId = null) {
    const closeButton = document.getElementById('close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }

    const actionButton = document.getElementById('task-action');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            let title = document.getElementById('task-title').value;
            let description = document.getElementById('task-desc').value;
            const status = document.getElementById('task-status').value;

            title = removeFun(title)
            description = removeFun(description)

            if (actionType === 'Add') {
                createTask({ title, description, status });
            } else if (actionType === 'Update') {
                updateTask(taskId, { title, description, status });
            }
        });
    }
}

async function createTask(task) {
    try {

        if (!task.title || !task.description || !task.status) {
            alert('Title, Description, and Status are required!');
            return
        }

        const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

        const response = await fetch('/api/tasks/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${authToken}` },
            body: JSON.stringify(task),
        });

        // Handle the response from the backend
        const responseData = await response.json();
        if (response.ok) {
            alert('Task created successfully!');
            loadData(); // Reload the tasks list
            closePopup(); // Close the popup after successful update
        } else {
            alert(`Error: ${responseData.message}`);
        }

    } catch (error) {
        console.error('Error creating task:', error);
        alert('An error occurred while creating the task.');
    }

}

async function updateTask(taskId, task) {

    if (!taskId || !task.title || !task.description || !task.status) {
        alert('TaskId, Title, Description, and Status are required!');
        return
    }

    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

    try {
        // Make the PUT request to update the task
        const response = await fetch(`/api/tasks/update/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Send token for authentication
            },
            body: JSON.stringify(task), // Send updated task data in the request body
        });

        // Handle the response from the backend
        const responseData = await response.json();
        if (response.ok) {
            alert('Task updated successfully!');
            loadData() // Reload the tasks list after successful update
            closePopup(); // Close the popup after successful update
        } else {
            alert(`Error: ${responseData.message}`);
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('An error occurred while updating the task.');
    }
}

async function deleteTask(taskId) {
    if (!taskId) {
        alert('TaskId is required!');
        return
    }

    const authToken = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
    try {
        // Make the DELETE request to delete the task
        const response = await fetch(`/api/tasks/delete/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Send token for authentication
            }
        });

        // Handle the response from the backend
        const responseData = await response.json();
        if (response.ok) {
            alert('Task deleted successfully!');
            loadData()
        } else {
            alert(`Error: ${responseData.message}`);
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('An error occurred while updating the task.');
    }


}

function closePopup() {
    const popup = document.getElementById('floating-window');
    if (popup) {
        popup.style.display = 'none';
    }
}


function openAddTaskPop() {
    const floatingWindow = document.querySelector('#floating-window');
    floatingWindow.innerHTML = popUp('Add'); // Open the popup with "Add" action
    setupPopUpEvents('Add'); // Set up the event listener for adding a new task
    floatingWindow.style.display = 'block'; // Display the popup
}

function openUpdatePop(taskId, title, description, status) {

    console.log("openUpdatePop called")
    const floatingWindow = document.querySelector('#floating-window');
    floatingWindow.innerHTML = popUp('Update', { title, description, status });
    setupPopUpEvents('Update', taskId); // Set up the event listener for updating the task
    floatingWindow.style.display = 'block'; // Display the popup
}
