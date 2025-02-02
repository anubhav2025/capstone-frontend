// src/components/SidebarLayout.jsx
import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { HomeOutlined, SettingOutlined, LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ArmorCodeImg from "../assets/armorcode_logo.png";
import ArmorCodeCollapsedImg from "../assets/armorcode_logo_collapsed.png";

// import "./SidebarLayout.css"; // optional for custom styling

const { Header, Sider, Content } = Layout;

function SidebarLayout({ children, onScan }) {
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

          {/* Could place a logo next to it, e.g. <img src="logo.png" alt="Armorcode" /> */}
        </div>
        {/* Some dummy menu items */}
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

      {/* Main layout */}
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* The SCAN button in top-right */}
          <Button type="primary" onClick={onScan}>
            Scan
          </Button>
        </Header>

        <Content style={{ margin: "16px", background: "#fff" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default SidebarLayout;
