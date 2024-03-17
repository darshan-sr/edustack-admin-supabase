'use client';

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Layout,
  Breadcrumb,
  message,
  Select,
} from "antd";
import { createClient } from "@/utils/supabase/client"; // import your Supabase client instance
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const ManageSubjects = ({ params }: { params: { slug: string } }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const supabase = createClient();
  const [classroomOptions, setClassroomOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchClassroomOptions();
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

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("course")
        .select("*")
        .eq("course_classroom", params.slug);
      if (error) throw error;
      setSubjects(data || []);
    } catch (error: any) {
      console.error("Error fetching subjects:", error.message);
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
    setEditingSubject(null);
  };

  const onFinish = async (values: any) => {
    try {
    if (editingSubject) {
        const { error } = await supabase
            .from("course")
            .update([{...values, course_classroom: params.slug}])
            .eq("course_id", editingSubject.course_id);
        if (error) throw error;
        message.success("Subject updated successfully");
    } else {
        const { error } = await supabase.from("course").insert([{...values, course_classroom: params.slug}]);
        if (error) throw error;
        message.success("Subject added successfully");
    }
    fetchSubjects();
    setIsModalVisible(false);
    form.resetFields();
      setEditingSubject(null);
    } catch (error: any) {
      console.error("Error saving subject:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onDelete = async (subjectId: string) => {
    try {
      const { error } = await supabase
        .from("course")
        .delete()
        .eq("course_id", subjectId);
      if (error) throw error;
      message.success("Subject deleted successfully");
      fetchSubjects();
    } catch (error: any) {
      console.error("Error deleting subject:", error.message);
      message.error("An error occurred. Please try again.");
    }
  };

  const onEdit = (subject: any) => {
    setEditingSubject(subject);
    form.setFieldsValue(subject);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Course Code",
      dataIndex: "course_code",
      key: "course_code",
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Semester",
      dataIndex: "course_semester",
      key: "course_semester",
    },
    {
      title: "Type",
      dataIndex: "course_type",
      key: "course_type",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            type="primary"
            onClick={() => onEdit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => onDelete(record.course_id)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Layout.Content style={{ padding: "0 48px" }} className="h-screen">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>{params.slug}</Breadcrumb.Item>
          <Breadcrumb.Item>Subjects</Breadcrumb.Item>
        </Breadcrumb>

        <div className="pt-8 pb-4 flex justify-between items-center">
          <h4 className="text-xl text-gray-900 font-semibold">
            Manage Subjects for {params.slug}
          </h4>
          <Button
            type="primary"
            onClick={showModal}
            icon={<PlusOutlined />}
          >
            Add New Subject
          </Button>
        </div>

        <Table
          dataSource={subjects}
          size="small"
          columns={columns}
          loading={loading}
        />
        <Modal
          title={editingSubject ? "Edit Subject" : "Add New Subject"}
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          okText={editingSubject ? "Save" : "Add"}
          destroyOnClose
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Course Code"
              name="course_code"
              rules={[
                { required: true, message: "Please enter course code!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Course Name"
              name="course_name"
              rules={[
                { required: true, message: "Please enter course name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Semester"
              name="course_semester"
              rules={[
                { required: true, message: "Please enter semester!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Type"
              name="course_type"
              rules={[
                { required: true, message: "Please enter type!" },
              ]}
            >
              <Select>
                <Select.Option value="elective">Elective</Select.Option>
                <Select.Option value="compulsory">Compulsory</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default ManageSubjects;
