// src/pages/Dashboard.jsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetToolDistributionQuery,
  useGetStateDistributionQuery,
  useGetSeverityDistributionQuery,
  useGetCvssHistogramQuery
} from '../store/metricsApi';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

import { Row, Col, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8854d0', '#f5cd79'];

function DashboardPage() {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const tenantId = userInfo?.currentTenantId || "";

  // 1) Tool distribution => useGetToolDistributionQuery(tenantId)
  // If your metricsApi is updated to accept tenantId, do so:
  const { data: toolDistData } = useGetToolDistributionQuery(tenantId);

  // Build pie data
  const pieData = (toolDistData || []).map(item => ({
    name: item.toolType,
    value: item.count,
  }));

  // Summation
  const totalFindings = useMemo(() => {
    return (toolDistData || []).reduce((sum, item) => sum + item.count, 0);
  }, [toolDistData]);

  // On pie slice click => /findings?toolType=...
  const handlePieClick = (sliceData) => {
    navigate(`/findings?toolType=${sliceData.name}`, { replace: false });
  };

  // 2) We also have a "selectedTool" if you want
  // For example, let's default to "CODE_SCAN"
  const selectedTool = "CODE_SCAN";

  // Then pass { tenantId, toolType: selectedTool }
  const { data: stateDistData } = useGetStateDistributionQuery({ tenantId, toolType: selectedTool });
  const { data: severityDistData } = useGetSeverityDistributionQuery({ tenantId, toolType: selectedTool });
  const { data: cvssData } = useGetCvssHistogramQuery(tenantId); // if your endpoint uses just tenantId

  // Format bar data
  const barStateData = (stateDistData || []).map(d => ({ name: d.state, count: d.count }));
  const barSeverityData = (severityDistData || []).map(d => ({ name: d.severity, count: d.count }));
  const barCvssData = (cvssData || []).map(d => ({
    bucket: d.bucket,
    name: `${d.bucket}-${d.bucket + 1}`,
    count: d.count,
  }));

  // On bar click => navigate
  const handleStateBarClick = (barData) => {
    navigate(`/findings?state=${barData.name}`, { replace: false });
  };
  const handleSeverityBarClick = (barData) => {
    navigate(`/findings?severity=${barData.name}`, { replace: false });
  };
  const handleCvssBarClick = (barData) => {
    const min = barData.bucket;
    const max = barData.bucket + 1;
    navigate(`/findings?cvssMin=${min}&cvssMax=${max}`, { replace: false });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 0 }}>
        Security Dashboard
      </Title>
      <Text type="secondary">Overview of vulnerabilities, states, and severity</Text>

      {/* KPI row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#f1f2f6' }}>
            <Title level={5} style={{ margin: 0 }}>
              Total Findings
            </Title>
            <Title level={3} style={{ margin: 0 }}>{totalFindings}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#f1f2f6' }}>
            <Title level={5} style={{ margin: 0 }}>Selected Tool</Title>
            <Title level={3} style={{ margin: 0 }}>{selectedTool}</Title>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Pie: Tool Distribution */}
        <Col xs={24} md={12}>
          <Card title="Tool Distribution">
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    onClick={handlePieClick}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value, entry) => `${value} (${entry.payload.value})`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* State Distribution (Bar) */}
        <Col xs={24} md={12}>
          <Card title={`State Distribution (${selectedTool})`}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={barStateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    onClick={handleStateBarClick}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Severity Distribution (Bar) */}
        <Col xs={24} md={12}>
          <Card title={`Severity Distribution (${selectedTool})`}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={barSeverityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#82ca9d"
                    onClick={handleSeverityBarClick}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* CVSS Histogram */}
        <Col xs={24} md={12}>
          <Card title="CVSS Score Histogram">
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={barCvssData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#d35400"
                    onClick={handleCvssBarClick}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

export default DashboardPage;
