import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const listAllTasks = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/task/listAll`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao obter tarefas: ", error);
        throw error;
    }
};

export const listAllByTaskList = async (taskListId) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/task/listAllByTaskList?taskListId=${taskListId}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao obter as tarefas dessa lista de tarefas: ", error);
        throw error;
    }
};

export const getTaskById = async (taskListId) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/task/listAllByTaskList?taskListId=${taskListId}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao obter a tarefa pelo id: ", error);
        throw error;
    }
};

export const addTask = async (taskListId, task) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/task/add?taskListId=${taskListId}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: task
        });
        return response;
    } catch (error) {
        console.error("Erro ao adicionar tarefa: ", error);
        throw error;
    }
};

export const editTask = async (taskId, task) => {
    try {
        const response = await axios({
            method: 'put',
            url: `${BASE_URL}/task/edit/${taskId}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: task
        });
        return response;
    } catch (error) {
        console.error("Erro ao editar tarefa: ", error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await axios({
            method: 'delete',
            url: `${BASE_URL}/task/delete/${taskId}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao excluir tarefa: ", error);
        throw error;
    }
};

export const updateTaskCompletion = async (taskId, completed) => {
    try {
        const response = await axios({
            method: 'patch',
            url: `${BASE_URL}/task/${taskId}?completed=${completed}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Erro ao atualizar o status de conclusão da tarefa: ", error);
        throw error;
    }
};