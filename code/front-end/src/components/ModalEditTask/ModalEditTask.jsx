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

    if (values.type === "DATE") {
        values.dueDate = formatInputDate(values.dueDate.$d);
      } else if (values.type === "DEADLINE") {
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
          message: "Success",
          description: "Task updated successfully!"
        });
      } else {
        throw new Error("Erro ao editar a tarefa!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Error",
        description: "There was a problem editing the task!",
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
        title="Edit Task"
        open={modalOpen}
        onOk={form.submit}
        okText="Save"
        confirmLoading={confirmLoading}
        cancelText="Cancel"
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          initialValues={{
            name: props.task.name,
            type: props.task.type,
            dueDate: props.task.type === "DATE" ? dayjs(props.task.dueDate) : undefined,
            priority: props.task.priority,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Task name"
            rules={[
              { required: true, message: "Please enter the task name" },
              { max: 255, message: "The task name must have a maximum of 255 characters" }
            ]}
          >
            <Input placeholder="Ex.: Paint the living room walls"></Input>
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            tooltip="Date: Expected completion date. Deadline: Expected completion deadline in days. Free: No completion deadline"
            rules={[
              {
                required: true,
                message: "Please select a type for the task",
              },
            ]}
          >
            <Select
              placeholder="Select a type"
              optionFilterProp="label"
              onChange={handleTypeChange}
              options={[
                {
                  value: "DATE",
                  label: "Date",
                },
                {
                  value: "DEADLINE",
                  label: "Deadline",
                },
                {
                  value: "FREE",
                  label: "Free",
                },
              ]}
            />
          </Form.Item>
          {selectedType === "DEADLINE" && (
            <Form.Item
              name="dueDate"
              label="Expected days to completion"
              rules={[
                {
                  required: true,
                  message: "Please enter the deadline in days",
                },
              ]}
            >
              <Input type="number"></Input>
            </Form.Item>
          )}
          {selectedType === "DATE" && (
            <Form.Item
              name="dueDate"
              label="Expected completion date"
              rules={[
                {
                  required: true,
                  message: "Please enter the expected completion date",
                },
              ]}
            >
              <DatePicker style={{width: " 100%"}} format={"DD/MM/YYYY"} disabledDate={validateDate}></DatePicker>
            </Form.Item>
          )}
          <Form.Item
            name="priority"
            label="Priority"
            rules={[
              {
                required: true,
                message: "Please select a priority",
              },
            ]}
          >
            <Select
              placeholder="Select a priority"
              optionFilterProp="label"
              options={[
                {
                  value: "HIGH",
                  label: "High",
                },
                {
                  value: "MEDIUM",
                  label: "Medium",
                },
                {
                  value: "LOW",
                  label: "Low",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
