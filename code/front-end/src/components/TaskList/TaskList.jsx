import { useState, useEffect } from "react";
import {
  Card,
  List,
  Typography,
  Row,
  Col,
  Select,
  ConfigProvider,
  Empty,
} from "antd";
import { Task } from "../Task/Task";
import { listAllByTaskList } from "../../services/task-service";
import { ModalAddTask } from "../../components/ModalAddTask/ModalAddTask";
import { ModalEditTaskList } from "../ModalEditTaskList/ModalEditTaskList";
import { ModalDeleteTaskList } from "../ModalDeleteTaskList/ModalDeleteTaskList";
import { FilterFilled } from "@ant-design/icons";
import AddButton from "../AddButton/AddButton";
import editIcon from "../../assets/images/editing.svg";
import deleteIcon from "../../assets/images/delete.svg";
import styles from "./TaskList.module.css";

const { Title } = Typography;

export const TaskList = ({
  taskListId,
  title,
  onTaskListUpdated,
  onTaskListDeleted,
}) => {
  const [tasks, setTasks] = useState([]);
  const [isModalAddTaskOpen, setIsModalAddTaskOpen] = useState(false);
  const [isModalEditTaskListOpen, setIsModalEditTaskListOpen] = useState(false);
  const [isModalDeleteTaskListOpen, setIsModalDeleteTaskListOpen] = useState(false);
  const [filter, setFilter] = useState(null);

  const taskList = {
    id: taskListId,
    name: title,
  };

  useEffect(() => {
    fetchTasks(taskListId);
  }, [taskListId]);

  const fetchTasks = async (taskListId) => {
    const response = await listAllByTaskList(taskListId);
    if (response && response.data) {
      setTasks(response.data);
    }
  };

  const handleAddTask = () => {
    setIsModalAddTaskOpen(true);
  };

  const applyCurrentFilter = (items) => {
    if (!filter) {
      return items;
    }

    const sortedItems = [...items];

    if (filter === "dueDate") {
      return sortedItems.sort((a, b) => {
        const hasDueDateA = !!a.dueDate;
        const hasDueDateB = !!b.dueDate;

        if (!hasDueDateA && !hasDueDateB) return 0;
        if (!hasDueDateA) return 1;
        if (!hasDueDateB) return -1;

        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    if (filter === "priority") {
      return sortedItems.sort((a, b) => {
        const priorityA = calculatePriority(a.priority);
        const priorityB = calculatePriority(b.priority);
        return priorityA - priorityB;
      });
    }

    return sortedItems;
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => applyCurrentFilter([...prevTasks, newTask]));
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      applyCurrentFilter(
        prevTasks.map((prevTask) =>
          prevTask.id === updatedTask.id ? updatedTask : prevTask
        )
      )
    );
  };

  const handleTaskDeleted = (deletedTask) => {
    setTasks((prevTasks) =>
      prevTasks.filter((prevTask) => prevTask.id !== deletedTask.id)
    );
  };

  const handleTaskCompletionToggled = (taskId, completed) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.id === taskId ? { ...prevTask, completed } : prevTask
      )
    );
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

  const handleTaskListUpdated = (updatedTaskList) => {
    onTaskListUpdated(updatedTaskList);
  };

  const handleTaskListDeleted = (deletedTaskList) => {
    onTaskListDeleted(deletedTaskList);
  };

  const filterByPriority = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityA = calculatePriority(a.priority);
      const priorityB = calculatePriority(b.priority);
      return priorityA - priorityB;
    });
    setTasks(sortedTasks);
  };

  const filterByDueDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const hasDueDateA = !!a.dueDate;
      const hasDueDateB = !!b.dueDate;

      if (!hasDueDateA && !hasDueDateB) return 0;
      if (!hasDueDateA) return 1;
      if (!hasDueDateB) return -1;

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    setTasks(sortedTasks);
  };
  
  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption);
    if (selectedOption === "dueDate") {
      filterByDueDate();
    } else if (selectedOption === "priority") {
      filterByPriority();
    }
  };

  const calculatePriority = (priority) => {
    switch (priority) {
      case "ALTA":
        return 0;
      case "MEDIA":
        return 1;
      default:
        return 2;
    }
  };

  return (
    <>
      <div className={styles.taskListContainer}>
        <Card
          styles={{
            body: {
              paddingTop: 0,
            },
            header: {
              paddingTop: 16,
              paddingBottom: 16,
            },
          }}
          className={styles.cardContainer}
          title={
            <div className={styles.cardHeader}>
              <Row align="middle" className={styles.cardText}>
                <Col>
                  <Title level={2} className={styles.cardTitle}>
                    {title}
                  </Title>
                  {tasks.length > 0 && (
                    <Row align={"middle"} gutter={10} className={styles.filterContainer}>
                      <Col>
                        <div className={styles.sortBy}>
                          <FilterFilled />
                          <span>Ordenar por: </span>
                        </div>
                      </Col>
                      <Col>
                        <Select
                          value={filter}
                          placeholder="Padrão"
                          options={[
                            {
                              value: "dueDate",
                              label: "Data da conclusão",
                            },
                            {
                              value: "priority",
                              label: "Prioridade",
                            },
                          ]}
                          dropdownStyle={{width: "max-content"}}
                          onChange={handleFilterChange}
                        />
                      </Col>
                    </Row>
                  )}
                </Col>

                <Col className={styles.cardActions}>
                  <img
                    src={editIcon}
                    alt="Editar lista de tarefas"
                    onClick={handleEditTaskList}
                    className={styles.editIcon}
                  />
                  {isModalEditTaskListOpen && (
                    <ModalEditTaskList
                      taskList={taskList}
                      modalOpen={true}
                      onClose={handleCloseEditTaskListModal}
                      onTaskListUpdated={handleTaskListUpdated}
                    />
                  )}
                  <img
                    src={deleteIcon}
                    alt="Excluir lista de tarefas"
                    onClick={handleDeleteTaskList}
                    className={styles.deleteIcon}
                  />
                  {isModalDeleteTaskListOpen && (
                    <ModalDeleteTaskList
                      taskList={taskList}
                      modalOpen={true}
                      onClose={handleCloseDeleteTaskListModal}
                      onTaskListDeleted={handleTaskListDeleted}
                    />
                  )}
                </Col>
              </Row>
            </div>
          }
        >
          <ConfigProvider
            renderEmpty={() => (
              <Empty description="Esta lista ainda não possui tarefas" />
            )}
          >
            <List
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item key={task.id}>
                  <Task
                    {...task}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                    onTaskCompletionToggled={handleTaskCompletionToggled}
                  />
                </List.Item>
              )}
            />
          </ConfigProvider>
          <AddButton
            label={"Adicionar tarefa"}
            className={styles.addTaskButton}
            onClick={handleAddTask}
          />
          {isModalAddTaskOpen && (
            <ModalAddTask
              taskListId={taskListId}
              modalOpen={true}
              onClose={handleCloseAddTaskModal}
              onTaskAdded={handleTaskAdded}
            />
          )}
        </Card>
      </div>
    </>
  );
};
