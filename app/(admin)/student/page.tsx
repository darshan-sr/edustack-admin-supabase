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
  Dropdown,
  Menu,
} from "antd";
import { createClient } from "@/utils/supabase/client"; // import your Supabase client instance
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
  LinkOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const supabase = createClient();
  const [classroomOptions, setClassroomOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  useEffect(() => {
    fetchStudents();
    fetchClassroomOptions();
    fetchDepartmentOptions();
  }, []);

  const fetchClassroomOptions = async () => {
    try {
      const { data, error } = await supabase.from("classroom").select("*");
      if (error) throw error;
      setClassroomOptions(data || []);
    } catch (error: any) {
      console.error("Error fetching classrooms:", error.message);
    }
  };

  const fetchDepartmentOptions = async () => {
    try {
      const { data, error } = await supabase.from("department").select("*");
      if (error) throw error;
      setDepartmentOptions(data || []);
    } catch (error: any) {
      console.error("Error fetching departments:", error.message);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("student").select("*");
      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
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
    setEditingStudent(null);
    setViewMode(false);
  };

  const onFinish = async (values: any) => {
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from("student")
          .update(values)
          .eq("student_id", editingStudent.student_id);
        if (error) throw error;
        message.success("Student updated successfully");
      } else {
        const { error } = await supabase.from("student").insert([values]);
        if (error) throw error;
        message.success("Student added successfully");
      }
      fetchStudents();
      setIsModalVisible(false);
      form.resetFields();
      setEditingStudent(null);
    } catch (error: any) {
      console.error("Error saving student:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onDelete = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from("student")
        .delete()
        .eq("student_id", studentId);
      if (error) throw error;
      message.success("Student deleted successfully");
      fetchStudents();
    } catch (error: any) {
      console.error("Error deleting student:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onEdit = (student: any) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Student ID",
      dataIndex: "student_id",
      key: "student_id",
    },
    {
      title: "Name",
      dataIndex: "student_name",
      key: "student_name",
    },
    {
      title: "Email",
      dataIndex: "student_email",
      key: "student_email",
    },
    {
      title: "USN",
      dataIndex: "student_usn",
      key: "student_usn",
    },
    {
      title: "Phone",
      dataIndex: "student_phone",
      key: "student_phone",
    },
    {
      title: "Batch",
      dataIndex: "student_labbatch",
      key: "student_labbatch",
    },
    {
      title: "Classroom",
      dataIndex: "student_classroom",
      key: "student_classroom",
    },
    {
      title: "Department",
      dataIndex: "student_department",
      key: "student_department",
    },
    // {
    //   title: "Father's Name",
    //   dataIndex: "father_name",
    //   key: "father_name",
    // },
    // {
    //   title: "Father's Email",
    //   dataIndex: "father_email",
    //   key: "father_email",
    // },
    // {
    //   title: "Father's Phone",
    //   dataIndex: "father_phone",
    //   key: "father_phone",
    // },
    // {
    //   title: "Mother's Name",
    //   dataIndex: "mother_name",
    //   key: "mother_name",
    // },
    // {
    //   title: "Mother's Email",
    //   dataIndex: "mother_email",
    //   key: "mother_email",
    // },
    // {
    //   title: "Mother's Phone",
    //   dataIndex: "mother_phone",
    //   key: "mother_phone",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            type="primary"
            onClick={() => {
              setViewMode(true);
              onEdit(record);
            }}
            icon={<LinkOutlined />}
          >
            View Details
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" onClick={() => onEdit(record)}>
                  <EditOutlined /> Edit
                </Menu.Item>
                <Menu.Item
                  key="delete"
                  danger
                  onClick={() => onDelete(record.student_id)}
                >
                  <DeleteOutlined /> Delete
                </Menu.Item>
              </Menu>
            }
          >
            <Button shape="circle" icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Layout.Content style={{ padding: "0 48px" }} className="h-screen">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Students</Breadcrumb.Item>
        </Breadcrumb>

        <div className="pt-8 pb-4 flex justify-between items-center">
          <h4 className="text-xl text-gray-900 font-semibold">
            Manage Students
          </h4>
          <div className="flex flex-row gap-2">
            <Button
              loading={loading}
              onClick={fetchStudents}
              icon={<SyncOutlined />}
            >
              Refresh
            </Button>
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Add New Student
            </Button>
          </div>
        </div>

        <Table dataSource={students} columns={columns} loading={loading} />
        <Modal
          title={editingStudent ? "Edit Student" : "Add New Student"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form
            form={form}
            disabled={viewMode}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Student ID"
              name="student_id"
              rules={[{ required: true, message: "Please enter student ID!" }]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Name"
              name="student_name"
              rules={[
                { required: true, message: "Please enter student name!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="student_email"
              rules={[
                { required: true, message: "Please enter student email!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="USN"
              name="student_usn"
              rules={[{ required: true, message: "Please enter student USN!" }]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="student_phone"
              rules={[
                { required: true, message: "Please enter student phone!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Lab Batch"
              name="student_labbatch"
              rules={[
                { required: true, message: "Please enter student lab batch!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Classroom"
              name="student_classroom"
              rules={[
                { required: true, message: "Please enter student classroom!" },
              ]}
            >
              <Select variant="filled">
                {classroomOptions.map((classroom) => (
                  <Select.Option
                    key={classroom.classroom_id}
                    value={classroom.classroom_id}
                  >
                    {classroom.classroom_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Department"
              name="student_department"
              rules={[
                { required: true, message: "Please enter student department!" },
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
            <Form.Item
              label="Father's Name"
              name="father_name"
              rules={[
                { required: true, message: "Please enter father's name!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Father's Email"
              name="father_email"
              rules={[
                { required: true, message: "Please enter father's email!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Father's Phone"
              name="father_phone"
              rules={[
                { required: true, message: "Please enter father's phone!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Mother's Name"
              name="mother_name"
              rules={[
                { required: true, message: "Please enter mother's name!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Mother's Email"
              name="mother_email"
              rules={[
                { required: true, message: "Please enter mother's email!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Mother's Phone"
              name="mother_phone"
              rules={[
                { required: true, message: "Please enter mother's phone!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default StudentsTable;
