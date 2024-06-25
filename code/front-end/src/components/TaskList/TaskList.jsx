// src/components/TaskList/TaskList.jsx
import { useState, useEffect } from 'react';
import { Card, List, Typography } from 'antd';
import { Task } from '../Task/Task';
import styles from './TaskList.module.css';
import { listAllByTaskList } from '../../services/api';
import AddButton from '../AddButton/AddButton';
import { ModalAddTask } from '../../components/ModalAddTask/ModalAddTask';
import editIcon from '../../assets/images/editing.svg';
import deleteIcon from '../../assets/images/delete.svg';
import { ModalEditTaskList } from '../ModalEditTaskList/ModalEditTaskList';
import { ModalDeleteTaskList } from '../ModalDeleteTaskList/ModalDeleteTaskList';

const { Title, Text } = Typography;

export const TaskList = ({ taskListId, title, description }) => {
  const [tasks, setTasks] = useState([]);
  const [isModalAddTaskOpen, setIsModalAddTaskOpen] = useState(false);
  const [isModalEditTaskListOpen, setIsModalEditTaskListOpen] = useState(false);
  const [isModalDeleteTaskListOpen, setIsModalDeleteTaskListOpen] = useState(false);

  const taskList = {
    id: taskListId,
    name: title,
    description: description
  }

  useEffect(() => {
    const getAllTasksByTaskList = async (taskListId) => {
      const response = await listAllByTaskList(taskListId);
      if (response) {
        console.log(response);
        setTasks(response);
      }
    };
    console.log(taskListId);
    getAllTasksByTaskList(taskListId);
  }, [taskListId]);

  const handleAddTask = () => {
    setIsModalAddTaskOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsModalAddTaskOpen(false);
  };

  const handleEditTaskList = () => {
    setIsModalEditTaskListOpen(true);
  };

  const handleCloseEditTaskListModal = () => {
    setIsModalEditTaskListOpen(false);
  };

  const handleDeleteTaskList = () => {
    setIsModalDeleteTaskListOpen(true);
  };

  const handleCloseDeleteTaskListModal = () => {
    setIsModalDeleteTaskListOpen(false);
  };

  return (
    <div className={styles.taskListContainer}>
      <Card
        className={styles.cardContainer}
        title={
          <div>
            <Title level={2} >{title}</Title>
            <Text>{description}</Text>
          </div>
        } extra={
          <div>
            <img src={editIcon} alt="Editar lista de tarefas" onClick={handleEditTaskList}/>
            {isModalEditTaskListOpen && <ModalEditTaskList taskList={taskList} modalOpen={true} onClose={handleCloseEditTaskListModal} />}
            <img src={deleteIcon} alt="Excluir lista de tarefas" onClick={handleDeleteTaskList} />
            {isModalDeleteTaskListOpen && <ModalDeleteTaskList taskList={taskList} modalOpen={true} onClose={handleCloseDeleteTaskListModal} />}
          </div>
        }>
        <List
          dataSource={tasks}
          renderItem={task => (
            <List.Item key={task.id}>
              <Task {...task} />
            </List.Item>
          )}
        />
        <AddButton label={"Nova Tarefa"} className={styles.addTaskButton} onClick={handleAddTask} />
        {isModalAddTaskOpen && <ModalAddTask taskListId={taskListId} modalOpen={true} onClose={handleCloseAddTaskModal} />}
      </Card>
    </div>
  );
};
