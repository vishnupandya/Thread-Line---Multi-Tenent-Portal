import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import projectApi from "../../api/project.api.js";
import taskApi from "../../api/task.api.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { CardSkeleton } from "../../components/ui/Skeleton.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import CreateProjectModal from "./CreateProjectModal.jsx";
import EditProjectModal from "./EditProjectModal.jsx";
import {
  FolderKanban,
  Plus,
  Search,
  Trash2,
  Pencil,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function Projects() {
  const { activeOrg, activeRole } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [taskStats, setTaskStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canManageProjects = activeRole === "OWNER" || activeRole === "ADMIN";

  const fetchProjects = useCallback(async () => {
    if (!activeOrg?._id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await projectApi.listByOrg(activeOrg._id);
      const orgProjects = res.data?.projects || [];
      setProjects(orgProjects);

      // Fetch task stats for each project
      const statsMap = {};
      await Promise.all(
        orgProjects.map(async (p) => {
          try {
            const taskRes = await taskApi.listByProject(p._id);
            const tasks = taskRes.data?.tasks || [];
            statsMap[p._id] = {
              total: tasks.length,
              done: tasks.filter((t) => t.status === "DONE").length,
            };
          } catch {
            statsMap[p._id] = { total: 0, done: 0 };
          }
        })
      );
      setTaskStats(statsMap);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [activeOrg]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await projectApi.delete(projectToDelete._id);
      if (res.success) {
        showSuccess(`Project "${projectToDelete.name}" deleted successfully`);
        setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
        setProjectToDelete(null);
      } else {
        showError(res.message || "Failed to delete project");
      }
    } catch (err) {
      showError(err.message || "Failed to delete project. You must be an Admin or Owner.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A2433]">Projects</h1>
          <p className="text-xs text-[#6D8196] mt-0.5">
            Manage and track all projects scoped to {activeOrg?.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canManageProjects ? (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
              size="sm"
            >
              New Project
            </Button>
          ) : (
            <span className="text-xs text-[#6D8196] bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
              Only Admins can create projects
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>
        <span className="text-xs text-[#6D8196] ml-auto">
          {filteredProjects.length} of {projects.length} projects
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : filteredProjects.length === 0 ? (
        projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start organizing team tasks."
            actionLabel={canManageProjects ? "Create Project" : undefined}
            actionIcon={Plus}
            onAction={canManageProjects ? () => setShowCreateModal(true) : undefined}
          />
        ) : (
          <div className="p-12 text-center bg-white rounded-lg border border-[#E5E9EF] text-sm text-[#6D8196]">
            No projects matched "{searchQuery}".
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const stats = taskStats[project._id] || { total: 0, done: 0 };
            const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
            const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={project._id}
                className="bg-white rounded-lg border border-[#E5E9EF] hover:border-[#CBD5E1] transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-[#1A2433] truncate">
                      {project.name}
                    </h2>
                    {canManageProjects && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setProjectToEdit(project)}
                          className="p-1 text-[#9CA9B8] hover:text-[#0047AB] rounded transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="p-1 text-[#9CA9B8] hover:text-[#DC2626] rounded transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#6D8196] mt-2 line-clamp-2 min-h-8">
                    {project.description || "No description provided."}
                  </p>

                  {/* Task Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-[#E5E9EF]/60">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[#6D8196] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Progress
                      </span>
                      <span className="font-semibold text-[#1A2433]">
                        {stats.done}/{stats.total} done ({progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#0047AB] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E5E9EF] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#6D8196]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{createdDate}</span>
                  </div>

                  <Link to={`/projects/${project._id}`}>
                    <Button variant="outline" size="sm" icon={ArrowRight}>
                      Open Board
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => fetchProjects()}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={Boolean(projectToEdit)}
        onClose={() => setProjectToEdit(null)}
        project={projectToEdit}
        onUpdated={() => fetchProjects()}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? All associated tasks will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Project"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
