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
          message: "Success",
          description: "Task list added successfully!",
        });
      } else {
        throw new Error("Erro ao adicionar a lista de tarefas.");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Error",
        description: "There was a problem adding the task list!",
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
        title="Add Task List"
        open={modalOpen}
        onOk={form.submit}
        okText="Add"
        confirmLoading={confirmLoading}
        cancelText="Cancel"
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Task list name"
            rules={[
              {
                required: true,
                message: "Please enter the task list name",
              },
              {
                max: 50,
                message: "Task list name must have a maximum of 50 characters",
              },
            ]}
          >
            <Input placeholder="Ex.: Household chores"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddTaskList;
