// src/components/runbooks/ConfigureRunbookDrawer.jsx

import React, { useEffect, useState } from "react";
import {
  Drawer,
  Tabs,
  Form,
  Select,
  Button,
  Checkbox,
  Space,
  message,
  Divider,
  Spin
} from "antd";
import { useSelector } from "react-redux";
import {
  useGetAvailableTriggersQuery,
  useGetTriggersForRunbookQuery,
  useConfigureTriggersMutation,
  useGetFiltersForRunbookQuery,
  useConfigureFiltersMutation,
  useGetActionsForRunbookQuery,
  useConfigureActionsMutation,
} from "../store/runbookApi";

const { TabPane } = Tabs;
const { Option } = Select;

const stateOptions = ["OPEN", "FALSE_POSITIVE", "SUPPRESSED", "FIXED", "CONFIRMED"];
const severityOptions = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

function ConfigureRunbookDrawer({ visible, onClose, runbook }) {
  const currentTenantId = useSelector((state) => state.auth.userInfo?.currentTenantId);

  // 1) Queries for triggers, filters, actions
  const { data: availableTriggers, isLoading: loadingAvailable } = useGetAvailableTriggersQuery();
  const {
    data: existingTriggers,
    refetch: refetchTriggers,
    isLoading: loadingTriggers
  } = useGetTriggersForRunbookQuery(runbook.id, { skip: !runbook?.id });
  
  const {
    data: existingFilters,
    refetch: refetchFilters,
    isLoading: loadingFilters
  } = useGetFiltersForRunbookQuery(runbook.id, { skip: !runbook?.id });
  
  const {
    data: existingActions,
    refetch: refetchActions,
    isLoading: loadingActions
  } = useGetActionsForRunbookQuery(runbook.id, { skip: !runbook?.id });

  // 2) Mutations
  const [configureTriggers, { isLoading: savingTriggers }] = useConfigureTriggersMutation();
  const [configureFilters, { isLoading: savingFilters }] = useConfigureFiltersMutation();
  const [configureActions, { isLoading: savingActions }] = useConfigureActionsMutation();

  // 3) Local state for forms
  // TRIGGERS
  const [triggerForm] = Form.useForm();
  // FILTER
  const [filterForm] = Form.useForm();
  // ACTION
  const [actionForm] = Form.useForm();

  // Pre-populate forms when data loads
  useEffect(() => {
    if (existingTriggers) {
      const selectedTriggerTypes = existingTriggers.map((t) => t.triggerType);
      triggerForm.setFieldsValue({ triggers: selectedTriggerTypes });
    }
  }, [existingTriggers, triggerForm]);

  useEffect(() => {
    if (existingFilters && existingFilters.length > 0) {
      const f = existingFilters[0]; // if we store only one filter row
      filterForm.setFieldsValue({
        state: f.state || undefined,
        severity: f.severity || undefined,
      });
    } else {
      filterForm.resetFields();
    }
  }, [existingFilters, filterForm]);

  useEffect(() => {
    if (existingActions && existingActions.length > 0) {
      // Possibly you have multiple actions. For simplicity, just read them
      let updateTo = null;
      let createTicket = false;
      existingActions.forEach((act) => {
        if (act.actionType === "UPDATE_FINDING") {
          updateTo = act.updateToState;
        } else if (act.actionType === "CREATE_TICKET") {
          createTicket = true;
        }
      });
      actionForm.setFieldsValue({
        to: updateTo || undefined,
        createTicket,
      });
    } else {
      actionForm.resetFields();
    }
  }, [existingActions, actionForm]);

  // Re-fetch data each time the drawer opens
  useEffect(() => {
    if (visible && runbook?.id) {
      refetchTriggers();
      refetchFilters();
      refetchActions();
    }
  }, [visible, runbook, refetchTriggers, refetchFilters, refetchActions]);

  // HANDLERS
  const handleSaveTriggers = async () => {
    try {
      const values = triggerForm.getFieldsValue();
      await configureTriggers({
        runbookId: runbook.id,
        triggers: values.triggers || [],
      }).unwrap();
      message.success("Triggers updated successfully");
      refetchTriggers();
    } catch (err) {
      console.error(err);
      message.error("Failed to update triggers");
    }
  };

  const handleSaveFilter = async () => {
    try {
      const values = filterForm.getFieldsValue();
      await configureFilters({
        runbookId: runbook.id,
        filter: {
          state: values.state || null,
          severity: values.severity || null,
        },
      }).unwrap();
      message.success("Filter updated successfully");
      refetchFilters();
    } catch (err) {
      console.error(err);
      message.error("Failed to update filter");
    }
  };

  const handleSaveActions = async () => {
    try {
      const values = actionForm.getFieldsValue();
      await configureActions({
        runbookId: runbook.id,
        actions: {
          to: values.to || null,
          createTicket: values.createTicket || false,
        },
      }).unwrap();
      message.success("Actions updated successfully");
      refetchActions();
    } catch (err) {
      console.error(err);
      message.error("Failed to update actions");
    }
  };

  const loadingAny =
    loadingAvailable || loadingTriggers || loadingFilters || loadingActions;

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={600}
      title={`Configure Runbook: ${runbook?.name}`}
    >
      {loadingAny ? (
        <Spin />
      ) : (
        <Tabs defaultActiveKey="1">
          {/* TAB 1: TRIGGERS */}
          <TabPane tab="Triggers" key="1">
            <Form layout="vertical" form={triggerForm}>
              <Form.Item
                label="Select Trigger(s)"
                name="triggers"
                tooltip="Future expansions can add more triggers here."
              >
                <Select mode="multiple" placeholder="Choose trigger(s)">
                  {(availableTriggers || []).map((t) => (
                    <Option key={t} value={t}>
                      {t}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Divider />
              <Button
                type="primary"
                onClick={handleSaveTriggers}
                loading={savingTriggers}
              >
                Save Triggers
              </Button>
            </Form>
          </TabPane>

          {/* TAB 2: FILTER */}
          <TabPane tab="Filter" key="2">
            <Form layout="vertical" form={filterForm}>
              <Form.Item label="Finding State" name="state">
                <Select allowClear placeholder="Any state">
                  {stateOptions.map((st) => (
                    <Option key={st} value={st}>
                      {st}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Finding Severity" name="severity">
                <Select allowClear placeholder="Any severity">
                  {severityOptions.map((sv) => (
                    <Option key={sv} value={sv}>
                      {sv}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Divider />
              <Button
                type="primary"
                onClick={handleSaveFilter}
                loading={savingFilters}
              >
                Save Filter
              </Button>
            </Form>
          </TabPane>

          {/* TAB 3: ACTIONS */}
          <TabPane tab="Actions" key="3">
            <Form layout="vertical" form={actionForm}>
              <Form.Item
                label="Update Finding To State"
                name="to"
                tooltip="Leave blank if you do not want to update the finding state automatically."
              >
                <Select allowClear placeholder="No update if blank">
                  {stateOptions.map((st) => (
                    <Option key={st} value={st}>
                      {st}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="createTicket" valuePropName="checked">
                <Checkbox>Create Ticket</Checkbox>
              </Form.Item>
              <Divider />
              <Button
                type="primary"
                onClick={handleSaveActions}
                loading={savingActions}
              >
                Save Actions
              </Button>
            </Form>
          </TabPane>
        </Tabs>
      )}
    </Drawer>
  );
}

export default ConfigureRunbookDrawer;
