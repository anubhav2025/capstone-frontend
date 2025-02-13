// src/components/StateChangeModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message } from "antd";
import { useSelector } from "react-redux";                // <-- Import from react-redux
import { useUpdateAlertStateMutation } from "../store/findingsApi";

function StateChangeModal({ open, onClose, finding, toolMetadata }) {
  const [newState, setNewState] = useState("");
  const [reason, setReason] = useState("");

  // 1) Access Redux to get the userInfo with currentTenantId
  const userInfo = useSelector(state => state.auth.userInfo);
  const tenantId = userInfo?.currentTenantId; // e.g. "T1"

  const [updateAlertState, { isLoading }] = useUpdateAlertStateMutation();

  if (!finding || !toolMetadata) {
    return null;
  }

  const toolType = finding.toolType;
  const metaForTool = toolMetadata[toolType];

  // Example: parse alertNumber from the URL or from additional props in the finding
  const number = finding.url.split("/").pop();
  // The old approach had owner, repo. Possibly you no longer need them if multi-tenant 
  // but let's keep them for demonstration if your back-end still needs them.
  // const owner = finding.toolAdditionalProperties?.owner || "anubhav2025";
  // const repo = finding.toolAdditionalProperties?.repository || "juice-shop";

  let possibleStates = metaForTool.states || [];
  let reasonOptions = [];
  let showReason = false;

  // If user picks "RESOLVED"/"DISMISSED", show reasons
  if (toolType === "SECRET_SCAN") {
    reasonOptions = metaForTool.resolvedReasons || [];
    if (newState.toLowerCase() === "resolved") {
      showReason = true;
    }
  } else if (toolType === "DEPENDABOT" || toolType === "CODE_SCAN") {
    reasonOptions = metaForTool.dismissedReasons || [];
    if (newState.toLowerCase() === "dismissed") {
      showReason = true;
    }
  }

  useEffect(() => {
    if (open) {
      setNewState("");
      setReason("");
    }
  }, [open]);

  const handleOk = async () => {
    try {
      // 2) Build request body
      const requestBody = {
        tenantId,
        alertNumber: number,
        newState,
        reason,
        toolType
      };

      // 3) call the RTK mutation, passing {tenantId, ...rest}
      if (!tenantId) {
        message.error("No tenantId found. Please select a tenant first.");
        return;
      }

      await updateAlertState({
        tenantId,     
        alertNumber: number,
        newState,
        reason,
        toolType
      }).unwrap();

      message.success("State update triggered successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to update state: " + (err?.data?.error || err?.message));
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
