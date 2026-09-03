import styles from './AddButton.module.css';

const AddButton = ({ label, onClick, className, disabled = false }) => {
  return (
    <button
      type="button"
      className={[styles.addButton, className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default AddButton;