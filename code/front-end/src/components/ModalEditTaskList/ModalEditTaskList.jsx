import { useState, useEffect } from 'react';
import { Modal, Form, Input, notification } from "antd";
import { editTaskList } from '../../services/api';

/* 
  props = {
    taskList: object
    modalOpen: boolean,
    onClose(): () => void,
    onTaskListUpdated(): () => object
  }
*/

export const ModalEditTaskList = (props) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal();
    }
  }, [props.modalOpen]);

  const handleSubmit = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await editTaskList(props.taskList.id, values);
      if (response && response.status === 200) {
        props.onTaskListUpdated(response.data);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Sucesso",
          description: "Lista de tarefas atualizada com sucesso!"
        });
      } else {
        throw new Error("Erro ao atualizar a lista de tarefas!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Erro",
        description: "Houve um problema ao atualizar a lista de tarefas!"
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
        title="Editar lista de tarefas"
        open={modalOpen}
        onOk={form.submit}
        okText="Salvar"
        confirmLoading={confirmLoading}
        cancelText="Cancelar"
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            name: props.taskList.name,
            description: props.taskList.description
          }}
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