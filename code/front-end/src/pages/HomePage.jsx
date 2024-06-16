import AddButton from "../components/AddButton/AddButton";
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="generalContainer">
      <h1>Listas de tarefas</h1>
      <h2>Você ainda não possui nenhuma lista de tarefas</h2>
      <AddButton label={"Nova Lista"} />
    </div>
  );
};

export default HomePage;