import { useState, useEffect, useCallback } from "react";
import AddButton from "../components/AddButton/AddButton";
import ModalAddTaskList from "../components/ModalAddTaskList/ModalAddTaskList";
import styles from './Home.module.css';
import { TaskList } from "../components/TaskList/TaskList";
import { listAllTaskLists } from "../services/task-list-service";

const HomePage = () => {

  const [isAddTaskListModalOpen, setIsAddTaskListModalOpen] = useState(false);
  const [taskLists, setTaskLists] = useState([]);

  const fetchTaskLists = useCallback(async () => {
    const response = await listAllTaskLists();
    if (response && response.data) {
      const sortedTaskLists = sortTaskLists(response.data);
      setTaskLists(sortedTaskLists);
    }
  }, []);

  // Sort by creation date to show the most recents first
  const sortTaskLists = (taskLists) => {
    const sortedTaskLists = [...taskLists].sort((a, b) => {
      const creationDateA = new Date(a.createdAt);
      const creationDateB = new Date(b.createdAt);
      return creationDateB.getTime() - creationDateA.getTime();
    });
    return sortedTaskLists;
  };  

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);

  const handleAddTaskList = () => {
    setIsAddTaskListModalOpen(true);
  };

  const handleCloseAddTaskListModal = () => {
    setIsAddTaskListModalOpen(false);
  };

  const handleTaskListAdded = (newTaskList) => {
    setTaskLists((prevTaskLists) => {
      const sortedTaskLists = sortTaskLists([...prevTaskLists, newTaskList]);
      return sortedTaskLists;
    });
  };

  const handleTaskListUpdated = (updatedTaskList) => {
    setTaskLists((prevTaskLists) => prevTaskLists.map((prevTaskList) => prevTaskList.id === updatedTaskList.id ? updatedTaskList : prevTaskList));
  };

  const handleTaskListDeleted = (deletedTaskList) => {
    setTaskLists((prevTaskLists) => prevTaskLists.filter((prevTaskList) => prevTaskList.id !== deletedTaskList.id));
  };

  return (
    <div className={styles.generalContainer}>
      <h1>Listas de tarefas</h1>
      {taskLists.length === 0 && <h2>Você ainda não possui nenhuma lista de tarefas</h2>}
      <div className={styles.AddButton}>
        <AddButton label={"Nova Lista"} onClick={handleAddTaskList} />
      </div>
      {isAddTaskListModalOpen && <ModalAddTaskList modalOpen={true} onClose={handleCloseAddTaskListModal} onTaskListAdded={handleTaskListAdded} />}
      <div className={styles.taskListContainer}>
        {taskLists && taskLists.map(taskList => (
          <TaskList key={taskList.id} taskListId={taskList.id} title={taskList.name} description={taskList.description} onTaskListUpdated={handleTaskListUpdated} onTaskListDeleted={handleTaskListDeleted} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;