import { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { deleteTask } from '../../services/task-service';

/* 
  props = {
    task: object
    modalOpen: boolean,
    onClose(): () => void
    onTaskDeleted(): => object
  }
*/

export const ModalDeleteTask = (props) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal();
    }
  }, [props.modalOpen]);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const response = await deleteTask(props.task.id);
      console.log(response);
      if (response && response.status === 204) {
        props.onTaskDeleted(props.task);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Success",
          description: "Task deleted successfully!"
        });
      } else {
        throw new Error("Erro ao excluir a tarefa!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Error",
        description: "There was a problem deleting the task!"
      });
    } finally {
      setModalOpen(false);
      setConfirmLoading(false);
      props.onClose();
    }
  };

  const handleCancel = () => {
    props.onClose();
  };

  return (
    <>
      <Modal
        title="Are you sure you want to delete this task?"
        open={modalOpen}
        onOk={handleOk}
        okType='danger'
        okText="Yes, delete"
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >

      </Modal>
    </>
  )
};