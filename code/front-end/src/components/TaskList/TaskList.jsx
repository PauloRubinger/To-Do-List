// src/components/TaskList/TaskList.jsx
import { useState, useEffect } from 'react';
import { Card, List, Typography } from 'antd';
import { Task } from '../Task/Task';
import styles from './TaskList.module.css';
import { listAllByTaskList } from '../../services/api';

const { Title, Text } = Typography;

export const TaskList = ({ taskListId, title, description }) => {
  const [tasks, setTasks] = useState([]);

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
    </Card>
  </div>
  );
};
