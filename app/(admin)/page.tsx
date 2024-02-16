"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
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
import { groupBy } from "lodash";

const ClassroomsTable: React.FC = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClassroom, setEditingClassroom] = useState<any>(null);
  const supabase = createClient();
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

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

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.classroom_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const groupedClassrooms = groupBy(filteredClassrooms, "classroom_department");

  return (
    <Layout>
      <Layout.Content style={{ padding: "0 48px" }} className="h-full mb-48">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Classrooms</Breadcrumb.Item>
        </Breadcrumb>

        <div className="pt-8 pb-4 flex justify-between items-center">
          <h4 className="text-xl text-gray-900 font-semibold">
            Manage Classrooms
          </h4>
          <div className="flex flex-row gap-2">
            <Input.Search
              placeholder="Search by classroom name"
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
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

        <div>
          {!loading &&
            Object.keys(groupedClassrooms).map((departmentId) => (
              <div key={departmentId}>
                <h2 className="font-medium text-gray-800 p-2  border-b border-gray-200">
                  {
                    departmentOptions.find(
                      (d) => d.department_id === departmentId
                    )?.department_name
                  }
                </h2>
                <div className="grid grid-cols-3 gap-4 my-4">
                  {groupedClassrooms[departmentId]?.map((classroom: any) => (
                    <Card
                      key={classroom.classroom_id}
                      title={classroom.classroom_name}
                    >
                      <p>Batch: {classroom.classroom_batch}</p>
                      <p>Department: {classroom.classroom_department}</p>
                      <p>Semester: {classroom.classroom_semester}</p>
                      <p>Section: {classroom.classroom_section}</p>

                      <div className="mt-4 flex justify-end gap-4">
                        <Button
                          type="primary"
                          onClick={() =>
                            (window.location.href = `/classes/${classroom.classroom_id}`)
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
                                onClick={() => onEdit(classroom)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item
                                key="2"
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(classroom.classroom_id)}
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
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {searchText && filteredClassrooms.length === 0 && !loading && (
          <div className="flex bg-white items-center flex-col justify-center h-[400px] border rounded-xl mt-4">
            <p className="text-gray-500">No classrooms found</p>
            <p className="text-gray-400">
              Your search for "{searchText}" did not return any results.
            </p>

            <Button
              type="link"
              onClick={showModal}
              icon={<PlusOutlined />}
              className="mt-4"
            >
              Add New Classroom
            </Button>
          </div>
        )}

        {classrooms.length === 0 && !loading && (
          <div className="flex bg-white items-center flex-col justify-center h-[400px] border rounded-xl mt-4">
            <p className="text-gray-500">No classrooms found</p>
            <p className="text-gray-400">
              You have not added any classrooms yet. Click the button below to
              add a new classroom.
            </p>

            <Button
              type="link"
              onClick={showModal}
              icon={<PlusOutlined />}
              className="mt-4"
            >
              Add New Classroom
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex bg-white items-center flex-col justify-center h-[400px] border rounded-xl mt-4">
            <SyncOutlined
              spin
              style={{ fontSize: 24, color: "rgb(107 114 128)" }}
              className="gray-400"
            />
            <p className="text-gray-500 mt-4">Loading classrooms...</p>
          </div>
        )}

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
              <Input variant="filled" placeholder="Enter classroom name" />
            </Form.Item>
            <Form.Item
              label="Year of Batch"
              name="classroom_batch"
              rules={[
                { required: true, message: "Please select classroom batch!" },
              ]}
            >
              <Select variant="filled" placeholder="Select year of batch">
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
              <Select
                variant="filled"
                placeholder="Select classroom department"
              >
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
              <Select
                variant="filled"
                placeholder="Select classroom's ongoing semester"
              >
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
