// src/components/CreateTicketModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message } from "antd";
import { useSelector } from "react-redux";
import { useCreateTicketMutation } from "../store/ticketApi";

function CreateTicketModal({ open, onClose, finding }) {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const tenantId = userInfo?.currentTenantId;

  const [createTicket, { isLoading }] = useCreateTicketMutation();

  useEffect(() => {
    if (open) {
      setSummary(finding?.title);
      setDescription(finding?.desc);
    }
  }, [open]);

  if (!finding) {
    return null;
  }

  const handleCreate = async () => {
    if (!tenantId) {
      message.error("No tenant selected.");
      return;
    }
    try {
      await createTicket({
        tenantId,
        findingId: finding.id,
        summary,
        description,
      }).unwrap();
      message.success("Ticket created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to create ticket.");
    }
  };

  return (
    <Modal
      title="Create Ticket"
       open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="create" type="primary" loading={isLoading} onClick={handleCreate}>
          Create
        </Button>,
      ]}
    >
      <p>Finding ID: {finding.id}</p>
      <div style={{ marginBottom: 16 }}>
        <label>Summary</label>
        <Input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter ticket summary"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Description</label>
        <Input.TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter ticket description"
        />
      </div>
    </Modal>
  );
}

export default CreateTicketModal;
