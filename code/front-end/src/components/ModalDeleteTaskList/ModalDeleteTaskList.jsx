import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { deleteTaskList } from '../../services/api';

/* 
  props = {
    taskList: object
    modalOpen: boolean,
    onClose(): () => void
  }
*/

export const ModalDeleteTaskList = (props) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (props) => {
    setModalOpen(props.modalOpen);
  };

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal(props);
    }
  }, [props]);

  const handleOk = async () => {
    setConfirmLoading(true);
    setTimeout(async () => {
      const response = await deleteTaskList(props.taskList.id);
      if (response) {
        setModalOpen(false);
        setConfirmLoading(false);
        props.onClose();
        window.location.reload();
      }
    }, 1000);
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
        okType='danger'
        okText="Sim, excluir"
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
      </Modal>
    </>
  )
};