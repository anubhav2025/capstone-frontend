import React, { useState, useMemo } from 'react';
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

import { Select, Row, Col, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8854d0', '#f5cd79'];

function DashboardPage() {
  const navigate = useNavigate();

  // 1) Tool distribution
  const { data: toolDistData } = useGetToolDistributionQuery();
  // Build Pie data
  const pieData = (toolDistData || []).map(item => ({
    name: item.toolType,
    value: item.count,
  }));

  // Summation of all findings for a quick "KPI"
  const totalFindings = useMemo(() => {
    return (toolDistData || []).reduce((sum, item) => sum + item.count, 0);
  }, [toolDistData]);

  // On pie slice click => go to findings?toolType=...
  const handlePieClick = (sliceData) => {
    navigate(`/findings?toolType=${sliceData.name}`, { replace: false });
  };

  // 2) We have a dropdown for other bar charts
  const [selectedTool, setSelectedTool] = useState('CODE_SCAN');
  const { data: stateDistData } = useGetStateDistributionQuery(selectedTool);
  const { data: severityDistData } = useGetSeverityDistributionQuery(selectedTool);
  const { data: cvssData } = useGetCvssHistogramQuery();

  // Bar data
  const barStateData = (stateDistData || []).map(d => ({ name: d.state, count: d.count }));
  const barSeverityData = (severityDistData || []).map(d => ({ name: d.severity, count: d.count }));
  const barCvssData = (cvssData || []).map(d => ({
    bucket: d.bucket,
    name: `${d.bucket}-${d.bucket + 1}`,
    count: d.count,
  }));

  // Handlers for bar clicks
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

  // Pie label => show "Name (Value)"
  const renderCustomLabel = ({ name, value }) => `${name} (${value})`;

  return (
    <div style={{ padding: 24 }}>
      {/* Page Title */}
      <Title level={2} style={{ marginBottom: 0 }}>
        Security Dashboard
      </Title>
      <Text type="secondary">Overview of vulnerabilities, states, and severity</Text>

      {/* KPI Row (example) */}
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
        {/* Add more KPI cards as needed */}
      </Row>

      {/* Header row with the tool select */}
      <Row style={{ marginTop: 24, marginBottom: 16 }}>
        <Col xs={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              Distribution &amp; Histograms
            </Title>
            <Select
              style={{ width: 200 }}
              value={selectedTool}
              onChange={(val) => setSelectedTool(val)}
            >
              <Select.Option value="CODE_SCAN">CODE_SCAN</Select.Option>
              <Select.Option value="DEPENDABOT">DEPENDABOT</Select.Option>
              <Select.Option value="SECRET_SCAN">SECRET_SCAN</Select.Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
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
                    labelLine
                    label={renderCustomLabel}
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

        {/* State Bar */}
        <Col xs={24} md={12}>
          <Card title={`State Distribution (${selectedTool})`}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={barStateData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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

        {/* Severity Bar */}
        <Col xs={24} md={12}>
          <Card title={`Severity Distribution (${selectedTool})`}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={barSeverityData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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

        {/* CVSS histogram */}
        <Col xs={24} md={12}>
          <Card title="CVSS Score Histogram">
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={barCvssData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
