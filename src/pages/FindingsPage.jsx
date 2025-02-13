// src/pages/FindingsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Select, Button, Table, Pagination, Tag, message } from 'antd';
import { useSelector } from 'react-redux';

import {
  useLazyGetFindingsQuery,
  useTriggerScanMutation,
  useGetAlertStatesAndReasonsQuery
} from "../store/findingsApi";

import PageHeader from '../components/PageHeader';
import FindingDrawer from '../components/FindingDrawer';

const toolOptions = ['DEPENDABOT', 'CODE_SCAN', 'SECRET_SCAN'];
const severityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const stateOptions = ['OPEN', 'FALSE_POSITIVE', 'SUPPRESSED', 'FIXED', 'CONFIRMED'];

// Example color maps
const severityColorMap = {
  CRITICAL: 'red',
  HIGH: 'volcano',
  MEDIUM: 'orange',
  LOW: 'green',
  INFO: 'blue',
};

const stateColorMap = {
  OPEN: 'magenta',
  FALSE_POSITIVE: 'geekblue',
  SUPPRESSED: 'volcano',
  FIXED: 'green',
  CONFIRMED: 'gold',
};

function FindingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ADDED/CHANGED FOR MULTI-TENANCY:
  // We read the currently selected tenant from Redux
  const currentTenantId = useSelector((state) => state.auth.userInfo.currentTenantId);
  const userInfo = useSelector(state => state.auth.userInfo);


  // 1) find the tenant object for currentTenantId
const currentTenantObj = userInfo?.tenants?.find(
  (t) => t.tenantId === userInfo.currentTenantId
);

// 2) the user’s role in this tenant
const currentTenantRole = currentTenantObj?.role; // e.g. "SUPER_ADMIN"

  // Determine user roles => canScan or canEdit
  const canScan = ["SUPER_ADMIN", "ADMIN"].includes(currentTenantRole);
  const canEdit = (currentTenantRole === "SUPER_ADMIN");

  // Query param states
  const [toolType, setToolType] = useState(searchParams.get('toolType') || null);
  const [severity, setSeverity] = useState(searchParams.get('severity') || null);
  const [status, setStatus] = useState(searchParams.get('state') || null);

  const pageQ = parseInt(searchParams.get('page') || '1', 10);
  const sizeQ = parseInt(searchParams.get('size') || '10', 10);
  const [page, setPage] = useState(pageQ);
  const [size, setSize] = useState(sizeQ);

  // We can fetch data with lazy query
  const [fetchFindings, { data, isLoading }] = useLazyGetFindingsQuery();
  const [triggerScan, { isLoading: scanLoading }] = useTriggerScanMutation();
  const { data: toolMetadata } = useGetAlertStatesAndReasonsQuery();

  // local states for scanning
  const [scanTools, setScanTools] = useState([]);

  // On mount or whenever filters/tenantId changes
  useEffect(() => {
    // If no tenantId is selected, we might skip or fallback
    if (!currentTenantId) return;

    fetchFindings({
      tenantId: currentTenantId,
      toolType,
      severity,
      state: status,
      page: page - 1, // 0-based on server
      size
    });
  }, [currentTenantId, toolType, severity, status, page, size, fetchFindings]);

  // Sync to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (toolType) sp.set('toolType', toolType);
    if (severity) sp.set('severity', severity);
    if (status) sp.set('state', status);
    sp.set('page', page.toString());
    sp.set('size', size.toString());
    setSearchParams(sp);
  }, [toolType, severity, status, page, size, setSearchParams]);

  const findings = data?.findings || [];
  const totalCount = data?.findingsTotal || 0;

  const handleFilter = () => {
    setPage(1);
    // triggers the effect => re-fetch
  };

  const handleRowClick = (record) => {
    navigate(`/findings/${record.id.slice(0,8)}${window.location.search}`);
  };

  const onPaginationChange = (newPage, newPageSize) => {
    setPage(newPage);
    setSize(newPageSize);
  };

  // columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => text.slice(0, 8),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (value) => <Tag color={severityColorMap[value] || 'default'}>{value}</Tag>,
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (value) => <Tag color={stateColorMap[value] || 'default'}>{value}</Tag>,
    },
    {
      title: 'Tool Type',
      dataIndex: 'toolType',
      key: 'toolType',
    },
  ];

  // For the drawer
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedFinding(null);
    // remove the /:id from the route => e.g. navigate to /findings
    navigate(`/findings${window.location.search}`);
  };

  const handleScan = async () => {
    if (!currentTenantId) {
      message.warn("Please select a tenant before scanning.");
      return;
    }
    try {
      await triggerScan({
        tenantId: currentTenantId,
        tools: scanTools.length ? scanTools : ['ALL']
      }).unwrap();
      message.success("Scan triggered successfully!");

      // optionally re-fetch
      fetchFindings({
        tenantId: currentTenantId,
        toolType,
        severity,
        state: status,
        page: page - 1,
        size
      });
    } catch (err) {
      console.error(err);
      message.error("Scan trigger failed.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <PageHeader title="Findings" />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'space-between'
      }}>
        {/* Left side: filters */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Select
            placeholder="Tool Type"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setToolType(value || null)}
            value={toolType || undefined}
          >
            {toolOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Severity"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setSeverity(value || null)}
            value={severity || undefined}
          >
            {severityOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="State"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setStatus(value || null)}
            value={status || undefined}
          >
            {stateOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>

          <Button onClick={handleFilter}>Filter</Button>
        </div>

        {/* Right side: scan tools selector + Scan button */}
        {canScan && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Select
              mode="multiple"
              placeholder="Select scan tools"
              style={{ minWidth: 180 }}
              value={scanTools}
              onChange={(val) => {
                if (val.includes('ALL')) {
                  setScanTools(['ALL']);
                } else {
                  setScanTools(val);
                }
              }}
            >
              {['ALL','DEPENDABOT','CODESCAN','SECRETSCAN'].map((opt) => (
                <Select.Option key={opt} value={opt}>
                  {opt}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              loading={scanLoading}
              onClick={handleScan}
            >
              Scan
            </Button>
          </div>
        )}
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={findings}
        loading={isLoading}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            setSelectedFinding(record);
            setDrawerVisible(true);
            navigate(`/findings/${record.id.slice(0,8)}${window.location.search}`);
          },
        })}
        style={{ cursor: 'pointer' }}
      />

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={page}
          pageSize={size}
          total={totalCount}
          onChange={onPaginationChange}
          showSizeChanger
          showQuickJumper
        />
      </div>

      <FindingDrawer
        visible={drawerVisible}
        finding={selectedFinding}
        onClose={handleDrawerClose}
        toolMetadata={toolMetadata}
        canEdit={canEdit}
      />
    </div>
  );
}

export default FindingsPage;
