import styles from './AddButton.module.css';

const AddButton = ({ label, onClick, className }) => {
  return (
    <button
      type="button"
      className={[styles.addButton, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default AddButton;