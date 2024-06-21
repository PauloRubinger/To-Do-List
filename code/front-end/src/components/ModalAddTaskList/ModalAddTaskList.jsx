import { useState, useEffect } from "react";
import { Modal, Form, Input } from "antd";

/* 
  props = {
    modalOpen: boolean,
    onClose(): () => void
  }
*/

const ModalAddTaskList = (props) => {
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

  const [form] = Form.useForm();

  const handleSubmit = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Adicionar lista de tarefas"
        open={modalOpen}
        onOk={form.submit}
        confirmLoading={confirmLoading}
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
            rules={[{required: true, message: "Por favor, insira o nome da lista de tarefas"}]}
          >
            <Input placeholder="Ex.: Afazeres domésticos"></Input>
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{required: true, message: "Por favor, insira uma descrição para a lista de tarefas"}]}
          >
            <Input placeholder="Ex.: Tarefas para essa semana"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

};

export default ModalAddTaskList;