import { useState } from "react";
import AddButton from "../components/AddButton/AddButton";
import ModalAddTaskList from "../components/ModalAddTaskList/ModalAddTaskList";
import './HomePage.css';

const HomePage = () => {

  const [isAddTaskListModalOpen, setAddTaskListModalOpen] = useState(false);

  const handleAddTaskList = () => {
    setAddTaskListModalOpen(true);
  }

  const handleCloseAddTaskListModal = () => {
    setAddTaskListModalOpen(false);
  }

  return (
    <div className="generalContainer">
      <h1>Listas de tarefas</h1>
      <h2>Você ainda não possui nenhuma lista de tarefas</h2>
      <AddButton label={"Nova Lista"} onClick={handleAddTaskList}/>
      {isAddTaskListModalOpen && <ModalAddTaskList modalOpen={true} onClose={handleCloseAddTaskListModal} />}
    </div>
  );
};

export default HomePage;