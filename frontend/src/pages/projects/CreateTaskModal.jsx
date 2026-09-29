import React, { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import taskApi from "../../api/task.api.js";
import organizationApi from "../../api/organization.api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { CheckSquare } from "lucide-react";

export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  orgId,
  initialStatus = "TODO",
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (isOpen && orgId) {
      organizationApi
        .getMembers(orgId)
        .then((res) => {
          setMembers(res.data?.members || []);
        })
        .catch(() => {
          setMembers([]);
        });
    }
  }, [isOpen, orgId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || null,
      };

      const res = await taskApi.create(projectId, payload);
      if (res.success) {
        showSuccess(`Task "${title}" created successfully!`);
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setPriority("MEDIUM");
        setAssigneeId("");
        onClose();
        if (onCreated) onCreated(res.data.task);
      } else {
        setError(res.message || "Failed to create task");
      }
    } catch (err) {
      const msg = err.message || "Failed to create task.";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a task to this project and assign it to an organization member."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Implement tenant isolation middleware"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
          leftIcon={CheckSquare}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1A2433] uppercase tracking-wide">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Add relevant context or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-[#CBD5E1] p-3 text-sm text-[#1A2433] placeholder-[#9CA9B8] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={priorityOptions}
          />
        </div>

        <Select
          label="Assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          options={assigneeOptions}
          helperText="Only verified members of this organization can be assigned."
        />

        <div className="pt-3 flex justify-end gap-3 border-t border-[#E5E9EF]">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
