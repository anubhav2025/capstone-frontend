import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Switch,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Typography,
  Card,
  Divider,
  Popconfirm,
  Space
} from "antd";
import { useSelector } from "react-redux";
import {
  useGetRunbooksForTenantQuery,
  useCreateRunbookMutation,
  useSetRunbookEnabledMutation,
  useDeleteRunbookMutation,
} from "../store/runbookApi";
import ConfigureRunbookDrawer from "../components/ConfigureRunbookDrawer"; 
// We'll create this component below.

const { Title, Text } = Typography;

/**
 * Main Runbooks management page:
 * - Displays runbooks in a table
 * - A button to create new runbook
 * - A drawer to configure triggers/filters/actions
 */
function RunbooksPage() {
  const currentTenantId = useSelector((state) => state.auth.userInfo?.currentTenantId);

  // 1) Fetch runbooks for the tenant
  const {
    data: runbooks,
    isLoading: loadingRunbooks,
    refetch: refetchRunbooks
  } = useGetRunbooksForTenantQuery(currentTenantId, {
    skip: !currentTenantId,
  });

  const [deleteRunbook, { isLoading: isDeleting }] = useDeleteRunbookMutation();



  // 2) Mutations
  const [createRunbook] = useCreateRunbookMutation();
  const [setRunbookEnabled] = useSetRunbookEnabledMutation();

  // 3) UI States
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  // For the configuration Drawer
  const [selectedRunbook, setSelectedRunbook] = useState(null); // runbook object
  const [configureDrawerVisible, setConfigureDrawerVisible] = useState(false);

  // If no tenant, show a message
  if (!currentTenantId) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={3}>Runbook Management</Title>
        <Text>Please select a tenant to view or create runbooks.</Text>
      </div>
    );
  }

  const handleDelete = async (runbookId) => {
    try {
      await deleteRunbook(runbookId).unwrap();
      message.success("Runbook deleted successfully");
      refetch(); // Refresh the runbook list
    } catch (err) {
      console.error(err);
      message.error("Failed to delete runbook.");
    }
  };

  // CREATE RUNBOOK HANDLERS
  const openCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateRunbook = async () => {
    try {
      const values = await createForm.validateFields();
      await createRunbook({
        tenantId: currentTenantId,
        name: values.name,
        description: values.description,
      }).unwrap();
      message.success("Runbook created successfully");
      setIsCreateModalVisible(false);
      createForm.resetFields();
      refetchRunbooks();
    } catch (err) {
      console.error(err);
      message.error("Failed to create runbook");
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button type="link" onClick={() => openConfigureDrawer(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => toggleEnableRunbook(record, checked)}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
        <Button onClick={() => openConfigureDrawer(record)}>Configure</Button>
        <Popconfirm
          title="Are you sure you want to delete this runbook?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger loading={isDeleting}>
            Delete
          </Button>
        </Popconfirm>
      </Space>
      ),
    },
  ];

  // Enable/disable a runbook
  const toggleEnableRunbook = async (record, enable) => {
    try {
      await setRunbookEnabled({ runbookId: record.id, enable }).unwrap();
      message.success(`Runbook "${record.name}" is now ${enable ? "enabled" : "disabled"}.`);
      refetchRunbooks();
    } catch (err) {
      console.error(err);
      message.error("Failed to update runbook status.");
    }
  };

  // Open the config drawer
  const openConfigureDrawer = (runbook) => {
    setSelectedRunbook(runbook);
    setConfigureDrawerVisible(true);
  };

  // Close config drawer
  const onCloseConfigureDrawer = () => {
    setConfigureDrawerVisible(false);
    setSelectedRunbook(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={3}>Runbook Management</Title>
            <Text>
              Create and manage runbooks for automated workflows. Each runbook can be 
              configured with triggers, filters, and actions.
            </Text>
            <Divider />
            <div style={{ textAlign: "right", marginBottom: 16 }}>
              <Button type="primary" onClick={openCreateModal}>
                Create Runbook
              </Button>
            </div>

            <Table
              dataSource={runbooks || []}
              columns={columns}
              loading={loadingRunbooks}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      {/* CREATE RUNBOOK MODAL */}
      <Modal
        title="Create New Runbook"
        visible={isCreateModalVisible}
        onOk={handleCreateRunbook}
        onCancel={() => setIsCreateModalVisible(false)}
        okText="Create"
      >
        <Form layout="vertical" form={createForm}>
          <Form.Item
            name="name"
            label="Runbook Name"
            rules={[{ required: true, message: "Runbook name is required" }]}
          >
            <Input placeholder="e.g. 'Security Alerts Runbook'" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Optional description..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* CONFIGURE RUNBOOK DRAWER */}
      {selectedRunbook && (
        <ConfigureRunbookDrawer
          visible={configureDrawerVisible}
          onClose={onCloseConfigureDrawer}
          runbook={selectedRunbook}
        />
      )}
    </div>
  );
}

export default RunbooksPage;
