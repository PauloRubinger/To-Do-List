import { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { addTask } from "../../services/api";

/* 
  props = {
    modalOpen: boolean,
    onClose(): () => void
  }
*/

const ModalAddTaskList = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedPiority, setSelectedPriority] = useState(undefined);

  const showModal = (props) => {
    setModalOpen(props.modalOpen);
  };

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal(props);
    }
  }, [props]);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    setTimeout(async () => {
      const response = await addTask(values);
      if (response) {
        setModalOpen(false);
        setConfirmLoading(false);
        props.onClose();
      }
    }, 1000);
  };

  const handleCancel = () => {
    props.onClose();
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
  };

  return (
    <>
      <Modal
        title="Adicionar tarefa"
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
            label="Nome da tarefa"
            rules={[{ required: true, message: "Por favor, insira o nome da tarefa" }]}
          >
            <Input placeholder="Ex.: Afazeres domésticos"></Input>
          </Form.Item>
           <Form.Item
            name="type"
            label="Tipo"
            tooltip="Data: Data prevista de conclusão. Prazo: Prazo previsto para conclusão em dias. Livre: Sem prazo de conclusão"
            rules={[{ required: true, message: "Por favor, selecione um tipo para a tarefa" }]}
          >
            <Select
              placeholder="Selecione um tipo"
              optionFilterProp="label"
              onChange={handleTypeChange}
              options={[
                {
                  value: 'DATA',
                  label: 'Data',
                },
                {
                  value: 'PRAZO',
                  label: 'Prazo',
                },
                {
                  value: 'LIVRE',
                  label: 'Livre',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Prioridade"
            rules={[{ required: true, message: "Por favor, selecione a prioridade da tarefa" }]}
          >
            <Select
              placeholder="Selecione a prioridade"
              optionFilterProp="label"
              onChange={handlePriorityChange}
              options={[
                {
                  value: 'ALTA',
                  label: 'Alta',
                },
                {
                  value: 'MEDIA',
                  label: 'Média',
                },
                {
                  value: 'BAIXA',
                  label: 'Baixa',
                },
              ]}
            />

          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddTaskList;