import { useState, useEffect } from "react";
import AddButton from "../components/AddButton/AddButton";
import ModalAddTaskList from "../components/ModalAddTaskList/ModalAddTaskList";
import styles from './HomePage.module.css';
import { TaskList } from "../components/TaskList/TaskList";
import { listAllTaskLists } from "../services/api";

const HomePage = () => {

  const [isAddTaskListModalOpen, setAddTaskListModalOpen] = useState(false);
  const [taskLists, setTaskLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await listAllTaskLists();
      if (response) {
        setTaskLists(response);
      }
    };
    fetchData();
    console.log(taskLists)
  }, []);

  const handleAddTaskList = () => {
    setAddTaskListModalOpen(true);
  }

  const handleCloseAddTaskListModal = () => {
    setAddTaskListModalOpen(false);
  }

  return (
    <div className={styles.generalContainer}>
      <h1>Listas de tarefas</h1>
      {taskLists.length === 0 && <h2>Você ainda não possui nenhuma lista de tarefas</h2>}
      <div className={styles.newTaskListButton}>
        <AddButton label={"Nova Lista"} onClick={handleAddTaskList} />
      </div>
      {isAddTaskListModalOpen && <ModalAddTaskList modalOpen={true} onClose={handleCloseAddTaskListModal} />}
      <div className={styles.taskListContainer}>
        {taskLists && taskLists.map(taskList => (
          <TaskList key={taskList.id} taskListId={taskList.id} title={taskList.name} description={taskList.description} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;