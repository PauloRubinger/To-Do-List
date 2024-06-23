const BASE_URL = "http://localhost:8080/api";

// TaskList requests
export const listAllTaskLists = async () => {
    try {
        const response = await fetch(`${BASE_URL}/taskList/listAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Erro ao obter as listas de tarefas: ", error);
    }
};

export const getTaskListById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/taskList/get/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Erro ao obter a lista de tarefas: ", error);
    }
};

export const addTaskList = async (taskList) => {
    try {
        const response = await fetch(`${BASE_URL}/taskList/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskList)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao adicionar a lista de tarefas: ", error);
    }
};

export const editTaskList = async (taskList) => {
    try {
        const response = await fetch(`${BASE_URL}/taskList/edit/${taskList.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskList)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao editar a lista de tarefas: ", error);
    }
};

export const deleteTaskList = async (taskList) => {
    try {
        const response = await fetch(`${BASE_URL}/taskList/delete/${taskList.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao excluir a lista de tarefas: ", error);
    }
};

// Task requests
export const listAllTasks = async () => {
    try {
        const response = await fetch(`${BASE_URL}/task/listAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Erro ao obter tarefas: ", error);
    }
};

export const getTaskById = async (taskId) => {
    try {
        const response = await fetch(`${BASE_URL}/task/get/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Erro ao obter a tarefa pelo id: ", error);
    }
};

export const addTask = async (taskListId, task) => {
    try {
        const response = await fetch(`${BASE_URL}/task/add?taskListId=${taskListId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao adicionar tarefa: ", error);
    }
};

export const editTask = async (task) => {
    try {
        const response = await fetch(`${BASE_URL}/task/edit/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao editar tarefa: ", error);
    }
};

export const deleteTask = async (task) => {
    try {
        const response = await fetch(`${BASE_URL}/task/delete/${task.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao excluir tarefa: ", error);
    }
};