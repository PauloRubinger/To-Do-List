import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const listAllTaskLists = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/taskList/listAll`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting task lists: ", error);
        throw error;
    }
};

export const getTaskListById = async (id) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/taskList/get/${id}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error getting task list: ", error);
        throw error;
    }
};

export const addTaskList = async (taskList) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/taskList/add`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: taskList
        });
        return response;
    } catch (error) {
        console.error("Error adding task list: ", error);
        throw(error);
    }
};

export const editTaskList = async (taskListId, taskList) => {
    try {
        const response = await axios({
            method: 'put',
            url: `${BASE_URL}/taskList/edit/${taskListId}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: taskList
        });
        return response;
    } catch (error) {
        console.error("Error editing task list: ", error);
        throw error;
    }
};

export const deleteTaskList = async (taskListId) => {
    try {
        const response = await axios({
            method: 'delete',
            url: `${BASE_URL}/taskList/delete/${taskListId}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error deleting task list: ", error);
        throw error;
    }
};