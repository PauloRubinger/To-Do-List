import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, notification } from "antd";
import { addTask } from "../../services/api";

/* 
  props = {
    taskListId: number,
    modalOpen: boolean,
    onClose(): () => void,
    onTaskAdded(): () => object
  }
*/

export const ModalAddTask = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);

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
    if (values.type === "DATA") {
      values.dueDate = formatInputDate(values.dueDate.$d);
    } else if (values.type === "PRAZO") {
      const date = calculateDateByDays(parseInt(values.dueDate));
      values.dueDate = formatInputDate(date);
    }

    setConfirmLoading(true);
    try {
      const response = await addTask(props.taskListId, values);
      if (response.status === 201) {
        setModalOpen(false);
        setConfirmLoading(false);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Sucesso",
          description: "Tarefa adicionada com sucesso!"
        });
        props.onClose();
        props.onTaskAdded(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatInputDate = (date) => {
    const formattedDate = new Date(date).toISOString();
    return formattedDate;
  };

  const calculateDateByDays = (days) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + days);
    return targetDate;
  };

  const handleCancel = () => {
    props.onClose();
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    form.setFieldsValue({ dueDate: null });
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
          {selectedType === "PRAZO" && 
            <Form.Item
              name="dueDate"
              label="Dias previstos para a conclusão"
              rules={[{ required: true, message: "Por favor, informe o prazo em dias" }]}
            >
              <Input type="number"></Input>
            </Form.Item>
          }
          {selectedType === "DATA" && 
            <Form.Item
              name="dueDate"
              label="Data prevista para a conclusão"
              rules={[{ required: true, message: "Por favor, informe a data prevista para conclusão" }]}
            >
              <DatePicker format={"DD/MM/YYYY"}></DatePicker>
            </Form.Item>
          }
          <Form.Item
            name="priority"
            label="Prioridade"
            rules={[{ required: true, message: "Por favor, selecione a prioridade da tarefa" }]}
          >
            <Select
              placeholder="Selecione a prioridade"
              optionFilterProp="label"
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
