// // src/pages/Dashboard.jsx
// import React, { useMemo } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   useGetToolDistributionQuery,
//   useGetStateDistributionQuery,
//   useGetSeverityDistributionQuery,
//   useGetCvssHistogramQuery
// } from '../store/metricsApi';

// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as RechartsTooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
// } from 'recharts';

// import { Row, Col, Card, Typography } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Title, Text } = Typography;

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8854d0', '#f5cd79'];

// function DashboardPage() {
//   const navigate = useNavigate();
//   const userInfo = useSelector((state) => state.auth.userInfo);
//   const tenantId = userInfo?.currentTenantId || "";

//   // 1) Tool distribution => useGetToolDistributionQuery(tenantId)
//   // If your metricsApi is updated to accept tenantId, do so:
//   const { data: toolDistData } = useGetToolDistributionQuery(tenantId);

//   // Build pie data
//   const pieData = (toolDistData || []).map(item => ({
//     name: item.toolType,
//     value: item.count,
//   }));

//   // Summation
//   const totalFindings = useMemo(() => {
//     return (toolDistData || []).reduce((sum, item) => sum + item.count, 0);
//   }, [toolDistData]);

//   // On pie slice click => /findings?toolType=...
//   const handlePieClick = (sliceData) => {
//     navigate(`/findings?toolType=${sliceData.name}`, { replace: false });
//   };

//   // 2) We also have a "selectedTool" if you want
//   // For example, let's default to "CODE_SCAN"
//   const selectedTool = "CODE_SCAN";

//   // Then pass { tenantId, toolType: selectedTool }
//   const { data: stateDistData } = useGetStateDistributionQuery({ tenantId, toolType: selectedTool });
//   const { data: severityDistData } = useGetSeverityDistributionQuery({ tenantId, toolType: selectedTool });
//   const { data: cvssData } = useGetCvssHistogramQuery(tenantId); // if your endpoint uses just tenantId

//   // Format bar data
//   const barStateData = (stateDistData || []).map(d => ({ name: d.state, count: d.count }));
//   const barSeverityData = (severityDistData || []).map(d => ({ name: d.severity, count: d.count }));
//   const barCvssData = (cvssData || []).map(d => ({
//     bucket: d.bucket,
//     name: `${d.bucket}-${d.bucket + 1}`,
//     count: d.count,
//   }));

//   // On bar click => navigate
//   const handleStateBarClick = (barData) => {
//     navigate(`/findings?state=${barData.name}`, { replace: false });
//   };
//   const handleSeverityBarClick = (barData) => {
//     navigate(`/findings?severity=${barData.name}`, { replace: false });
//   };
//   const handleCvssBarClick = (barData) => {
//     const min = barData.bucket;
//     const max = barData.bucket + 1;
//     navigate(`/findings?cvssMin=${min}&cvssMax=${max}`, { replace: false });
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <Title level={2} style={{ marginBottom: 0 }}>
//         Security Dashboard
//       </Title>
//       <Text type="secondary">Overview of vulnerabilities, states, and severity</Text>

//       {/* KPI row */}
//       <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
//         <Col xs={24} sm={12} md={6}>
//           <Card bordered={false} style={{ background: '#f1f2f6' }}>
//             <Title level={5} style={{ margin: 0 }}>
//               Total Findings
//             </Title>
//             <Title level={3} style={{ margin: 0 }}>{totalFindings}</Title>
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card bordered={false} style={{ background: '#f1f2f6' }}>
//             <Title level={5} style={{ margin: 0 }}>Selected Tool</Title>
//             <Title level={3} style={{ margin: 0 }}>{selectedTool}</Title>
//           </Card>
//         </Col>
//       </Row>

