import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import projectApi from "../../api/project.api.js";
import taskApi from "../../api/task.api.js";
import { StatSkeleton, TableSkeleton } from "../../components/ui/Skeleton.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { StatusBadge, PriorityBadge } from "../../components/ui/Badge.jsx";
import CreateProjectModal from "../projects/CreateProjectModal.jsx";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { activeOrg, activeRole } = useAuth();
  const canManageProjects = activeRole === "OWNER" || activeRole === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!activeOrg?._id) return;
    setLoading(true);
    setError(null);

    try {
      const projRes = await projectApi.listByOrg(activeOrg._id);
      const orgProjects = projRes.data?.projects || [];
      setProjects(orgProjects);

      // Fetch tasks for all projects in this organization
      if (orgProjects.length > 0) {
        const taskPromises = orgProjects.map((p) =>
          taskApi.listByProject(p._id).catch(() => ({ data: { tasks: [] } }))
        );
        const taskResults = await Promise.all(taskPromises);
        const allTasks = taskResults.flatMap((res, index) =>
          (res.data?.tasks || []).map((t) => ({
            ...t,
            projectName: orgProjects[index]?.name || "Project",
          }))
        );
        setTasks(allTasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, [activeOrg]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-48 bg-slate-200 rounded animate-shimmer mb-2" />
          <div className="h-4 w-72 bg-slate-200 rounded animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton rows={4} cols={3} />
          <TableSkeleton rows={4} cols={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A2433]">
            {activeOrg?.name || "Workspace"} Dashboard
          </h1>
          <p className="text-xs text-[#6D8196] mt-0.5">
            Real-time project overview and task execution progress.
          </p>
        </div>
        {canManageProjects && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            size="sm"
          >
            New Project
          </Button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-[#E5E9EF] shadow-2xs">
          <div className="flex items-center justify-between text-[#6D8196] mb-1">
            <span className="text-xs font-medium">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-[#0047AB]" />
          </div>
          <p className="text-2xl font-bold text-[#1A2433]">{totalProjects}</p>
          <span className="text-[11px] text-[#6D8196] mt-1 block">Active in this tenant</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E9EF] shadow-2xs">
          <div className="flex items-center justify-between text-[#6D8196] mb-1">
            <span className="text-xs font-medium">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A2433]">{totalTasks}</p>
          <span className="text-[11px] text-[#6D8196] mt-1 block">Across all projects</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E9EF] shadow-2xs">
          <div className="flex items-center justify-between text-[#6D8196] mb-1">
            <span className="text-xs font-medium">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A2433]">{inProgressTasks}</p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">Currently being executed</span>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E9EF] shadow-2xs">
          <div className="flex items-center justify-between text-[#6D8196] mb-1">
            <span className="text-xs font-medium">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#1A2433]">{completionRate}%</p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {completedTasks} of {totalTasks} tasks done
          </span>
        </div>
      </div>

      {totalProjects === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects in this organization yet"
          description={
            canManageProjects
              ? "Create your first project to start organizing tasks with your team."
              : "No projects have been created yet. Ask an organization Admin or Owner to create a project."
          }
          actionLabel={canManageProjects ? "Create Project" : undefined}
          actionIcon={Plus}
          onAction={canManageProjects ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects Card */}
          <div className="bg-white rounded-lg border border-[#E5E9EF] shadow-2xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E9EF] flex items-center justify-between bg-[#F8FAFC]">
              <h2 className="text-sm font-semibold text-[#1A2433]">Active Projects</h2>
              <Link
                to="/projects"
                className="text-xs font-semibold text-[#0047AB] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#E5E9EF] flex-1">
              {projects.slice(0, 5).map((project) => {
                const projectTaskCount = tasks.filter((t) => t.projectId === project._id).length;
                return (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors block"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <h3 className="text-xs font-semibold text-[#1A2433] truncate">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-[#6D8196] truncate mt-0.5">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-medium text-[#6D8196] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        {projectTaskCount} tasks
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#9CA9B8]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Tasks Card */}
          <div className="bg-white rounded-lg border border-[#E5E9EF] shadow-2xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E5E9EF] flex items-center justify-between bg-[#F8FAFC]">
              <h2 className="text-sm font-semibold text-[#1A2433]">Recent Tasks</h2>
              <span className="text-xs text-[#6D8196]">{tasks.length} total</span>
            </div>
            <div className="divide-y divide-[#E5E9EF] flex-1">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6D8196]">
                  No tasks created across projects yet.
                </div>
              ) : (
                tasks.slice(0, 6).map((task) => (
                  <div
                    key={task._id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#1A2433] truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#6D8196] truncate">
                          {task.projectName}
                        </span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <StatusBadge status={task.status} />
                      {task.assigneeId ? (
                        <Avatar
                          name={task.assigneeId.name}
                          email={task.assigneeId.email}
                          size="xs"
                        />
                      ) : (
                        <span className="text-[10px] text-[#9CA9B8]">Unassigned</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {canManageProjects && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}
