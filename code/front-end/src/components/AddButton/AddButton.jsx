import addIcon from '../../assets/images/add-button.svg';
import './AddButton.css'

const AddButton = ({ label, onClick }) => {
  return (
    <button className='add-button' onClick={onClick}>
      <img className='add-icon' src={addIcon} alt="Botão de adicionar" />
      <div>
        {label}
      </div>
    </button>
  );
};

export default AddButton;