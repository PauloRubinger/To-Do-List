import { useState, useEffect } from 'react';
import { Modal, Form, Input, notification } from "antd";
import { editTaskList } from '../../services/task-list-service';

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
          message: "Success",
          description: "Task list updated successfully!"
        });
      } else {
        throw new Error("Erro ao atualizar a lista de tarefas!");
      }
    } catch (error) {
      notification.error({
        duration: 5,
        showProgress: true,
        pauseOnHover: true,
        message: "Error",
        description: "There was a problem updating the task list!"
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
        title="Edit Task List"
        open={modalOpen}
        onOk={form.submit}
        okText="Save"
        confirmLoading={confirmLoading}
        cancelText="Cancel"
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            name: props.taskList.name
          }}
        >
          <Form.Item
            name="name"
            label="Task list name"
            rules={[
              { required: true, message: "Please enter the task list name" },
              { max: 50, message: "Task list name must have a maximum of 50 characters" },
            ]}
          >
            <Input placeholder="Ex.: Household chores"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};