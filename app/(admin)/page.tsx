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
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SyncOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const ClassroomsTable: React.FC = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClassroom, setEditingClassroom] = useState<any>(null);
  const supabase = createClient();
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClassrooms();
    fetchDepartmentOptions();
  }, []);

  const fetchDepartmentOptions = async () => {
    try {
      const { data, error } = await supabase.from("department").select("*");
      if (error) throw error;
      setDepartmentOptions(data || []);
    } catch (error: any) {
      console.error("Error fetching departments:", error.message);
    }
  };

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("classroom").select("*");
      if (error) throw error;
      setClassrooms(data || []);
    } catch (error: any) {
      console.error("Error fetching classrooms:", error.message);
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
    setEditingClassroom(null);
  };

  const onFinish = async (values: any) => {
    try {
      const classroomId = `${values.classroom_batch}-${values.classroom_department}-${values.classroom_section}`;
      values.classroom_id = classroomId;

      if (editingClassroom) {
        const { error } = await supabase
          .from("classroom")
          .update(values)
          .eq("classroom_id", editingClassroom.classroom_id);
        if (error) throw error;
        message.success("Classroom updated successfully");
      } else {
        const { error } = await supabase.from("classroom").insert([values]);
        if (error) throw error;
        message.success("Classroom added successfully");
      }
      fetchClassrooms();
      setIsModalVisible(false);
      form.resetFields();
      setEditingClassroom(null);
    } catch (error: any) {
      console.error("Error saving classroom:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onDelete = async (classroomId: string) => {
    try {
      const { error } = await supabase
        .from("classroom")
        .delete()
        .eq("classroom_id", classroomId);
      if (error) throw error;
      message.success("Classroom deleted successfully");
      fetchClassrooms();
    } catch (error: any) {
      console.error("Error deleting classroom:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onEdit = (classroom: any) => {
    setEditingClassroom(classroom);
    form.setFieldsValue(classroom);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Classroom ID",
      dataIndex: "classroom_id",
      key: "classroom_id",
    },
    {
      title: "Batch",
      dataIndex: "classroom_batch",
      key: "classroom_batch",
    },
    {
      title: "Name",
      dataIndex: "classroom_name",
      key: "classroom_name",
    },
    {
      title: "Department",
      dataIndex: "classroom_department",
      key: "classroom_department",
    },
    {
      title: "Semester",
      dataIndex: "classroom_semester",
      key: "classroom_semester",
    },
    {
      title: "Section",
      dataIndex: "classroom_section",
      key: "classroom_section",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <div className="flex flex-row  items-center gap-4">
          <Button
            type="primary"
            onClick={() =>
              (window.location.href = `/classes/${record.classroom_id}`)
            }
            icon={<LinkOutlined />}
          >
            Go to Class
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(record.classroom_id)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
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
          <Breadcrumb.Item>Classrooms</Breadcrumb.Item>
        </Breadcrumb>

        <div className="pt-8 pb-4 flex justify-between items-center">
          <h4 className="text-xl text-gray-900 font-semibold">
            Manage Classrooms
          </h4>
          <div className="flex flex-row gap-2">
            <Button
              loading={loading}
              onClick={fetchClassrooms}
              icon={<SyncOutlined />}
            >
              Refresh
            </Button>
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Add New Classroom
            </Button>
          </div>
        </div>

        <Table dataSource={classrooms} columns={columns} loading={loading} />
        <Modal
          title={editingClassroom ? "Edit Classroom" : "Add New Classroom"}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Classroom Name"
              name="classroom_name"
              rules={[
                { required: true, message: "Please enter classroom name!" },
              ]}
            >
              <Input variant="filled" />
            </Form.Item>
            <Form.Item
              label="Year of Batch"
              name="classroom_batch"
              rules={[
                { required: true, message: "Please select classroom batch!" },
              ]}
            >
              <Select variant="filled">
                {Array.from({ length: 7 }, (_, i) => 2019 + i).map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Classroom Department"
              name="classroom_department"
              rules={[
                {
                  required: true,
                  message: "Please enter classroom department!",
                },
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
              label="Ongoing Semester"
              name="classroom_semester"
              rules={[
                {
                  required: true,
                  message: "Please select classroom semester!",
                },
              ]}
            >
              <Select variant="filled">
                {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                  <Select.Option key={semester} value={semester}>
                    {semester}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Section"
              name="classroom_section"
              rules={[
                { required: true, message: "Please select classroom section!" },
              ]}
            >
              <Select variant="filled">
                {["A", "B", "C", "D", "E"].map((section) => (
                  <Select.Option key={section} value={section}>
                    {section}
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

export default ClassroomsTable;
