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

  return (
    <Layout className=" h-screen min-h-screen bg-gray-400 z-[48] ">
      <Sider className="h-full ">
        <Menu
          mode="inline"
          className="w-full h-full bg-gray-400"
          defaultSelectedKeys={[pathname]}
        >
          <div className="flex items-center justify-center h-[68px] mb-5 border-b border-gray-200">
            <h1 className="text-md font-medium ">{params.slug}</h1>
          </div>
          <Menu.Item key={`/class/${params.slug}`} icon={<FaUserGroup />}>
            <Link href={`/class/${params.slug}`}>Students</Link>
          </Menu.Item>

          <Menu.Item key={`/class/${params.slug}/subjects`} icon={<FaBook />}>
            <Link href={`/class/${params.slug}/subjects`}>Subjects</Link>
          </Menu.Item>

        </Menu>
      </Sider>
    </Layout>
  );
};

export default NestedSidebar;
