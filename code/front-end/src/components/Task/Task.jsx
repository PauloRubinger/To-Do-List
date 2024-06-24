// src/components/Task/Task.jsx
import React from 'react';
import { Checkbox, Card, Typography, Row, Col } from 'antd';
import styles from './Task.module.css';

const { Text } = Typography;

export const Task = ({ id, name, completed, dueDate, priority }) => {
  return (
    <Card className={styles.taskContainer}>
      <Row>
        <Col span={2}>
          <Checkbox checked={completed} readOnly />
        </Col>
        <Col>
          <div className={styles.taskDetails}>
            <Text strong>{name}</Text>
            <Text>Concluir até: {new Date(dueDate).toLocaleDateString()}</Text>
            <Text>Prioridade: {priority}</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};
