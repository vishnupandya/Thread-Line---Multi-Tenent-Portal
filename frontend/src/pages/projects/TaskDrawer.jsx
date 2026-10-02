import React, { useState, useEffect } from "react";
import Drawer from "../../components/ui/Drawer.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import taskApi from "../../api/task.api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { Trash2, Calendar, User, Save } from "lucide-react";

export default function TaskDrawer({
  task,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
  members = [],
  canManageTasks = true,
  canDelete = true,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "TODO");
      setPriority(task.priority || "MEDIUM");
      setAssigneeId(task.assigneeId?._id || task.assigneeId || "");
    }
  }, [task]);

  if (!task) return null;

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (canManageTasks && !title.trim()) {
      showError("Task title cannot be empty");
      return;
    }

    setSaving(true);
    try {
      // Members only send status update to comply with RBAC
      const payload = canManageTasks
        ? {
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            assigneeId: assigneeId || null,
          }
        : {
            status,
          };

      const res = await taskApi.update(task._id, payload);
      if (res.success) {
        showSuccess(
          canManageTasks
            ? "Task updated successfully!"
            : "Task status updated successfully!"
        );
        if (onUpdated) onUpdated(res.data.task);
        onClose();
      } else {
        showError(res.message || "Failed to update task");
      }
    } catch (err) {
      showError(err.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await taskApi.delete(task._id);
      if (res.success) {
        showSuccess("Task deleted successfully");
        setShowDeleteConfirm(false);
        if (onDeleted) onDeleted(task._id);
        onClose();
      } else {
        showError(res.message || "Failed to delete task");
      }
    } catch (err) {
      showError(err.message || "Failed to delete task. You must be an Admin or Owner.");
    } finally {
      setDeleting(false);
    }
  };

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  const priorityOptions = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
  ];

  const assigneeOptions = [
    { value: "", label: "Unassigned" },
    ...members.map((m) => ({
      value: m.user._id,
      label: `${m.user.name} (${m.user.email})`,
    })),
  ];

  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "Unknown";

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Task"
        subtitle={`Task ID: ${task._id}`}
      >
        <form onSubmit={handleSave} className="space-y-6">
          {!canManageTasks && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <strong>Member View:</strong> You can update the status of this task. Task details and assignees can only be modified by Admins or Owners.
            </div>
          )}

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canManageTasks}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1A2433] uppercase tracking-wide">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Task details and instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canManageTasks}
              className="w-full rounded-md border border-[#CBD5E1] p-3 text-sm text-[#1A2433] placeholder-[#9CA9B8] bg-white disabled:bg-slate-50 disabled:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={!canManageTasks}
              options={priorityOptions}
            />
          </div>

          <Select
            label="Assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={!canManageTasks}
            options={assigneeOptions}
          />

          {/* Meta Info */}
          <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E5E9EF] space-y-2 text-xs text-[#6D8196]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#9CA9B8]" />
                Created:
              </span>
              <span className="font-medium text-[#1A2433]">{createdDate}</span>
            </div>
            {task.createdBy && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9CA9B8]" />
                  Created By:
                </span>
                <span className="font-medium text-[#1A2433]">
                  {task.createdBy.name || task.createdBy.email}
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E5E9EF] flex items-center justify-between">
            {canDelete ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Task
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Save}
                loading={saving}
              >
                {canManageTasks ? "Save Changes" : "Update Status"}
              </Button>
            </div>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        confirmVariant="danger"
        loading={deleting}
      />
    </>
  );
}
