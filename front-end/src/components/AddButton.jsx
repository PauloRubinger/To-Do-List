import addIcon from '../assets/images/add-button.svg';

const AddButton = ({ label, onClick }) => {
    return (
        <button onClick={onClick}>
            <img src={addIcon} alt="Botão de adicionar" />
            {label}
        </button>
    );
};

export default AddButton;