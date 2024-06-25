// src/components/TaskList/TaskList.jsx
import { useState, useEffect } from 'react';
import { Card, List, Typography } from 'antd';
import { Task } from '../Task/Task';
import styles from './TaskList.module.css';
import { listAllByTaskList } from '../../services/api';
import AddButton from '../AddButton/AddButton';
import { ModalAddTask } from '../../components/ModalAddTask/ModalAddTask';

const { Title, Text } = Typography;

export const TaskList = ({ taskListId, title, description }) => {
  const [tasks, setTasks] = useState([]);
  const [isModalAddTaskOpen, setIsModalAddTaskOpen] = useState(false);

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

  return (
    <div className={styles.taskListContainer}>
    <Card className={styles.cardContainer}>
      <div>
        <Title level={2}>{title}</Title>
        <Text>{description}</Text>
      </div>
      <List
        dataSource={tasks}
        renderItem={task => (
          <List.Item key={task.id}>
            <Task {...task} />
          </List.Item>
        )}
      />
      <AddButton label={"Nova Tarefa"} className={styles.addTaskButton} onClick={handleAddTask}/>
      {isModalAddTaskOpen && <ModalAddTask modalOpen={true} onClose={handleCloseAddTaskModal} />}
    </Card>
  </div>
  );
};
