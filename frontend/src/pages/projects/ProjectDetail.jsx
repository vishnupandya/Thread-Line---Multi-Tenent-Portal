import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import projectApi from "../../api/project.api.js";
import taskApi from "../../api/task.api.js";
import organizationApi from "../../api/organization.api.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { CardSkeleton } from "../../components/ui/Skeleton.jsx";
import ErrorState from "../../components/ui/ErrorState.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { PriorityBadge } from "../../components/ui/Badge.jsx";
import CreateTaskModal from "./CreateTaskModal.jsx";
import TaskDrawer from "./TaskDrawer.jsx";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ListTodo,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  Check,
} from "lucide-react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { activeRole } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState("TODO");
  const [selectedTask, setSelectedTask] = useState(null);

  const canManageTasks = activeRole === "OWNER" || activeRole === "ADMIN";

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      const [projRes, tasksRes] = await Promise.all([
        projectApi.get(projectId),
        taskApi.listByProject(projectId),
      ]);

      const pData = projRes.data?.project;
      setProject(pData);
      setTasks(tasksRes.data?.tasks || []);

      if (pData?.orgId) {
        const memRes = await organizationApi.getMembers(pData.orgId);
        setMembers(memRes.data?.members || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load project details and tasks.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Quick move status handler (available to all roles)
  const handleQuickStatusMove = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      const res = await taskApi.update(taskId, { status: newStatus });
      if (res.success) {
        showSuccess(`Task status moved to ${newStatus.replace("_", " ")}`);
      } else {
        fetchProjectData();
        showError(res.message || "Failed to update status");
      }
    } catch (err) {
      fetchProjectData();
      showError(err.message || "Failed to update status");
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      id: "TODO",
      title: "To Do",
      icon: ListTodo,
      color: "text-[#0047AB]",
      bg: "bg-[#E6F0FB]",
      border: "border-[#BDDDFC]",
      tasks: filteredTasks.filter((t) => t.status === "TODO"),
    },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      icon: Clock,
      color: "text-[#B45309]",
      bg: "bg-[#FEF3C7]",
      border: "border-[#FDE68A]",
      tasks: filteredTasks.filter((t) => t.status === "IN_PROGRESS"),
    },
    {
      id: "DONE",
      title: "Done",
      icon: CheckCircle2,
      color: "text-[#15803D]",
      bg: "bg-[#DCFCE7]",
      border: "border-[#BBF7D0]",
      tasks: filteredTasks.filter((t) => t.status === "DONE"),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-shimmer" />
        <div className="h-8 w-64 bg-slate-200 rounded animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchProjectData} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb and Actions */}
      <div className="flex flex-col gap-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D8196] hover:text-[#0047AB] transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1A2433]">{project?.name}</h1>
            <p className="text-xs text-[#6D8196] mt-0.5">
              {project?.description || "No project description provided."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canManageTasks && (
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setCreateInitialStatus("TODO");
                  setShowCreateModal(true);
                }}
                size="sm"
              >
                Add Task
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Filter tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>
        <span className="text-xs text-[#6D8196] ml-auto">
          {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Kanban Board (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="bg-[#F8FAFC] rounded-lg border border-[#E5E9EF] p-4 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E9EF]">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded ${col.bg} ${col.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <h2 className="text-xs font-semibold text-[#1A2433] uppercase tracking-wide">
                    {col.title}
                  </h2>
                  <span className="text-xs font-semibold text-[#6D8196] bg-white px-2 py-0.5 rounded-full border border-[#E5E9EF]">
                    {col.tasks.length}
                  </span>
                </div>

                
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {col.tasks.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#CBD5E1] rounded-lg bg-white/50">
                    <p className="text-xs text-[#9CA9B8]">No tasks in this column</p>
                    
                  </div>
                ) : (
                  col.tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`bg-white rounded-lg border border-[#E5E9EF] p-3.5 shadow-2xs transition-all flex flex-col justify-between ${
                        canManageTasks
                          ? "hover:border-[#CBD5E1] hover:shadow-sm cursor-pointer group"
                          : "cursor-default"
                      }`}
                      onClick={() => {
                        if (canManageTasks) {
                          setSelectedTask(task);
                        }
                      }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3
                            className={`text-xs font-semibold text-[#1A2433] leading-snug ${
                              canManageTasks ? "group-hover:text-[#0047AB] transition-colors" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-[#6D8196] line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#E5E9EF]/60 flex items-center justify-between text-xs">
                        <PriorityBadge priority={task.priority} />

                        <div className="flex items-center gap-2">
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

                      {/* Quick Move Action Buttons (Accessible to all members) */}
                      <div
                        className="mt-2.5 pt-2 border-t border-[#E5E9EF]/40 flex items-center justify-between text-[11px] text-[#6D8196]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {col.id === "TODO" && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusMove(task._id, "IN_PROGRESS")}
                            className="w-full text-center py-1 rounded bg-[#FEF3C7] text-[#B45309] font-medium hover:bg-[#FDE68A] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Start Progress</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {col.id === "IN_PROGRESS" && (
                          <div className="w-full flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickStatusMove(task._id, "TODO")}
                              className="flex-1 py-1 rounded bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ArrowLeftIcon className="w-3 h-3" />
                              <span>To Do</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStatusMove(task._id, "DONE")}
                              className="flex-1 py-1 rounded bg-emerald-100 text-emerald-800 font-medium hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Done</span>
                            </button>
                          </div>
                        )}

                        {col.id === "DONE" && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusMove(task._id, "IN_PROGRESS")}
                            className="w-full text-center py-1 rounded bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <ArrowLeftIcon className="w-3 h-3" />
                            <span>Reopen to Progress</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {canManageTasks && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          projectId={projectId}
          orgId={project?.orgId}
          initialStatus={createInitialStatus}
          onCreated={() => fetchProjectData()}
        />
      )}

      {/* Task Drawer (Owner and Admin only) */}
      {canManageTasks && (
        <TaskDrawer
          task={selectedTask}
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          members={members}
          canManageTasks={canManageTasks}
          canDelete={canManageTasks}
          onUpdated={() => fetchProjectData()}
          onDeleted={() => fetchProjectData()}
        />
      )}
    </div>
  );
}
