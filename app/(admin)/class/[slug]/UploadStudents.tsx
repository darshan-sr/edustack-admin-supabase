"use client";

import React, { useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, Modal, message } from "antd";

const UploadStudents: React.FC = () => {
  const supabase = createClient();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.error("Please select a file to upload.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = async (e) => {
      const data = e.target?.result
        ?.toString()
        .split("\n")
        .map((line) => {
          return line.split(",");
        });

      if (!data || data.length === 0) {
        message.error("Empty file or invalid format.");
        return;
      }

      const headers = data.shift();
      if (!headers || headers.length === 0) {
        message.error("Missing headers in the CSV file.");
        return;
      }

      const formattedData = data.map((row) => {
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = row[index]?.trim() ?? "";
          return obj;
        }, {} as Record<string, string>);
      });

      const { data: students, error } = await supabase
        .from("student")
        .upsert(formattedData);
      if (error) {
        console.error("Error uploading students:", error.message);
        message.error("Error uploading students. Please try again.");
      } else {
        message.success("Students uploaded successfully.");
        setIsUploadModalOpen(false);
      }
    };
  };

  return (
    <>
      <Button onClick={() => setIsUploadModalOpen(true)}>Upload CSV</Button>
      <Modal
        title="Upload Students"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        onOk={handleUpload}
        okText="Upload"
        width={800}
        destroyOnClose
      >
        <table className="table-auto">
          <thead className="flex flex-col overflow-scroll max-w-full">
            <tr>
              <td>student_id</td>
            </tr>
            <tr>
              <td>student_name</td>
            </tr>
            <tr>
              <td>student_email</td>
            </tr>
            <tr>
              <td>student_usn</td>
            </tr>
            <tr>
              <td>student_phone</td>
            </tr>
            <tr>
              <td>student_labbatch</td>
            </tr>
            <tr>
              <td>student_classroom</td>
            </tr>
            <tr>
              <td>student_department</td>
            </tr>
            <tr>
              <td>father_name</td>
            </tr>
            <tr>
              <td>father_email</td>
            </tr>
            <tr>
              <td>father_phone</td>
            </tr>
            <tr>
              <td>mother_name</td>
            </tr>
            <tr>
              <td>mother_email</td>
            </tr>
            <tr>
              <td>mother_phone</td>
            </tr>
            <tr>
              <td>student_counsellor</td>
            </tr>
          </thead>
        </table>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {selectedFile && <p>File selected: {selectedFile.name}</p>}
      </Modal>
    </>
  );
};

export default UploadStudents;
