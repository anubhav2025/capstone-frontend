import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { clearUserInfo } from '../store/authSlice';

function Navbar() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle the logout
  const handleLogout = () => {
    // If your server expects GET /logout:
    window.location.href = 'http://localhost:8081/logout';
    dispatch(clearUserInfo());

    // Or if you do a fetch POST approach:
    /*
    fetch('http://localhost:8081/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      window.location.href = '/'; // or your login page
    });
    */
  };

  // The menu that appears when we click the avatar
  const menu = (
    <Menu
      items={[
        {
          key: 'profile',
          label: 'View Profile',
          onClick: () => navigate('/profile'),  // or a dedicated route
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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
      padding: '0 16px',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Left side brand or links */}
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>
        My Security App
      </div>

      {/* Right side user info (dropdown with avatar) */}
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ cursor: 'pointer', display:'flex', alignItems:'center' }}>
            {/* If userInfo.pictureUrl is missing, fallback icon */}
            <Avatar
              src={userInfo?.pictureUrl}
              icon={!userInfo?.pictureUrl && <UserOutlined />}
              style={{ marginRight: 8 }}
            />
            {/* Possibly show name or just avatar */}
            <span>{userInfo?.name || 'Unknown User'}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default Navbar;
