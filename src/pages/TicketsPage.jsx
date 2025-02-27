// src/pages/TicketsPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import {
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useUpdateTicketToDoneMutation
} from "../store/ticketApi";
import { SingleTicketModal } from "../components/SingleTicketModal";

function TicketsPage() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const tenantId = userInfo?.currentTenantId;
  const navigate = useNavigate();
  const { ticketId } = useParams();

  // 1) fetch the entire ticket list
  const { data: tickets, isLoading, isError, error, refetch } = useGetAllTicketsQuery(tenantId, {
    skip: !tenantId,
  });

  // 2) fetch the single ticket if ticketId is present
  const skipSingleFetch = !tenantId || !ticketId;
  const {
    data: singleTicket,
    isFetching: singleLoading,
    isError: singleErr,
  } = useGetTicketByIdQuery({ tenantId, ticketId }, { skip: skipSingleFetch });

  // 3) for updating status
  const [updateTicketToDone, { isLoading: isUpdating }] = useUpdateTicketToDoneMutation();

  // control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // open/close the modal based on whether we have a ticketId
  useEffect(() => {
    if (!ticketId) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }, [ticketId]);

  if (!tenantId) {
    return <div>Please select a tenant first.</div>;
  }
  if (isLoading) return <Spin />;
  if (isError) {
    console.error(error);
    message.error("Failed to fetch tickets.");
  }

  const handleRowClick = (record) => {
    navigate(`/tickets/${record.ticketId}`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/tickets");
  };

  const handleMarkDone = async (ticket) => {
    try {
      await updateTicketToDone({
        tenantId,
        ticketId: ticket.ticketId,
      }).unwrap();
      message.success(`Ticket ${ticket.ticketId} marked as Done!`);
      refetch();
      handleModalClose();
    } catch (err) {
      console.error(err);
      message.error(`Failed to mark ticket ${ticket.ticketId} as Done.`);
    }
  };

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
    },
    {
      title: "Issue Type",
      dataIndex: "issueTypeName",
    },
    {
      title: "Summary",
      dataIndex: "summary",
    },
    {
      title: "Status",
      dataIndex: "statusName",
      render: (text) => <Tag color={text === "Done" ? "green" : "blue"}>{text}</Tag>,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>All Tickets</h2>
      <Table
        rowKey="ticketId"
        columns={columns}
        dataSource={tickets || []}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        pagination={{ pageSize: 10 }}
        style={{ cursor: "pointer" }}
      />

      <Outlet />

      {/* Modal for the single ticket */}
      <SingleTicketModal
        open={isModalOpen}
        onClose={handleModalClose}
        ticket={singleTicket}
        loading={singleLoading}
        onMarkDone={() => singleTicket && handleMarkDone(singleTicket)}
        isUpdating={isUpdating}
      />
    </div>
  );
}

export default TicketsPage;
