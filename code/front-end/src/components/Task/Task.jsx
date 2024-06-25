import React, { useState } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import styles from './Task.module.css';
import editIcon from '../../assets/images/editing.svg';
import deleteIcon from '../../assets/images/delete.svg';

const { Text } = Typography;

const taskPriorityMap = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa"
};

export const Task = ({ id, name, completed: initialCompleted, dueDate, priority }) => {
  const [completed, setCompleted] = useState(initialCompleted);

  const handleEditTask = () => {

  };

  const handleDeleteTask = () => {
    
  };

  const toggleCheckbox = () => {
    setCompleted(!completed);
  };

  return (
    <Card className={styles.taskContainer}>
      <Row>
        <Col span={2}>
          <label>
            <input
              type='checkbox'
              className={`${styles.checkbox} ${completed ? styles.checked : styles.unchecked}`}
              checked={completed}
              onChange={toggleCheckbox}
            />
          </label>
        </Col>
        <Col span={18}>
          <div className={styles.taskDetails}>
            <Text strong>{name}</Text>
            {dueDate ? <Text>Concluir até: {new Date(dueDate).toLocaleDateString()}</Text> : null}
            <Text>Prioridade: {taskPriorityMap[priority]}</Text>
          </div>
        </Col>
        <Col span={4} className={styles.taskActions}>
          <img src={editIcon} alt="Ícone de editar" onClick={handleEditTask} />
          <img src={deleteIcon} alt="Ícone de excluir" onClick={handleDeleteTask} />
        </Col>
      </Row>
    </Card>
  );
};
