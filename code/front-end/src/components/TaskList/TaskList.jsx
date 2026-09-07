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
  Checkbox,
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
  const isReadOnly = process.env.REACT_APP_READ_ONLY === "true";
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isModalAddTaskOpen, setIsModalAddTaskOpen] = useState(false);
  const [isModalEditTaskListOpen, setIsModalEditTaskListOpen] = useState(false);
  const [isModalDeleteTaskListOpen, setIsModalDeleteTaskListOpen] =
    useState(false);
  const [filter, setFilter] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const taskList = {
    id: taskListId,
    name: title,
  };

  useEffect(() => {
    const fetchTasks = async (taskListId) => {
      const response = await listAllByTaskList(taskListId);
      if (response && response.data) {
        setAllTasks(response.data); // Store all tasks unfiltered
        setShowCompleted(true);
        setFilter(null); // Reset sort filter when changing task lists
        // Apply filter inline to avoid dependency cycle
        let filtered = [...response.data];
        filtered.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return 0;
        });
        setTasks(filtered);
      }
    };

    fetchTasks(taskListId);
  }, [taskListId]);

  const handleAddTask = () => {
    setIsModalAddTaskOpen(true);
  };

  const applyCurrentFilter = (
    items,
    showCompletedOverride = showCompleted,
    filterOverride = filter,
  ) => {
    let filtered = [...items];

    // Filter completed tasks if showCompleted is false
    if (!showCompletedOverride) {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Sort: incomplete tasks first, then completed tasks at the end
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Completed tasks go to the end
      }
      return 0; // Keep original order for tasks with same completion status
    });

    // Apply additional filter/sort options
    if (!filterOverride) {
      return filtered;
    }

    if (filterOverride === "dueDate") {
      return filtered.sort((a, b) => {
        // If one is completed, keep completed at the end
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        const hasDueDateA = !!a.dueDate;
        const hasDueDateB = !!b.dueDate;

        if (!hasDueDateA && !hasDueDateB) return 0;
        if (!hasDueDateA) return 1;
        if (!hasDueDateB) return -1;

        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    if (filterOverride === "priority") {
      return filtered.sort((a, b) => {
        // If one is completed, keep completed at the end
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        const priorityA = calculatePriority(a.priority);
        const priorityB = calculatePriority(b.priority);
        return priorityA - priorityB;
      });
    }

    return filtered;
  };

  const handleTaskAdded = (newTask) => {
    setAllTasks((prevAllTasks) => [...prevAllTasks, newTask]);
    setTasks((prevTasks) => applyCurrentFilter([...prevTasks, newTask]));
  };

  const handleTaskUpdated = (updatedTask) => {
    const updatedAllTasks = allTasks.map((prevTask) =>
      prevTask.id === updatedTask.id ? updatedTask : prevTask,
    );
    setAllTasks(updatedAllTasks);
    setTasks(applyCurrentFilter(updatedAllTasks));
  };

  const handleTaskDeleted = (deletedTask) => {
    const updatedAllTasks = allTasks.filter(
      (prevTask) => prevTask.id !== deletedTask.id,
    );
    setAllTasks(updatedAllTasks);
    setTasks((prevTasks) =>
      prevTasks.filter((prevTask) => prevTask.id !== deletedTask.id),
    );
  };

  const handleTaskCompletionToggled = (taskId, completed) => {
    const updatedAllTasks = allTasks.map((prevTask) =>
      prevTask.id === taskId ? { ...prevTask, completed } : prevTask,
    );
    setAllTasks(updatedAllTasks);
    setTasks(applyCurrentFilter(updatedAllTasks));
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

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption);
    // Reapply filters from allTasks with new filter option
    setTasks(applyCurrentFilter(allTasks, showCompleted, selectedOption));
  };

  const calculatePriority = (priority) => {
    switch (priority) {
      case "HIGH":
        return 0;
      case "MEDIUM":
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
                    <Row
                      align={"middle"}
                      gutter={10}
                      className={styles.filterContainer}
                    >
                      <Col className={styles.sortBy}>
                        <FilterFilled className={styles.filterIcon} />
                        <span>Order by: </span>
                        <Select
                          value={filter}
                          placeholder="Default"
                          options={[
                            {
                              value: "dueDate",
                              label: "Due date",
                            },
                            {
                              value: "priority",
                              label: "Priority",
                            },
                          ]}
                          dropdownStyle={{ width: "max-content" }}
                          onChange={handleFilterChange}
                        />
                      </Col>
                      <Col>
                        <Checkbox
                          className={styles.showCompleted}
                          checked={showCompleted}
                          onChange={(e) => {
                            const newShowCompleted = e.target.checked;
                            setShowCompleted(newShowCompleted);
                            // Reapply filters from allTasks with new showCompleted value
                            setTasks(
                              applyCurrentFilter(
                                allTasks,
                                newShowCompleted,
                                filter,
                              ),
                            );
                          }}
                        >
                          Show completed
                        </Checkbox>
                      </Col>
                    </Row>
                  )}
                </Col>

                <Col className={styles.cardActions}>
                  <img
                    src={editIcon}
                    alt="Edit icon"
                    onClick={isReadOnly ? undefined : handleEditTaskList}
                    className={`${styles.editIcon} ${isReadOnly ? styles.readOnlyAction : ""}`}
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
                    alt="Delete icon"
                    onClick={isReadOnly ? undefined : handleDeleteTaskList}
                    className={`${styles.deleteIcon} ${isReadOnly ? styles.readOnlyAction : ""}`}
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
              <Empty description="This list does not have any tasks yet" />
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
            label={"Add task"}
            className={styles.addTaskButton}
            onClick={isReadOnly ? undefined : handleAddTask}
            disabled={isReadOnly}
          />
          {!isReadOnly && isModalAddTaskOpen && (
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
