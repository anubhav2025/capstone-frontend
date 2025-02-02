// src/components/FindingDrawer.jsx
import React from "react";
import { Drawer, Descriptions, Tag } from "antd";

function FindingDrawer({ visible, onClose, finding }) {
  if (!finding) {
    return null;
  }

  const {
    id,
    title,
    desc,
    severity,
    state,
    url,
    toolType,
    cves,
    cwes,
    cvss,
    filePath,
    componentName,
    componentVersion,
    type,
    suggestions,
  } = finding;

  // Map severity to color
  const severityColor =
    severity === "CRITICAL"
      ? "red"
      : severity === "HIGH"
      ? "volcano"
      : severity === "MEDIUM"
      ? "orange"
      : severity === "LOW"
      ? "blue"
      : "green";

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      title="Finding Details"
      placement="right"
      width={500}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{id}</Descriptions.Item>
        <Descriptions.Item label="Title">{title}</Descriptions.Item>
        <Descriptions.Item label="Severity">
          <Tag color={severityColor}>{severity}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="State">{state}</Descriptions.Item>
        <Descriptions.Item label="Tool">{toolType}</Descriptions.Item>
        <Descriptions.Item label="File Path">{filePath}</Descriptions.Item>
        <Descriptions.Item label="Component Name">
          {componentName}
        </Descriptions.Item>
        <Descriptions.Item label="Component Version">
          {componentVersion}
        </Descriptions.Item>
        <Descriptions.Item label="CVSS">{cvss}</Descriptions.Item>
        <Descriptions.Item label="CWE">
          {(cwes || []).join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="URL">
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Description">{desc}</Descriptions.Item>
        <Descriptions.Item label="Suggestions">{suggestions}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
}

export default FindingDrawer;
