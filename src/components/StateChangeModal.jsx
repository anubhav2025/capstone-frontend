// src/components/StateChangeModal.jsx

import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message } from "antd";
import { useUpdateAlertStateMutation } from "../store/findingsApi";

function StateChangeModal({ open, onClose, finding, toolMetadata }) {
  // We'll track local user selections
  const [newState, setNewState] = useState("");
  const [reason, setReason] = useState("");
//   console.log(finding)

  const [updateAlertState, { isLoading }] = useUpdateAlertStateMutation();

  if (!finding || !toolMetadata) {
    return null;
  }

  // The "toolType" => "CODE_SCAN","DEPENDABOT","SECRET_SCAN"
  const toolType = finding.toolType;
  const metaForTool = toolMetadata[toolType]; // e.g. { states, dismissedReasons } or resolvedReasons

  // If the parser or tool-scheduler stores "owner"/"repo" in toolAdditionalProperties:
  const number = finding.url.split('/').pop(); 
  const owner = finding.toolAdditionalProperties?.owner || "anubhav2025";
  const repo = finding.toolAdditionalProperties?.repository || "juice-shop";

  // We also consider how to display reasons. Dependabot/Code => "dismissedReasons"
  // Secret => "resolvedReasons"
  let possibleStates = metaForTool.states; // e.g. ["OPEN","DISMISSED"] or ["OPEN","RESOLVED"]
  let reasonOptions = [];
  let showReason = false;

  // If user picks "DISMISSED"/"RESOLVED", we show the reason dropdown
  if (toolType === "SECRET_SCAN") {
    // e.g. "resolvedReasons": [...]
    reasonOptions = metaForTool.resolvedReasons;
    if (newState.toLowerCase() === "resolved") {
      showReason = true;
    }
  } else if (toolType === "DEPENDABOT" || toolType === "CODE_SCAN") {
    // e.g. "dismissedReasons": [...]
    reasonOptions = metaForTool.dismissedReasons;
    if (newState.toLowerCase() === "dismissed") {
      showReason = true;
    }
  }

  // Reset form whenever the modal opens
  useEffect(() => {
    if (open) {
      setNewState("");
      setReason("");
    }
  }, [open]);

  const handleOk = async () => {
    try {
      // Build the request
      const body = {
        owner,
        repo,
        toolType,     // "CODE_SCAN","DEPENDABOT","SECRET_SCAN"
        alertNumber: number,
        newState,
        reason,
      };
      console.log(body)

      console.log("hello1");
      await updateAlertState(body).unwrap();
      console.log("hello2");

      message.success("State update triggered successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to update state: " + err);
    }
  };

  return (
    <Modal
      title="Change Alert State"
      visible={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={isLoading}
          onClick={handleOk}
        >
          Confirm
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>New State</label>
        <Select
          value={newState}
          style={{ width: "100%" }}
          onChange={(val) => setNewState(val)}
          placeholder="Select a new state"
        >
          {possibleStates.map((st) => (
            <Select.Option key={st} value={st}>
              {st}
            </Select.Option>
          ))}
        </Select>
      </div>

      {showReason && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Reason</label>
          <Select
            value={reason}
            style={{ width: "100%" }}
            onChange={(val) => setReason(val)}
            placeholder="Select a reason"
          >
            {reasonOptions.map((r) => (
              <Select.Option key={r} value={r}>
                {r}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </Modal>
  );
}

export default StateChangeModal;
