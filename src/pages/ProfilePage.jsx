import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Divider,
  Tag
} from 'antd';

const { Title, Text } = Typography;
const { Meta } = Card;

function ProfilePage() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  // Look up the names for Default and Current tenants
  const defaultTenantName = useMemo(() => {
    if (!userInfo?.tenants) return '';
    const t = userInfo.tenants.find(
      (tenant) => tenant.tenantId === userInfo.defaultTenantId
    );
    return t ? t.tenantName : userInfo.defaultTenantId;
  }, [userInfo]);

  const currentTenantName = useMemo(() => {
    if (!userInfo?.tenants) return '';
    const t = userInfo.tenants.find(
      (tenant) => tenant.tenantId === userInfo.currentTenantId
    );
    return t ? t.tenantName : userInfo.currentTenantId;
  }, [userInfo]);

  return (
    <Row justify="center" style={{ padding: 20 }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card
          style={{
            textAlign: 'center',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          {/* Avatar */}
          <Avatar
            size={120}
            src={userInfo?.pictureUrl}
            alt="profile"
            style={{ marginBottom: '1rem' }}
          />

          {/* Name & Email */}
          <Title level={3} style={{ margin: 0 }}>
            {userInfo?.name}
          </Title>
          <Text type="secondary">{userInfo?.email}</Text>

          <Divider style={{ margin: '1.5rem 0' }} />

          {/* Default & Current Tenant info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div>
              <Text strong>Default Tenant: </Text>
              <Text>{defaultTenantName}</Text>
            </div>
            <div>
              <Text strong>Current Tenant: </Text>
              <Text>{currentTenantName}</Text>
            </div>
          </div>

          {/* Tenants side by side */}
          <Title level={5} style={{ textAlign: 'left' }}>
            Tenants
          </Title>
          <Row gutter={[16, 16]}>
            {(userInfo?.tenants || []).map((tenant) => {
              const isDefault = tenant.tenantId === userInfo.defaultTenantId;
              const isCurrent = tenant.tenantId === userInfo.currentTenantId;

              return (
                <Col
                  xs={24}
                  sm={12}
                  md={8} // 3 columns side-by-side on medium+ screens
                  key={tenant.tenantId}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: 8,
                      textAlign: 'center',
                      borderLeft: isCurrent
                        ? '4px solid #1890ff'
                        : '4px solid #f0f2f5',
                    }}
                    bodyStyle={{ padding: '1rem' }}
                  >
                    <Meta
                      title={tenant.tenantName}
                      description={
                        <Text type="secondary">
                          Tenant ID: {tenant.tenantId}
                        </Text>
                      }
                    />
                    <div style={{ marginTop: '0.5rem' }}>
                      {/* Role Tag */}
                      <Tag color={tenant.role === 'SUPER_ADMIN' ? 'magenta' : 'blue'}>
                        {tenant.role}
                      </Tag>
                      {isDefault && <Tag color="green">Default</Tag>}
                      {isCurrent && <Tag color="blue">Current</Tag>}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      </Col>
    </Row>
  );
}

export default ProfilePage;
