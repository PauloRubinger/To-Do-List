import addIcon from '../../assets/images/add-button.svg';
import styles from './AddButton.module.css';

const AddButton = ({ label, onClick }) => {
  return (
    <button className={styles.addButton} onClick={onClick}>
      <img className={styles.addIcon} src={addIcon} alt="Botão de adicionar" />
      <div>
        {label}
      </div>
    </button>
  );
};

export default AddButton;