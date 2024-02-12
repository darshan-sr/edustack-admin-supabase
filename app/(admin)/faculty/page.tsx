"use client";
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
  Select,
} from "antd";
import { createClient } from "@/utils/supabase/client"; // import your Supabase client instance
import {
  DeleteFilled,
  DeleteOutlined,
  EditFilled,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { fetchDepartment, fetchFaculties } from "./actions";

const FacultiesTable: React.FC = () => {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const supabase = createClient();
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaculty();
    fetchDepartmentOptions();
  }, []);

  const fetchDepartmentOptions = async () => {
    try {
      const { data, error } = await fetchDepartment();
      if (error) throw error;
      setDepartmentOptions(data || []);
    } catch (error: any) {
      console.error("Error fetching faculties:", error.message);
    }
  };
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchFaculties();
      if (error) throw error;

      setFaculties(data || []);
    } catch (error: any) {
      console.error("Error fetching faculties:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingFaculty(null);
  };

  const onFinish = async (values: any) => {
    try {
      if (editingFaculty) {
        const { error } = await supabase
          .from("faculty")
          .update(values)
          .eq("faculty_id", editingFaculty.faculty_id);
        if (error) throw error;
        message.success("Faculty updated successfully");
      } else {
        const { error } = await supabase.from("faculty").insert([values]);
        if (error) throw error;
        message.success("Faculty added successfully");
      }
      fetchFaculty();
      setIsModalVisible(false);
      form.resetFields();
      setEditingFaculty(null);
    } catch (error: any) {
      console.error("Error saving faculty:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onDelete = async (facultyId: string) => {
    try {
      const { error } = await supabase
        .from("faculty")
        .delete()
        .eq("faculty_id", facultyId);
      if (error) throw error;
      message.success("Faculty deleted successfully");
      fetchFaculty();
    } catch (error: any) {
      console.error("Error deleting faculty:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onEdit = (faculty: any) => {
    setEditingFaculty(faculty);
    form.setFieldsValue(faculty);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Faculty ID",
      dataIndex: "faculty_id",
      key: "faculty_id",
    },
    {
      title: "Name",
      dataIndex: "faculty_name",
      key: "faculty_name",
    },
    {
      title: "Email",
      dataIndex: "faculty_email",
      key: "faculty_email",
    },
    {
      title: "Designation",
      dataIndex: "faculty_designation",
      key: "faculty_designation",
    },
    {
      title: "Department",
      dataIndex: "faculty_department",
      key: "faculty_department",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <>
          <Button
            type="primary"
            onClick={() => onEdit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this faculty member?"
            onConfirm={() => onDelete(record.faculty_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              style={{ marginLeft: "0.5rem" }}
              icon={<DeleteOutlined />}
            >
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
          <Breadcrumb.Item>Faculty</Breadcrumb.Item>
        </Breadcrumb>

        <div className="pt-8 pb-4 flex justify-between items-center">
          <h4 className="text-xl text-gray-900 font-semibold">
            Manage Faculty
          </h4>
          <div className="flex flex-row gap-2">
            <Button
              loading={loading}
              onClick={fetchFaculty}
              icon={<SyncOutlined />}
            >
              Refresh
            </Button>
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Add New Faculty
            </Button>
          </div>
        </div>

        <Table dataSource={faculties} columns={columns} loading={loading} />
        <Modal
          title={editingFaculty ? "Edit Faculty" : "Add New Faculty"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Name"
              name="faculty_name"
              rules={[
                { required: true, message: "Please enter faculty name!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="faculty_email"
              rules={[
                { required: true, message: "Please enter faculty email!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Designation"
              name="faculty_designation"
              rules={[
                {
                  required: true,
                  message: "Please enter faculty designation!",
                },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Department"
              name="faculty_department"
              rules={[
                { required: true, message: "Please enter faculty department!" },
              ]}
            >
              <Select variant="filled">
                {departmentOptions.map((department) => (
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
      </Layout.Content>
    </Layout>
  );
};

export default FacultiesTable;
