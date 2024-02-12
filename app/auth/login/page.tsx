"use client";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Layout,
  theme,
  Alert,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { BsStack } from "react-icons/bs";
import { login } from "./actions";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const onFinish = async (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    // Simulate login process (replace with your actual login logic)
    setLoading(true);
    const error = await login(formData);
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <Layout className="w-full h-screen flex items-center justify-center">
      <div
        style={{
          margin: "24px 16px",
          padding: 24,
          backgroundColor: "white",
          borderRadius: 10,
        }}
      >
        <Form
          name="normal_login"
          className="w-96"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className="w-full justify-center items-center gap-2 flex flex-row">
            <BsStack className="text-3xl text-blue-600" />
            <h4 className="text-center py-8 text-xl font-semibold text-gray-900 ">
              Edustack
            </h4>
          </div>
          <Title level={5}>Login as Administrator</Title>
          <Form.Item
            name="email"
            className="mb-8"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email Address"
              size="large"
              type="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          {error && (
            <Form.Item>
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Button
          type="link"
          className="items-center justify-center w-full"
          onClick={() => {
            router.push("/auth/forgot-password");
          }}
        >
          Forgot password?
        </Button>
      </div>
    </Layout>
  );
};

export default LoginPage;
