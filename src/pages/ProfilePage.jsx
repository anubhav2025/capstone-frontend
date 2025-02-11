import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Avatar, Divider } from 'antd';

const { Title, Text } = Typography;

function ProfilePage() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <Row justify="center" style={{ padding: 20 }}>
      {/* Constrain width on larger screens */}
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card
          style={{
            textAlign: 'center',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          <Avatar
            size={120}
            src={userInfo?.pictureUrl}
            alt="profile"
            style={{ marginBottom: '1rem' }}
          />

          <Title level={3} style={{ margin: 0 }}>
            {userInfo?.name}
          </Title>
          <Text type="secondary">{userInfo?.email}</Text>

          <Divider style={{ margin: '1.5rem 0' }} />

          <div>
            <Text strong>Roles: </Text>
            <Text>{userInfo?.roles?.join(', ')}</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default ProfilePage;
