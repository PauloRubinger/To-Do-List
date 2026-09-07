import { useState, useEffect, useCallback } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AddButton from "../components/AddButton/AddButton";
import ModalAddTaskList from "../components/ModalAddTaskList/ModalAddTaskList";
import styles from './Home.module.css';
import { TaskList } from "../components/TaskList/TaskList";
import { listAllTaskLists, searchTaskListsByName } from "../services/task-list-service";

const HomePage = () => {
  const isReadOnly = process.env.REACT_APP_READ_ONLY === "true";

  const [isAddTaskListModalOpen, setIsAddTaskListModalOpen] = useState(false);
  const [taskLists, setTaskLists] = useState([]);
  const [allTaskLists, setAllTaskLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTaskLists = useCallback(async () => {
    try {
      const response = await listAllTaskLists();
      if (response && response.data) {
        const sortedTaskLists = sortTaskLists(response.data);
        setTaskLists(sortedTaskLists);
        setAllTaskLists(sortedTaskLists);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error fetching task lists:", error);
      setTaskLists([]);
      setAllTaskLists([]);
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
    setAllTaskLists((prevTaskLists) => prevTaskLists.filter((prevTaskList) => prevTaskList.id !== deletedTaskList.id));
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setTaskLists(allTaskLists);
      return;
    }
    try {
      const response = await searchTaskListsByName(value);
      // Handle both 200 OK with data and 204 NO_CONTENT (empty)
      if (response.status === 204 || !response.data) {
        setTaskLists([]);
      } else if (response.data) {
        const sortedTaskLists = sortTaskLists(response.data);
        setTaskLists(sortedTaskLists);
      }
    } catch (error) {
      console.error("Error searching task lists:", error);
      setTaskLists([]);
    }
  };

  return (
    <div className={styles.generalContainer}>
      <h1>Task Lists</h1>
      {isReadOnly && (
        <p className={styles.readOnlyNotice} role="status">
          Demo mode: read-only view
        </p>
      )}
      <div className={styles.AddButton}>
        <AddButton
          label={"Create list"}
          onClick={isReadOnly ? undefined : handleAddTaskList}
          disabled={isReadOnly}
        />
      </div>
      {allTaskLists.length > 0 && (
        <div className={styles.searchContainer}>
          <Input.Search
            placeholder="Search task lists..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="large"
            style={{ maxWidth: "400px" }}
          />
        </div>
      )}
      {taskLists.length === 0 && allTaskLists.length === 0 && <h2>You don't have any task lists yet</h2>}
      {taskLists.length === 0 && allTaskLists.length > 0 && <h2>No task lists found</h2>}
      {!isReadOnly && isAddTaskListModalOpen && <ModalAddTaskList modalOpen={true} onClose={handleCloseAddTaskListModal} onTaskListAdded={handleTaskListAdded} />}
      <div className={styles.taskListContainer}>
        {taskLists && taskLists.map(taskList => (
          <TaskList key={taskList.id} taskListId={taskList.id} title={taskList.name} description={taskList.description} onTaskListUpdated={handleTaskListUpdated} onTaskListDeleted={handleTaskListDeleted} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;