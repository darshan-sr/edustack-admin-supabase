"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Layout,
  Breadcrumb,
  message,
} from "antd";
import { createClient } from "@/utils/supabase/client"; // import your Supabase client instance

const DepartmentsTable: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase.from("department").select("*");
      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      console.error("Error fetching departments:", error.message);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingDepartment(null);
  };

  const onFinish = async (values: any) => {
    try {
      if (editingDepartment) {
        const { error } = await supabase
          .from("department")
          .update(values)
          .eq("department_id", editingDepartment.department_id);
        if (error) throw error;
        message.success("Department updated successfully");
      } else {
        const { error } = await supabase.from("department").insert([values]);
        if (error) throw error;
        message.success("Department added successfully");
      }
      fetchDepartments();
      setIsModalVisible(false);
      form.resetFields();
      setEditingDepartment(null);
    } catch (error: any) {
      console.error("Error saving department:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onDelete = async (departmentId: string) => {
    try {
      const { error } = await supabase
        .from("department")
        .delete()
        .eq("department_id", departmentId);
      if (error) throw error;
      message.success("Department deleted successfully");
      fetchDepartments();
    } catch (error: any) {
      console.error("Error deleting department:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onEdit = (department: any) => {
    setEditingDepartment(department);
    form.setFieldsValue(department);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Department ID",
      dataIndex: "department_id",
      key: "department_id",
    },
    {
      title: "Department Name",
      dataIndex: "department_name",
      key: "department_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <>
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this department?"
            onConfirm={() => onDelete(record.department_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ marginLeft: "0.5rem" }}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <Layout.Content style={{ padding: "0 48px" }} className="h-screen">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Department</Breadcrumb.Item>
        </Breadcrumb>

        <div className="pt-8 pb-4 flex justify-between items-center">
          <h4 className="text-xl text-gray-900 font-semibold">
            Manage Departments
          </h4>
          <Button type="primary" onClick={showModal}>
            Add New Department
          </Button>
        </div>

        <Table dataSource={departments} columns={columns} />
        <Modal
          title={editingDepartment ? "Edit Department" : "Add New Department"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Department ID"
              name="department_id"
              rules={[
                { required: true, message: "Please enter department ID!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Department Name"
              name="department_name"
              rules={[
                { required: true, message: "Please enter department name!" },
              ]}
            >
              <Input type="filled" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default DepartmentsTable;
