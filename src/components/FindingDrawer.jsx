// src/components/FindingDrawer.jsx

import React, { useState } from "react";
import { Drawer, Descriptions, Tag, Button } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import StateChangeModal from "./StateChangeModal";  // <-- new file to create

function FindingDrawer({ visible, onClose, finding, toolMetadata, canEdit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    cwes,
    cvss,
    filePath,
    componentName,
    componentVersion,
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

  const handleEditState = () => {
    setIsModalOpen(true);
  };

  return (
    <>
    
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
        <Descriptions.Item label="State">{state} {/* Edit State Button */}
         {canEdit && (
          <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleEditState}>
            Edit State
          </Button>
        </div>
         )}
      </Descriptions.Item>
        <Descriptions.Item label="Tool">{toolType}</Descriptions.Item>
        <Descriptions.Item label="File Path">{filePath}</Descriptions.Item>
        <Descriptions.Item label="Component Name">
          {componentName}
        </Descriptions.Item>
        <Descriptions.Item label="Component Version">
          {componentVersion}
        </Descriptions.Item>
        <Descriptions.Item label="CVSS">{cvss}</Descriptions.Item>
        <Descriptions.Item label="CWE">{(cwes || []).join(", ")}</Descriptions.Item>
        <Descriptions.Item label="URL">
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          <ReactMarkdown children={desc} remarkPlugins={[remarkGfm]} />
        </Descriptions.Item>
        <Descriptions.Item label="Suggestions">{suggestions}</Descriptions.Item>
      </Descriptions>

      

      {/* The modal for state changes */}
      <StateChangeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        finding={finding}
        toolMetadata={toolMetadata}
      />
    </Drawer>
    </>
  );
}

export default FindingDrawer;
