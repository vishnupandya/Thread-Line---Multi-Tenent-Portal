import mongoose from 'mongoose';
import {
  TASK_STATUS,
  TASK_STATUS_VALUES,
  TASK_PRIORITY,
  TASK_PRIORITY_VALUES,
} from '../utils/constants.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title too long'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description too long'],
      default: '',
    },
    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: TASK_STATUS.TODO,
      required: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: TASK_PRIORITY.MEDIUM,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Fast "tasks of a project, latest first"
taskSchema.index({ projectId: 1, createdAt: -1 });

// Fast "tasks assigned to a user"
taskSchema.index({ assigneeId: 1, status: 1 });

taskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Task = mongoose.model('Task', taskSchema);

export default Task;