//       <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
//         {/* Pie: Tool Distribution */}
//         <Col xs={24} md={12}>
//           <Card title="Tool Distribution">
//             <div style={{ width: '100%', height: 350 }}>
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     dataKey="value"
//                     nameKey="name"
//                     outerRadius={100}
//                     onClick={handlePieClick}
//                   >
//                     {pieData.map((entry, idx) => (
//                       <Cell
//                         key={`cell-${idx}`}
//                         fill={COLORS[idx % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <RechartsTooltip />
//                   <Legend
//                     layout="horizontal"
//                     verticalAlign="bottom"
//                     align="center"
//                     formatter={(value, entry) => `${value} (${entry.payload.value})`}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//         {/* State Distribution (Bar) */}
//         <Col xs={24} md={12}>
//           <Card title={`State Distribution (${selectedTool})`}>
//             <div style={{ width: '100%', height: 350 }}>
//               <ResponsiveContainer>
//                 <BarChart data={barStateData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <RechartsTooltip />
//                   <Legend />
//                   <Bar
//                     dataKey="count"
//                     fill="#8884d8"
//                     onClick={handleStateBarClick}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//         {/* Severity Distribution (Bar) */}
//         <Col xs={24} md={12}>
//           <Card title={`Severity Distribution (${selectedTool})`}>
//             <div style={{ width: '100%', height: 350 }}>
//               <ResponsiveContainer>
//                 <BarChart data={barSeverityData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <RechartsTooltip />
//                   <Legend />
//                   <Bar
//                     dataKey="count"
//                     fill="#82ca9d"
//                     onClick={handleSeverityBarClick}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//         {/* CVSS Histogram */}
//         <Col xs={24} md={12}>
//           <Card title="CVSS Score Histogram">
//             <div style={{ width: '100%', height: 350 }}>
//               <ResponsiveContainer>
//                 <BarChart data={barCvssData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <RechartsTooltip />
//                   <Legend />
//                   <Bar
//                     dataKey="count"
//                     fill="#d35400"
//                     onClick={handleCvssBarClick}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//       </Row>
//     </div>
//   );
// }

// export default DashboardPage;





import React, { useMemo, useState, useEffect } from 'react';
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

import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Select
} from 'antd';

