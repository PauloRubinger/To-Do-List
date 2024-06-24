import { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { editTask } from '../../services/api';

/* 
  props = {
    modalOpen: boolean,
    onClose(): () => void
  }
*/

export const ModalEditTask = (props) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (props) => {
    setModalOpen(props.modalOpen);
  };

  // const [api, contextHolder] = notification.useNotification();
  // const openNotificationWithIcon = (type) => {
  //   api[type]({
  //     message: 'Notification Title',
  //     description:
  //       'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  //   });
  // };


  const openNotification = (type) => {
    if (type === "success") {
      notification.success({
        message: "Tarefa alterada com sucesso!"
      })
    } else {
      notification.error({
        message: "Ocorreu um problema ao alterar a tarefa.",
      })
    }
  };

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal(props);
    }
  }, [props]);

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    setTimeout(async () => {
      const response = await editTask(values);
      if (response) {
        setModalOpen(false);
        setConfirmLoading(false);
        props.onClose();
      }
    }, 2000);
  };

  const handleCancel = () => {
    props.onClose();
  };

  return (
    <>
     <Modal
        title="Adicionar lista de tarefas"
        open={modalOpen}
        onOk={form.submit}
        okText="Adicionar"
        confirmLoading={confirmLoading}
        cancelText="Cancelar"
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nome da lista de tarefas"
            rules={[{ required: true, message: "Por favor, insira o nome da lista de tarefas" }]}
          >
            <Input placeholder="Ex.: Afazeres domésticos"></Input>
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: "Por favor, insira uma descrição para a lista de tarefas" }]}
          >
            <Input placeholder="Ex.: Tarefas para essa semana"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};