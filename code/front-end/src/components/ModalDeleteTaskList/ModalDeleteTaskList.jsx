import { useState, useEffect } from "react";
import { Modal, notification } from "antd";
import { deleteTaskList } from "../../services/api";

/* 
  props = {
    taskList: object
    modalOpen: boolean,
    onClose(): () => void,
    onTaskListDeleted(): () => object
  }
*/

export const ModalDeleteTaskList = (props) => {
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
    try {
      setConfirmLoading(true);
      const response = await deleteTaskList(props.taskList.id);
      if (response && response.status === 204) {
        props.onTaskListDeleted(props.taskList);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Sucesso",
          description: "Lista de tarefas excluída com sucesso!"
        });
      } else {
        throw new Error("Erro ao excluir a lista de tarefas!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Erro",
        description: "Houve um problema ao excluir a lista de tarefas!"
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
        title="Tem certeza que deseja excluir essa lista de tarefas?"
        open={modalOpen}
        onOk={handleOk}
        okType="danger"
        okText="Sim, excluir"
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      ></Modal>
    </>
  );
};
