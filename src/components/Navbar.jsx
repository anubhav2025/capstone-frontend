// src/components/Navbar.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Menu, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { clearUserInfo, setTenantId } from '../store/authSlice';

function Navbar() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = 'http://localhost:8081/logout';
    dispatch(clearUserInfo());
  };

  // userInfo might have: 
  // {
  //   googleId, email, name, roles, tenants: [ { tenantId, tenantName, role } ],
  //   currentTenantId: "T1"
  // }
  const tenantList = userInfo?.tenants || [];
  const currentTenantId = userInfo?.currentTenantId || "";

  const handleTenantChange = (newTenantId) => {
    // 1) Update userInfo.currentTenantId
    dispatch(setTenantId(newTenantId));

    // 2) Optionally, refresh or force pages to refetch
    // If your pages run queries in a useEffect that depends on userInfo.currentTenantId,
    // they'll automatically re-fetch.
    // Alternatively:
    // window.location.reload(); // brute force, not recommended if you want a smooth experience
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'profile',
          label: 'View Profile',
          onClick: () => navigate('/profile'),
        },
        {
          key: 'logout',
          label: 'Logout',
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        padding: '0 16px',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>
        My Security App
      </div>

      {/* Right side: tenant switch + user menu */}
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        {tenantList.length > 0 && (
          <Select
            style={{ width: 200 }}
            value={currentTenantId}
            onChange={handleTenantChange}
          >
            {tenantList.map((t) => (
              <Select.Option key={t.tenantId} value={t.tenantId}>
                {t.tenantName} ({t.role})
              </Select.Option>
            ))}
          </Select>
        )}

        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ cursor: 'pointer', display:'flex', alignItems:'center' }}>
            <Avatar
              src={userInfo?.pictureUrl}
              icon={!userInfo?.pictureUrl && <UserOutlined />}
              style={{ marginRight: 8 }}
            />
            <span>{userInfo?.name || 'Unknown User'}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default Navbar;
