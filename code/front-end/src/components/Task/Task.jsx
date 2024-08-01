import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tag } from 'antd';
import styles from './Task.module.css';
import editIcon from '../../assets/images/editing.svg';
import deleteIcon from '../../assets/images/delete.svg';
import { ModalEditTask } from '../ModalEditTask/ModalEditTask';
import { ModalDeleteTask } from '../ModalDeleteTask/ModalDeleteTask';
import { updateTaskCompletion } from '../../services/api';

const { Text } = Typography;

const taskPriorityMap = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa"
};

export const Task = ({ id, name, completed: initialCompleted, type, priority, status, dueDate, onTaskUpdated, onTaskDeleted }) => {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isModalEditTaskOpen, setIsModalEditTaskOpen] = useState(false);
  const [isModalDeleteTaskOpen, setIsModalDeleteTaskOpen] = useState(false);

  const task = {
    id: id,
    name: name,
    completed: initialCompleted,
    type: type,
    priority: priority,
    status: status,
    dueDate: dueDate
  }

  const handleEditTask = () => {
    setIsModalEditTaskOpen(true);
  };

  const handleDeleteTask = () => {
    setIsModalDeleteTaskOpen(true);
  };

  const toggleCheckbox = async () => {
    const updatedCompleted = !completed;
    setCompleted(updatedCompleted);
    try {
      await updateTaskCompletion(id, updatedCompleted);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleCloseEditTaskModal = () => {
    setIsModalEditTaskOpen(false);
  };

  const handleCloseDeleteTaskModal = () => {
    setIsModalDeleteTaskOpen(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    onTaskUpdated(updatedTask);
  };

  const handleTaskDeleted = (deletedTask) => {
    onTaskDeleted(deletedTask);
  };

  const isTaskDelayed = (dueDate, completed) => {

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(dueDate);

    if (dueDate && taskDueDate < now && !completed) {
      return true;
    }

    return false;
  };

  return (
    <Card className={styles.taskContainer}>
      <Row align="middle" className={styles.cardRow}>
        <Col span={2} className={styles.checkboxCol}>
          <label>
            <input
              type='checkbox'
              className={`${styles.checkbox} ${completed ? styles.checked : styles.unchecked}`}
              checked={completed}
              onChange={toggleCheckbox}
            />
          </label>
        </Col>
        <Col span={16}>
          <div className={styles.taskDetails}>
            <Text className={styles.taskName} strong>{name}</Text>
            <div className={styles.taskMeta}>
              {dueDate ? <Text className={styles.taskDate}>Concluir até: {new Date(dueDate).toLocaleDateString('pt-br')}</Text> : <Text className={styles.taskDate}> Sem prazo </Text>}
              <Text className={styles.taskPriority}>Prioridade: {taskPriorityMap[priority]}</Text>
              {isTaskDelayed(dueDate, completed) && <Tag style={{fontFamily: "Inter", fontWeight: "600" }} color='error'>Atrasada</Tag>}
            </div>
          </div>
        </Col>
        <Col span={6} className={styles.taskActions}>
          <img src={editIcon} className={styles.editIcon} alt="Ícone de editar" onClick={handleEditTask} />
          {isModalEditTaskOpen && <ModalEditTask task={task} modalOpen={isModalEditTaskOpen} onClose={handleCloseEditTaskModal} onTaskUpdated={handleTaskUpdated} />}
          <img src={deleteIcon} className={styles.deleteIcon} alt="Ícone de excluir" onClick={handleDeleteTask} />
          {isModalDeleteTaskOpen && <ModalDeleteTask task={task} modalOpen={isModalDeleteTaskOpen} onClose={handleCloseDeleteTaskModal} onTaskDeleted={handleTaskDeleted} />}
        </Col>
      </Row>
    </Card>
  );
};
