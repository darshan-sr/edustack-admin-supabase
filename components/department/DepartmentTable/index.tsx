// components/DepartmentTable.tsx
import { Table, Button, Space, Popconfirm } from "antd";
import { Department } from "@/types"; // Define Department type

interface DepartmentTableProps {
  data: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "department_id",
      key: "department_id",
    },
    {
      title: "Name",
      dataIndex: "department_name",
      key: "department_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Department) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description={`Are you sure you want to delete ${record.department_id} ?`}
            onConfirm={() => onDelete(record.department_id)}
            okText="Yes"
            cancelText="No"
          >
            {" "}
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} className="rounded-xl" />;
};

export default DepartmentTable;
