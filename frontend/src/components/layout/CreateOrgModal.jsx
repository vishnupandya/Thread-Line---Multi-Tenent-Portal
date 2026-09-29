import React, { useState } from "react";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { Building2 } from "lucide-react";

export default function CreateOrgModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { createOrganization } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await createOrganization({ name: name.trim() });
      if (res.success) {
        showSuccess(`Organization "${name}" created successfully!`);
        setName("");
        onClose();
      } else {
        setError(res.message || "Failed to create organization");
      }
    } catch (err) {
      const msg = err.message || "Failed to create organization";
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
      title="Create Organization"
      description="Create a new isolated workspace tenant for your team."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="e.g. Acme Studio, Nexus Labs"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
          leftIcon={Building2}
          helperText="A slug will be automatically generated for your tenant."
        />

        <div className="pt-3 flex justify-end gap-3 border-t border-[#E5E9EF]">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Organization
          </Button>
        </div>
      </form>
    </Modal>
  );
}
