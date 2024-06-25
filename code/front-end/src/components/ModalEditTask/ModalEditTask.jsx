import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { editTask } from '../../services/api';

/* 
  props = {
    task: object
    modalOpen: boolean,
    onClose(): () => void
  }
*/

export const ModalEditTask = (props) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);
  const [isTaskTypePRAZO, setIsTaskTypePRAZO] = useState(false);
  const [isTaskTypeDATA, setIsTaskTypeDATA] = useState(false);
  const [selectedPiority, setSelectedPriority] = useState(undefined);

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal(props);
    }
  }, [props]);

  console.log(props);

  const [form] = Form.useForm();

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

  const handleTypeChange = (value) => {
    setSelectedType(value);
    form.setFieldsValue({ dueDate: null });

    if (value === "PRAZO") {
      setIsTaskTypePRAZO(true);
      setIsTaskTypeDATA(false);
    } else if (value === "DATA") {
      setIsTaskTypeDATA(true);
      setIsTaskTypePRAZO(false);
    } else {
      setIsTaskTypePRAZO(false);
      setIsTaskTypeDATA(false);
    }
  };

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

  const handleSubmit = async (values) => {

    if (values.type === "DATA") {
      values.dueDate = formatInputDate(values.dueDate.$d);
    } else if (values.type === "PRAZO") {
      const date = calculateDateByDays(parseInt(values.dueDate));
      values.dueDate = formatInputDate(date);
    }

    console.log(values);

    setConfirmLoading(true);
    setTimeout(async () => {
      const response = await editTask(props.task.id, values);
      if (response) {
        setModalOpen(false);
        setConfirmLoading(false);
        props.onClose();
        window.location.reload();
      }
    }, 2000);
  };

  const handleCancel = () => {
    props.onClose();
  };

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
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
          initialValues={{
            name: props.task.name,
            type: "LIVRE",
            dueDate: props.task.dueDate,
            priority: props.task.priority
          }}
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
          {isTaskTypePRAZO &&
            <Form.Item
              name="dueDate"
              label="Dias previstos para a conclusão"
              rules={[{ required: true, message: "Por favor, informe o prazo em dias" }]}
            >
              <Input type="number"></Input>
            </Form.Item>
          }
          {isTaskTypeDATA &&
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