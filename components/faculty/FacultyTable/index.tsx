// components/FacultyTable.tsx
import { Table, Button, Space } from "antd";
import { Faculty } from "@/types"; // Define Faculty type

interface FacultyTableProps {
  data: Faculty[];
  onEdit: (faculty: Faculty) => void;
  onDelete: (facultyId: number) => void;
}

const FacultyTable: React.FC<FacultyTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "ID",
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
      render: (text: string, record: Faculty) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button onClick={() => onDelete(record.faculty_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} />;
};

export default FacultyTable;
