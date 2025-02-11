// src/components/SidebarLayout.jsx
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, Outlet } from "react-router-dom"; // <-- import Outlet!
import ArmorCodeImg from "../assets/armorcode_logo.png";
import ArmorCodeCollapsedImg from "../assets/armorcode_logo_collapsed.png";

const { Sider, Content } = Layout;

function SidebarLayout({ onScan }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = [location.pathname];

  const onMenuClick = (item) => {
    navigate(item.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider for the sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          <img
            src={collapsed ? ArmorCodeCollapsedImg : ArmorCodeImg}
            alt="Armorcode Logo"
            style={{
              height: collapsed ? "60px" : "90px",
              width: collapsed ? "55px" : "150px",
            }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={onMenuClick}
        >
          <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="/findings" icon={<LockOutlined />}>
            Findings
          </Menu.Item>
          <Menu.Item key="/settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main layout content */}
      <Layout>
        {/* If you want a header or a button for scanning, you can put it here */}
        {/* e.g., <Header><Button onClick={onScan}>Scan</Button></Header> */}

        <Content style={{ margin: "16px", background: "#fff" }}>
          {/* Outlet to render child routes */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default SidebarLayout;
