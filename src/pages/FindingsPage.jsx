import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Select, Button, Table, Pagination, Tag } from 'antd';
import {
  useGetAlertStatesAndReasonsQuery,
  useLazyGetFindingsQuery,
  useTriggerScanMutation
} from "../store/findingsApi";
import PageHeader from '../components/PageHeader';
import FindingDrawer from '../components/FindingDrawer';
import { useSelector } from 'react-redux';

const toolOptions = ['DEPENDABOT', 'CODE_SCAN', 'SECRET_SCAN'];
const severityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const stateOptions = ['OPEN', 'FALSE_POSITIVE', 'SUPPRESSED', 'FIXED', 'CONFIRMED'];

// Color maps for severity and state
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

const severityOrder = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
  INFO: 0,
};

function FindingsPage() {
  const navigate = useNavigate();
  const { id: findingIdParam } = useParams();  // e.g. "123abc"

  const [searchParams, setSearchParams] = useSearchParams();

  // Local states, synced with query params
  const [toolType, setToolType] = useState(searchParams.get('toolType') || null);
  const [severity, setSeverity] = useState(searchParams.get('severity') || null);
  const [status, setStatus] = useState(searchParams.get('state') || null);

  const pageQ = parseInt(searchParams.get('page') || '1', 10);
  const sizeQ = parseInt(searchParams.get('size') || '10', 10);
  const [page, setPage] = useState(pageQ);
  const [size, setSize] = useState(sizeQ);

  // =========================
  // NEW: Tools to scan
  // =========================
  // Suppose we allow multiple selection.  We default to ['ALL'] or an empty array.
  const [scanTools, setScanTools] = useState([]);

  // Drawer states => if findingIdParam is present => drawer open
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(!!findingIdParam);

  // Lazy query for fetching findings
  const [fetchFindings, { data, isLoading }] = useLazyGetFindingsQuery();
  const findings = data?.findings ?? [];
  const totalCount = data?.findingsTotal ?? 0;

  const [triggerScan, { isLoading: scanLoading }] = useTriggerScanMutation();
  const { data: toolMetadata } = useGetAlertStatesAndReasonsQuery();

  const userInfo = useSelector(state => state.auth.userInfo);
  var canScan = ["SUPER_ADMIN", "ADMIN"].some(str => userInfo.roles.includes(str));
  var canEdit = userInfo.roles.includes("SUPER_ADMIN");
 

  // Fetch on mount / filters change
  useEffect(() => {
    const fetchParams = {
      toolType: toolType || undefined,
      severity: severity || undefined,
      state: status || undefined,
      page: page - 1, // backend 0-based
      size
    };
    fetchFindings(fetchParams);
  }, [toolType, severity, status, page, size, fetchFindings]);

  // Sync local filters -> URL query
  useEffect(() => {
    const sp = new URLSearchParams();
    if (toolType) sp.set('toolType', toolType);
    if (severity) sp.set('severity', severity);
    if (status) sp.set('state', status);
    sp.set('page', page.toString());
    sp.set('size', size.toString());
    setSearchParams(sp);
  }, [toolType, severity, status, page, size, setSearchParams]);

  // If there's a route param => find that finding
  useEffect(() => {
    if (findingIdParam) {
      const found = findings.find(f => f.id.startsWith(findingIdParam));
      if (found) {
        setSelectedFinding(found);
        setDrawerVisible(true);
      }
    } else {
      // no :id => close drawer
      setDrawerVisible(false);
      setSelectedFinding(null);
    }
  }, [findingIdParam, findings]);

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => text.slice(0, 8),
      sorter: (a, b) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      sorter: (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
      sortDirections: ['ascend', 'descend'],
      render: (value) => {
        const color = severityColorMap[value] || 'default';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      sorter: (a, b) => a.state.localeCompare(b.state),
      sortDirections: ['ascend', 'descend'],
      render: (value) => {
        const color = stateColorMap[value] || 'default';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'Tool Type',
      dataIndex: 'toolType',
      key: 'toolType',
    },
  ];

  // On row click => navigate => set param to that ID
  const handleRowClick = (record) => {
    navigate(`/findings/${record.id.slice(0,8)}${window.location.search}`);
  };

  // Pagination
  const onPaginationChange = (newPage, newPageSize) => {
    setPage(newPage);
    setSize(newPageSize);
  };

  // Filter button => reset to page=1
  const handleFilter = () => {
    setPage(1);
  };

  // Trigger scan
  const handleScan = async () => {
    try {
      await triggerScan(scanTools).unwrap(); 
      // re-fetch after scan if you want
      fetchFindings({
        toolType,
        severity,
        state: status,
        page: page - 1,
        size
      });
    } catch (err) {
      console.error('Scan failed', err);
    }
  };

  const handleDrawerClose = () => {
    // user closes the drawer => navigate back to /findings with same query
    navigate(`/findings${window.location.search}`);
  };

  // Options for the multi-select 
  const scanToolOptions = ['ALL', 'DEPENDABOT', 'CODESCAN', 'SECRETSCAN'];

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
              // If user chooses "ALL", maybe automatically replace array with just ['ALL'] 
              // or allow multiple values. It’s up to you how you want "ALL" to behave.
              if (val.includes('ALL')) {
                setScanTools(['ALL']);
              } else {
                setScanTools(val);
              }
            }}
          >
            {scanToolOptions.map((opt) => (
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
          onClick: () => handleRowClick(record),
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
