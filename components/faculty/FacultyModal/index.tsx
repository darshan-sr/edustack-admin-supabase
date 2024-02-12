// components/FacultyModal.tsx
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useState, useEffect } from "react";
import { Faculty, Department } from "@/types"; // Define Faculty and Department types
import { createClient } from "@/utils/supabase/client";

interface FacultyModalProps {
  visible: boolean;
  onCancel: () => void;
  faculty?: Faculty;
  onSuccess: () => void;
}

const FacultyModal: React.FC<FacultyModalProps> = ({
  visible,
  onCancel,
  faculty,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase.from("department").select("*");
      if (error) {
        throw error;
      }
      setDepartments(data || []);
    } catch (error: any) {
      console.error("Error:", error.message);
      message.error("An error occurred");
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (faculty) {
        // Update faculty
        const { error } = await supabase
          .from("faculty")
          .update(values)
          .eq("faculty_id", faculty.faculty_id);
        if (error) {
          throw error;
        }
        message.success("Faculty updated successfully");
      } else {
        // Create new faculty
        const { error } = await supabase.from("faculty").insert(values);
        if (error) {
          throw error;
        }
        message.success("Faculty created successfully");
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
      // Delete faculty
      const { error } = await supabase
        .from("faculty")
        .delete()
        .eq("faculty_id", faculty?.faculty_id);
      if (error) {
        throw error;
      }
      message.success("Faculty deleted successfully");
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
      title={faculty ? "Edit Faculty" : "Add Faculty"}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        faculty && (
          <Button key="delete" onClick={onDelete} loading={loading}>
            Delete
          </Button>
        ),
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
        >
          {faculty ? "Update" : "Create"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={faculty}
      >
        <Form.Item
          name="faculty_name"
          label="Name"
          rules={[{ required: true, message: "Please enter faculty name" }]}
        >
          <Input placeholder="Faculty Name" />
        </Form.Item>
        <Form.Item
          name="faculty_email"
          label="Email"
          rules={[{ required: true, message: "Please enter faculty email" }]}
        >
          <Input type="email" placeholder="Faculty Email" />
        </Form.Item>
        <Form.Item
          name="faculty_designation"
          label="Designation"
          rules={[
            { required: true, message: "Please enter faculty designation" },
          ]}
        >
          <Input placeholder="Faculty Designation" />
        </Form.Item>
        <Form.Item
          name="faculty_department"
          label="Department"
          rules={[
            { required: true, message: "Please select faculty department" },
          ]}
        >
          <Select placeholder="Select Department">
            {departments.map((department) => (
              <Select.Option
                key={department.department_id}
                value={department.department_id}
              >
                {department.department_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FacultyModal;
