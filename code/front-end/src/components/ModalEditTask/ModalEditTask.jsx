import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, notification } from "antd";
import { editTask } from "../../services/task-service";
import dayjs from "dayjs";

/* 
  props = {
    task: object
    modalOpen: boolean,
    onClose(): () => void,
    onTaskUpdated(): => object
  }
*/

export const ModalEditTask = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(props.task.type);

  useEffect(() => {
    if (props.modalOpen === true) {
      showModal();
    }
  }, [props.modalOpen]);

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
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {

    if (values.type === "DATA") {
      values.dueDate = formatInputDate(values.dueDate.$d);
    } else if (values.type === "PRAZO") {
      const date = calculateDateByDays(parseInt(values.dueDate));
      values.dueDate = formatInputDate(date);
    }

    setConfirmLoading(true);

    try {
      const response = await editTask(props.task.id, values);
      if (response && response.status === 200) {
        props.onTaskUpdated(response.data);
        setModalOpen(false);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Sucesso",
          description: "Tarefa atualizada com sucesso!"
        });
      } else {
        throw new Error("Erro ao editar a tarefa!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Erro",
        description: "Houve um problema ao editar a tarefa!",
      });
    } finally {
      setConfirmLoading(false);
      setModalOpen(false);
      props.onClose();
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    props.onClose();
  };

  const validateDate = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return date && date < today;
  };

  return (
    <>
      <Modal
        title="Editar tarefa"
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
            type: props.task.type,
            dueDate: props.task.type === "DATA" ? dayjs(props.task.dueDate) : undefined,
            priority: props.task.priority,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nome da tarefa"
            rules={[
              { required: true, message: "Por favor, insira o nome da tarefa" },
            ]}
          >
            <Input placeholder="Ex.: Afazeres domésticos"></Input>
          </Form.Item>
          <Form.Item
            name="type"
            label="Tipo"
            tooltip="Data: Data prevista de conclusão. Prazo: Prazo previsto para conclusão em dias. Livre: Sem prazo de conclusão"
            rules={[
              {
                required: true,
                message: "Por favor, selecione um tipo para a tarefa",
              },
            ]}
          >
            <Select
              placeholder="Selecione um tipo"
              optionFilterProp="label"
              onChange={handleTypeChange}
              options={[
                {
                  value: "DATA",
                  label: "Data",
                },
                {
                  value: "PRAZO",
                  label: "Prazo",
                },
                {
                  value: "LIVRE",
                  label: "Livre",
                },
              ]}
            />
          </Form.Item>
          {selectedType === "PRAZO" && (
            <Form.Item
              name="dueDate"
              label="Dias previstos para a conclusão"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o prazo em dias",
                },
              ]}
            >
              <Input type="number"></Input>
            </Form.Item>
          )}
          {selectedType === "DATA" && (
            <Form.Item
              name="dueDate"
              label="Data prevista para a conclusão"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe a data prevista para conclusão",
                },
              ]}
            >
              <DatePicker style={{width: " 100%"}} format={"DD/MM/YYYY"} disabledDate={validateDate}></DatePicker>
            </Form.Item>
          )}
          <Form.Item
            name="priority"
            label="Prioridade"
            rules={[
              {
                required: true,
                message: "Por favor, selecione a prioridade da tarefa",
              },
            ]}
          >
            <Select
              placeholder="Selecione a prioridade"
              optionFilterProp="label"
              options={[
                {
                  value: "ALTA",
                  label: "Alta",
                },
                {
                  value: "MEDIA",
                  label: "Média",
                },
                {
                  value: "BAIXA",
                  label: "Baixa",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
