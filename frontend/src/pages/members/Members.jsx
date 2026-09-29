import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import organizationApi from "../../api/organization.api.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { RoleBadge } from "../../components/ui/Badge.jsx";
import { TableSkeleton } from "../../components/ui/Skeleton.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import { Users, UserPlus, Trash2, Mail, Shield } from "lucide-react";

export default function Members() {
  const { user: currentUser, activeOrg, activeRole } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("MEMBER");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const canManageMembers = activeRole === "OWNER" || activeRole === "ADMIN";

  const fetchMembers = useCallback(async () => {
    if (!activeOrg?._id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await organizationApi.getMembers(activeOrg._id);
      setMembers(res.data?.members || []);
    } catch (err) {
      setError(err.message || "Failed to load organization members");
    } finally {
      setLoading(false);
    }
  }, [activeOrg]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!addEmail.trim()) {
      setAddError("Member email is required.");
      return;
    }

    setAddError("");
    setAddLoading(true);

    try {
      const res = await organizationApi.addMember(activeOrg._id, {
        email: addEmail.trim(),
        role: addRole,
      });

      if (res.success) {
        showSuccess(`Member ${addEmail} added successfully!`);
        setAddEmail("");
        setAddRole("MEMBER");
        setShowAddModal(false);
        fetchMembers();
      } else {
        setAddError(res.message || "Failed to add member");
      }
    } catch (err) {
      const msg = err.message || "Failed to add member. Make sure the user already has an account.";
      setAddError(msg);
      showError(msg);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    setRemoveLoading(true);

    try {
      const res = await organizationApi.removeMember(
        activeOrg._id,
        memberToRemove.user._id
      );

      if (res.success) {
        showSuccess(`Member ${memberToRemove.user.name} removed from organization`);
        setMembers((prev) =>
          prev.filter((m) => m.user._id !== memberToRemove.user._id)
        );
        setMemberToRemove(null);
      } else {
        showError(res.message || "Failed to remove member");
      }
    } catch (err) {
      showError(err.message || "Failed to remove member");
    } finally {
      setRemoveLoading(false);
    }
  };

  const roleOptions = [
    { value: "MEMBER", label: "Member (Can create tasks & update own tasks)" },
    { value: "ADMIN", label: "Admin (Full project & task management)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A2433]">Team Members</h1>
          <p className="text-xs text-[#6D8196] mt-0.5">
            Manage who has access to {activeOrg?.name} projects and tasks.
          </p>
        </div>

        {canManageMembers && (
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setShowAddModal(true)}
            size="sm"
          >
            Add Member
          </Button>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMembers} />
      ) : (
        <div className="bg-white rounded-lg border border-[#E5E9EF] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E9EF] text-[#6D8196] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Tenant Scope</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9EF]">
                {members.map((item) => {
                  const isSelf = item.user._id === currentUser?._id;
                  const isOwner = item.role === "OWNER";
                  const canDeleteThisMember = canManageMembers && !isOwner && !isSelf;

                  return (
                    <tr key={item.membershipId} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={item.user.name}
                            email={item.user.email}
                            size="sm"
                          />
                          <div>
                            <span className="font-semibold text-[#1A2433] block">
                              {item.user.name} {isSelf && "(You)"}
                            </span>
                            <span className="text-[11px] text-[#6D8196]">
                              {item.user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <RoleBadge role={item.role} />
                      </td>

                      <td className="py-3.5 px-4 text-[#6D8196]">
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {activeOrg?.slug}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {canDeleteThisMember ? (
                          <button
                            type="button"
                            onClick={() => setMemberToRemove(item)}
                            className="p-1.5 text-[#9CA9B8] hover:text-[#DC2626] hover:bg-rose-50 rounded transition-colors"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#9CA9B8] italic">
                            {isOwner ? "Owner protected" : isSelf ? "Self" : "Restricted"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Team Member"
        description={`Add an existing registered user to ${activeOrg?.name}.`}
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <Input
            label="User Email Address"
            type="email"
            placeholder="member@company.com"
            value={addEmail}
            onChange={(e) => {
              setAddEmail(e.target.value);
              if (addError) setAddError("");
            }}
            error={addError}
            leftIcon={Mail}
            autoFocus
            helperText="The user must already have a ThreadLine account."
            required
          />

          <Select
            label="Tenant Role"
            value={addRole}
            onChange={(e) => setAddRole(e.target.value)}
            options={roleOptions}
          />

          <div className="pt-3 flex justify-end gap-3 border-t border-[#E5E9EF]">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              disabled={addLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={addLoading}>
              Add to Organization
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Member Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        description={`Are you sure you want to remove ${memberToRemove?.user.name} (${memberToRemove?.user.email}) from ${activeOrg?.name}? They will lose all access to projects and tasks in this organization.`}
        confirmLabel="Remove Member"
        confirmVariant="danger"
        loading={removeLoading}
      />
    </div>
  );
}
