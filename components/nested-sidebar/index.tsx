"use client";

import React, { useEffect, useState } from "react";
import { BsFillPeopleFill, BsPeople, BsStack } from "react-icons/bs";
import { HiDocumentReport, HiDocumentText } from "react-icons/hi";
import { RiGraduationCapFill } from "react-icons/ri";
import {
  FaBook,
  FaChalkboardUser,
  FaCircleUser,
  FaUserGraduate,
  FaUserGroup,
} from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Card, Layout, Menu, Popconfirm, theme } from "antd";

const { SubMenu } = Menu;
const { Sider } = Layout;

const NestedSidebar = ({ params }: { params: { slug: string } }) => {
  const pathname = usePathname() || "";
  const [ongoingSemester, setOngoingSemester] = useState<string>("");
  const [classStatus, setClassStatus] = useState<string>("");
  const router = useRouter();

  return (
    <Layout className=" h-screen min-h-screen  z-[48] ">
      <Sider className="h-full " theme="light">
        <Menu
          mode="inline"
          className="w-full h-full"
          theme="light"
          defaultSelectedKeys={[pathname]}
        >
          <Menu.Item
            key={`/admin/classes/${params.slug}/students`}
            icon={<FaUserGroup />}
          >
            <Link href={`/admin/classes/${params.slug}/students`}>
              Students
            </Link>
          </Menu.Item>

          <Menu.Item
            key={`/admin/classes/${params.slug}/subjects`}
            icon={<FaBook />}
          >
            <Link href={`/admin/classes/${params.slug}/subjects`}>
              Subjects
            </Link>
          </Menu.Item>

          <Menu.Item
            key={`/admin/classes/${params.slug}/internals`}
            icon={<HiDocumentReport />}
          >
            <Link href={`/admin/classes/${params.slug}/internals`}>
              Internals
            </Link>
          </Menu.Item>

          <Menu.Item
            key={`/admin/classes/${params.slug}/SEE`}
            icon={<RiGraduationCapFill />}
          >
            <Link href={`/admin/classes/${params.slug}/SEE`}>SEE</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default NestedSidebar;
