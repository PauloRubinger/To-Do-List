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
          message: "Sucesso",
          description: "Tarefa excluída com sucesso!"
        });
      } else {
        throw new Error("Erro ao excluir a tarefa!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Erro",
        description: "Houve um problema ao excluir a tarefa!"
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
        title="Tem certeza que deseja excluir essa tarefa?"
        open={modalOpen}
        onOk={handleOk}
        okType='danger'
        okText="Sim, excluir"
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >

      </Modal>
    </>
  )
};