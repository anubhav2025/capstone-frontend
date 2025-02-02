// src/pages/FindingsPage.jsx
import { useState } from "react";
import { Select, Button, Table } from "antd";
import { useGetFindingsQuery } from "../store/findingsApi";
import FindingDrawer from "../components/FindingDrawer";

const toolOptions = ["DEPENDABOT", "CODE_SCAN", "SECRET_SCAN"];
const severityOptions = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
const stateOptions = [
  "OPEN",
  "FALSE_POSITIVE",
  "SUPPRESSED",
  "FIXED",
  "CONFIRMED",
];

function FindingsPage() {
  // Filter states
  const [toolType, setToolType] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [status, setStatus] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Whether the FindingDrawer is open and which finding is selected
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // RTK Query hook
  const { data, isLoading, refetch } = useGetFindingsQuery({
    toolType,
    severity,
    state: status,
    page,
    size,
  });

  // We'll assume the server returns something like:
  // { status: "success", findingsCount: number, findings: [...], ... }
  const findings = data?.findings ?? [];
  const totalCount = data?.findingsCount ?? 0;

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => text.slice(0, 8), // short id
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Tool Type",
      dataIndex: "toolType",
      key: "toolType",
    },
  ];

  // Handle row click
  const handleRowClick = (record) => {
    setSelectedFinding(record);
    setDrawerVisible(true);
  };

  // Pagination controls
  // We only have "previous page" if page > 0, "next page" if findingsCount == size
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    // If we got fewer than 'size' results, there's no next page
    if (findings.length === size) {
      setPage(page + 1);
    }
  };

  const isNextDisabled = findings.length < size;
  const isPrevDisabled = page === 0;

  return (
    <div style={{ padding: "16px" }}>
      <h2>Findings</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <Select
          placeholder="Tool Type"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setToolType(value || null)}
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
        >
          {stateOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={() => {
            setPage(0);
            refetch();
          }}
        >
          Filter
        </Button>
      </div>

      {/* Table of findings */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={findings}
        loading={isLoading}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        style={{ cursor: "pointer" }}
      />

      {/* Page bar at bottom */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <Button disabled={isPrevDisabled} onClick={handlePrevPage}>
          Prev
        </Button>
        <span>Page: {page + 1}</span>
        <Button disabled={isNextDisabled} onClick={handleNextPage}>
          Next
        </Button>
      </div>

      {/* Drawer for the selected finding */}
      <FindingDrawer
        visible={drawerVisible}
        finding={selectedFinding}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
}

export default FindingsPage;
