import React, { useState } from "react";
import Modal from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import projectApi from "../../api/project.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { FolderPlus } from "lucide-react";

export default function CreateProjectModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { activeOrg } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!activeOrg?._id) {
      setError("No active organization selected.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await projectApi.create(activeOrg._id, {
        name: name.trim(),
        description: description.trim(),
      });

      if (res.success) {
        showSuccess(`Project "${name}" created successfully!`);
        setName("");
        setDescription("");
        onClose();
        if (onCreated) onCreated(res.data.project);
      } else {
        setError(res.message || "Failed to create project");
      }
    } catch (err) {
      const msg = err.message || "Failed to create project. Please verify permissions.";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description={`Create a project inside ${activeOrg?.name || "current organization"}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          placeholder="e.g. Mobile App Redesign, API v2"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
          leftIcon={FolderPlus}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1A2433] uppercase tracking-wide">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe the objectives and scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-[#CBD5E1] p-3 text-sm text-[#1A2433] placeholder-[#9CA9B8] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
          />
        </div>

        <div className="pt-3 flex justify-end gap-3 border-t border-[#E5E9EF]">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
