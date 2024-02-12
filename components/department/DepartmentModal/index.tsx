// components/DepartmentModal.tsx
import { Modal, Form, Input, Button, message } from "antd";
import { useState } from "react";
import { Department } from "@/types"; // Define Department type
import { createClient } from "@/utils/supabase/client";

interface DepartmentModalProps {
  visible: boolean;
  onCancel: () => void;
  department?: Department;
  onSuccess: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  visible,
  onCancel,
  department,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (department) {
        // Update department
        const { error } = await supabase
          .from("department")
          .update(values)
          .eq("department_id", department.department_id);
        if (error) {
          throw error;
        }
        message.success("Department updated successfully");
      } else {
        // Create new department
        const { error } = await supabase.from("department").insert(values);
        if (error) {
          throw error;
        }
        message.success("Department created successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error:", error.message);
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      // Delete department
      const { error } = await supabase
        .from("department")
        .delete()
        .eq("department_id", department?.department_id);
      if (error) {
        throw error;
      }
      message.success("Department deleted successfully");
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error("Error:", error.message);
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={department ? "Edit Department" : "Add Department"}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,

        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
        >
          {department ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={department}
      >
        <Form.Item
          name="department_id"
          label="ID"
          rules={[{ required: true, message: "Please enter department ID" }]}
        >
          <Input disabled={!!department} placeholder="Department ID" />
        </Form.Item>
        <Form.Item
          name="department_name"
          label="Name"
          rules={[{ required: true, message: "Please enter department name" }]}
        >
          <Input placeholder="Department Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentModal;