import {
  DashboardOutlined,
  BugTwoTone,
  SafetyCertificateTwoTone,
  EyeInvisibleTwoTone,
  CheckCircleTwoTone,
  DatabaseTwoTone
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8854d0', '#f5cd79'];

function DashboardPage() {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const tenantId = userInfo?.currentTenantId || "";

  // 1) Fetch tool distribution for the PieChart and for building the tool selector
  const { data: toolDistData } = useGetToolDistributionQuery(tenantId);

  // Convert toolDistData => Pie data
  const pieData = useMemo(() => {
    return (toolDistData || []).map(item => ({
      name: item.toolType,
      value: item.count,
    }));
  }, [toolDistData]);

  // 2) Global Tool Selector (state)
  const [selectedTool, setSelectedTool] = useState('');

  // Auto-select the first tool when toolDistData arrives
  useEffect(() => {
    if (!selectedTool && toolDistData?.length) {
      setSelectedTool(toolDistData[0].toolType);
    }
  }, [selectedTool, toolDistData]);

  // 3) For the KPI cards (per tool)
  const totalFindingsForSelectedTool = useMemo(() => {
    if (!selectedTool || !toolDistData) return 0;
    const found = toolDistData.find(t => t.toolType === selectedTool);
    return found?.count ?? 0;
  }, [toolDistData, selectedTool]);

  // 4) Fetch distribution data for the selected tool
  // Skip queries if no selectedTool is set
  const { data: stateDistData } = useGetStateDistributionQuery(
    { tenantId, toolType: selectedTool },
    { skip: !selectedTool }
  );
  const { data: severityDistData } = useGetSeverityDistributionQuery(
    { tenantId, toolType: selectedTool },
    { skip: !selectedTool }
  );

  // 5) CVSS histogram for the entire tenant (no tool filter)
  const { data: cvssData } = useGetCvssHistogramQuery(tenantId);

  // Convert data => Bar data
  const barStateData = (stateDistData || []).map(d => ({ name: d.state, count: d.count }));
  const barSeverityData = (severityDistData || []).map(d => ({ name: d.severity, count: d.count }));
  const barCvssData = (cvssData || []).map(d => ({
    bucket: d.bucket,
    name: `${d.bucket}-${d.bucket + 1}`,
    count: d.count,
  }));

  // KPI extraction for the SELECTED tool
  const openCount = (stateDistData || []).find(s => s.state === 'OPEN')?.count ?? 0;
  const fixedCount = (stateDistData || []).find(s => s.state === 'FIXED')?.count ?? 0;
  const suppressedCount = (stateDistData || []).find(s => s.state === 'SUPPRESSED')?.count ?? 0;
  const falsePositiveCount = (stateDistData || []).find(s => s.state === 'FALSE_POSITIVE')?.count ?? 0;

  // Calculate the total across all tools (for the first KPI card)
  const totalFindings = useMemo(() => {
    return (toolDistData || []).reduce((sum, item) => sum + item.count, 0);
  }, [toolDistData]);

  // Handlers for chart click
  const handlePieClick = (sliceData) => {
    navigate(`/findings?toolType=${sliceData.name}`, { replace: false });
  };
  const handleStateBarClick = (barData) => {
    navigate(`/findings?toolType=${selectedTool}&state=${barData.name}`, { replace: false });
  };
  const handleSeverityBarClick = (barData) => {
    navigate(`/findings?toolType=${selectedTool}&severity=${barData.name}`, { replace: false });
  };
  const handleCvssBarClick = (barData) => {
    const min = barData.bucket;
    const max = barData.bucket + 1;
    navigate(`/findings?cvssMin=${min}&cvssMax=${max}`, { replace: false });
  };

  // Global tool selector UI (in the top-right)
  const globalToolSelector = (
    <Select
      style={{ width: 200 }}
      placeholder="Select a tool"
      value={selectedTool || undefined}
      onChange={value => setSelectedTool(value)}
    >
      {(toolDistData || []).map(toolObj => (
        <Option key={toolObj.toolType} value={toolObj.toolType}>
          {toolObj.toolType}
        </Option>
      ))}
    </Select>
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Header Row: Dashboard Title + Global Tool Selector */}
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ marginBottom: 0 }}>
            <DashboardOutlined style={{ marginRight: 8 }} />
            Security Dashboard
          </Title>
          <Text type="secondary">
            High-level overview of vulnerabilities, states, and severity
          </Text>
        </Col>
        <Col>
          {globalToolSelector}
        </Col>
      </Row>

      {/* KPI row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* TOTAL FINDINGS (all tools) */}
        <Col xs={24} sm={12} md={4}>
          <Card style={{ backgroundColor: '#fff', borderLeft: '4px solid #1890ff' }}>
            <Statistic
              title="TOTAL FINDINGS"
              value={totalFindings}
              prefix={<DatabaseTwoTone twoToneColor="#1890ff" />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>

        {/* OPEN (Selected Tool) */}
        <Col xs={24} sm={12} md={4}>
          <Card style={{ backgroundColor: '#fff', borderLeft: '4px solid #3b5998' }}>
            <Statistic
              title="OPEN"
              value={openCount}
              prefix={<BugTwoTone twoToneColor="#3b5998" />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>

        {/* FIXED (Selected Tool) */}
        <Col xs={24} sm={12} md={4}>
          <Card style={{ backgroundColor: '#fff', borderLeft: '4px solid #52c41a' }}>
            <Statistic
              title="FIXED"
              value={fixedCount}
              prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>

        {/* SUPPRESSED (Selected Tool) */}
        <Col xs={24} sm={12} md={4}>
          <Card style={{ backgroundColor: '#fff', borderLeft: '4px solid #faad14' }}>
            <Statistic
              title="SUPPRESSED"
              value={suppressedCount}
              prefix={<EyeInvisibleTwoTone twoToneColor="#faad14" />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>

        {/* FALSE POSITIVE (Selected Tool) */}
        <Col xs={24} sm={12} md={4}>
          <Card style={{ backgroundColor: '#fff', borderLeft: '4px solid #eb2f96' }}>
            <Statistic
              title="FALSE POSITIVE"
              value={falsePositiveCount}
              prefix={<SafetyCertificateTwoTone twoToneColor="#eb2f96" />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Pie: Tool Distribution (all tools) */}
        <Col xs={24} md={12}>
          <Card title="Tool Distribution" hoverable>
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
                        style={{ cursor: 'pointer' }}
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

        {/* State Distribution (Selected Tool) */}
        <Col xs={24} md={12}>
          <Card title={`State Distribution (${selectedTool || 'N/A'})`} hoverable>
            <div style={{ width: '100%', height: 350 }}>
              {selectedTool ? (
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
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', marginTop: 80 }}>
                  <Text type="secondary">Select a tool to see State Distribution.</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Severity Distribution (Selected Tool) */}
        <Col xs={24} md={12}>
          <Card title={`Severity Distribution (${selectedTool || 'N/A'})`} hoverable>
            <div style={{ width: '100%', height: 350 }}>
              {selectedTool ? (
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
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', marginTop: 80 }}>
                  <Text type="secondary">Select a tool to see Severity Distribution.</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* CVSS Score Histogram (all tools) */}
        <Col xs={24} md={12}>
          <Card title="CVSS Score Histogram (All Tools)" hoverable>
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
                    style={{ cursor: 'pointer' }}
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
