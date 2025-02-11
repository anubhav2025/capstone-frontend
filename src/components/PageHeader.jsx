// src/components/PageHeader.jsx
import React from 'react';
import { Typography } from 'antd';

function PageHeader({ title }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </div>
  );
}

export default PageHeader;
