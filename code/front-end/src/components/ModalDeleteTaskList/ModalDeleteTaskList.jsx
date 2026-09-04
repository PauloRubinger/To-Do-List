import { useState, useEffect } from "react";
import { Modal, notification } from "antd";
import { deleteTaskList } from "../../services/task-list-service";

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
          message: "Success",
          description: "Task list deleted successfully!"
        });
      } else {
        throw new Error("Erro ao excluir a lista de tarefas!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Error",
        description: "There was a problem deleting the task list!"
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
        title="Are you sure you want to delete this task list?"
        open={modalOpen}
        onOk={handleOk}
        okType="danger"
        okText="Yes, delete"
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      ></Modal>
    </>
  );
};
