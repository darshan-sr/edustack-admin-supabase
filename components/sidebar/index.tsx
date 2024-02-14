"use client";

import React, { useEffect, useState } from "react";
import { BsFillPeopleFill, BsPeople, BsStack } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi";
import { IoCalendarNumber } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import {
  FaChalkboardUser,
  FaCircleUser,
  FaUserGraduate,
  FaUserGroup,
} from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Layout, Menu, Popconfirm, theme } from "antd";
import { MdLogout, MdSpaceDashboard } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";

const { SubMenu } = Menu;
const { Sider } = Layout;

const AdminSidebar = () => {
  const pathname = usePathname() || "";

  const supabase = createClient();

  const router = useRouter();

  const handleSignOut = async () => {
    console.log("signing out");
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  const [collapsed, setCollapsed] = useState(true);

  //   useEffect(() => {
  //     if (
  //       pathname.endsWith("/students") ||
  //       pathname.endsWith("/subjects") ||
  //       pathname.endsWith("/internals") ||
  //       pathname.endsWith("/SEE")
  //     ) {
  //       setCollapsed(true);
  //     }
  //   });

  useEffect(() => {
    localStorage.setItem("collapsed", collapsed.toString());
  }, [collapsed]);

  return (
    <div
      className={
        collapsed
          ? "  h-screen md:w-[80px] min-w-[80px] transition-all "
          : "  h-screen md:w-[200px] min-w-[200px] transition-all "
      }
    >
      <Layout className=" h-screen min-h-screen  fixed left-0 z-[50] top-0">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className="h-full "
          theme="dark"
        >
          <div className="min-h-[10px]"></div>
          <Menu
            selectable={false}
            theme="dark"
            mode="inline"
            className="w-full"
          >
            <Menu.Item
              key="icon"
              icon={<BsStack style={{ fontSize: "20px" }} />}
            >
              <p className=" text-[20px]  font-[500]">Edustack</p>
            </Menu.Item>
          </Menu>

          <div className="min-h-[10px] mb-4 border-b border-solid border-slate-800"></div>
          <Menu
            mode="inline"
            className="w-full"
            theme="dark"
            defaultSelectedKeys={[pathname]}
          >
            <Menu.Item key="/" icon={<MdSpaceDashboard />}>
              <Link href={"/"}>Dashboard</Link>
            </Menu.Item>

            <Menu.Item key="/faculty" icon={<FaUserGroup />}>
              <Link href={"/faculty"}>Faculties</Link>
            </Menu.Item>

            <Menu.Item key="/student" icon={<FaUserGraduate />}>
              <Link href={"/student"}>Students</Link>
            </Menu.Item>

            <Menu.Item key="/department" icon={<FaUniversity />}>
              <Link href={"/department"}>Departments</Link>
            </Menu.Item>
          </Menu>
          <Menu
            selectable={false}
            theme="dark"
            mode="inline"
            className="w-full"
          >
            <Menu.Item
              icon={
                <Popconfirm
                  title="Log out"
                  description="Are you sure you want to log out?"
                  onConfirm={handleSignOut}
                  okText="Yes"
                  cancelText="No"
                >
                  {" "}
                  <MdLogout />
                </Popconfirm>
              }
            >
              <Popconfirm
                title="Log out"
                description="Are you sure you want to log out?"
                onConfirm={handleSignOut}
                okText="Yes"
                cancelText="No"
                className="z-[99999]"
              >
                Logout
              </Popconfirm>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </div>
  );
};

export default AdminSidebar;
