import { Modal, Descriptions, Tag, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";

function SingleTicketModal({ open, onClose, ticket, loading, onMarkDone, isUpdating }) {
  const navigate = useNavigate();

  const handleBackToFinding = () => {
    if (ticket?.findingId) {
      navigate(`/findings/${ticket.findingId}`);
    }
  };

  return (
    <Modal
      title="Ticket Details"
      visible={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <div
        style={{
          display: "flex",
          height: "150px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
      ) : !ticket ? (
        <div>No ticket data found.</div>
      ) : (
        <>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Ticket ID">{ticket.ticketId}</Descriptions.Item>
            <Descriptions.Item label="Issue Type">{ticket.issueTypeName}</Descriptions.Item>
            <Descriptions.Item label="Issue Type Description">
              {ticket.issueTypeDescription}
            </Descriptions.Item>
            <Descriptions.Item label="Summary">{ticket.summary}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={ticket.statusName === "Done" ? "green" : "blue"}>
                {ticket.statusName}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <div>
              {ticket.findingId && (
                <Button type="dashed" onClick={handleBackToFinding}>
                  Back to Finding
                </Button>
              )}
            </div>
            <div>
              {ticket.statusName !== "Done" && (
                <Button type="primary" loading={isUpdating} onClick={onMarkDone}>
                  Mark as Done
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

export { SingleTicketModal };
