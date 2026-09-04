import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, notification } from "antd";
import { addTask } from "../../services/task-service";

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
      if (values.type === "DATE") {
        values.dueDate = formatInputDate(values.dueDate.$d);
      } else if (values.type === "DEADLINE") {
        const date = calculateDateByDays(parseInt(values.dueDate));
        values.dueDate = formatInputDate(date);
      }

      setConfirmLoading(true);

      const response = await addTask(props.taskListId, values);
      
      if (response && response.status === 201) {
        props.onTaskAdded(response.data);
        notification.success({
          duration: 5,
          showProgress: true,
          pauseOnHover: true,
          message: "Success",
          description: "Task added successfully!"
        });
      } else {
        throw new Error("Erro ao adicionar a tarefa!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Error",
        description: "There was a problem adding the task!"
      });
    } finally {
      setConfirmLoading(false);
      setModalOpen(false);
      props.onClose();
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

  const validateDate = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return date && date < today;
  };

  return (
    <>
      <Modal
        title="Add Task"
        open={modalOpen}
        onOk={form.submit}
        okText="Add"
        confirmLoading={confirmLoading}
        cancelText="Cancel"
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Task Name"
            rules={[
              { required: true, message: "Please enter the task name" },
              { max: 255, message: "Task name must have a maximum of 255 characters" }
            ]}
          >
            <Input placeholder="Ex.: Household chores"></Input>
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            tooltip="Date: Expected completion date. Deadline: Expected completion deadline in days. Free: No completion deadline"
            rules={[{ required: true, message: "Please select a type for the task" }]}
          >
            <Select
              placeholder="Select a type"
              optionFilterProp="label"
              onChange={handleTypeChange}
              options={[
                {
                  value: 'DATE',
                  label: 'Date',
                },
                {
                  value: 'DEADLINE',
                  label: 'Deadline',
                },
                {
                  value: 'FREE',
                  label: 'Free',
                },
              ]}
            />
          </Form.Item>
          {selectedType === "DEADLINE" && 
            <Form.Item
              name="dueDate"
              label="Expected days to completion"
              rules={[
                { required: true, message: "Please enter the deadline in days" },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === "") {
                      return Promise.resolve();
                    }

                    const parsedValue = Number(value);

                    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
                      return Promise.reject(new Error("Enter an integer number greater than or equal to 0"));
                    }

                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" min={0} step={1} />
            </Form.Item>
          }
          {selectedType === "DATE" && (
            <Form.Item
              name="dueDate"
              label="Expected completion date"
              rules={[{ required: true, message: "Please enter the expected completion date" }]}
            >
              <DatePicker style={{width: "100%"}} format={"DD/MM/YYYY"} disabledDate={validateDate} ></DatePicker>
            </Form.Item>
          )}
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select a priority" }]}
          >
            <Select
              placeholder="Select a priority"
              optionFilterProp="label"
              options={[
                {
                  value: 'HIGH',
                  label: 'High',
                },
                {
                  value: 'MEDIUM',
                  label: 'Medium',
                },
                {
                  value: 'LOW',
                  label: 'Low',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
