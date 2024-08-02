import { useState, useEffect } from "react";
import { Modal, Form, Input, notification } from "antd";
import { addTaskList } from "../../services/task-list-service";

/* 
  props = {
    modalOpen: boolean,
    onClose(): () => void
    onTaskListAdded(): => object
  }
*/

const ModalAddTaskList = (props) => {
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

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await addTaskList(values);
      if (response && response.status === 201) {
        props.onTaskListAdded(response.data);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Sucesso",
          description: "Lista de tarefas adicionada com sucesso!",
        });
      } else {
        throw new Error("Erro ao adicionar a lista de tarefas.");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Erro",
        description: "Houve um problema ao adicionar a lista de tarefas!",
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
        title="Adicionar lista de tarefas"
        open={modalOpen}
        onOk={form.submit}
        okText="Adicionar"
        confirmLoading={confirmLoading}
        cancelText="Cancelar"
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Nome da lista de tarefas"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome da lista de tarefas",
              },
            ]}
          >
            <Input placeholder="Ex.: Afazeres domésticos"></Input>
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              {
                required: true,
                message:
                  "Por favor, insira uma descrição para a lista de tarefas",
              },
            ]}
          >
            <Input placeholder="Ex.: Tarefas para essa semana"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddTaskList;
