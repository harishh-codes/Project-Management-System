import mongoose, { Schema } from "mongoose"

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    archivedAt: {
      type: Date,
    },
    tags: [String],
  },
  { timestamps: true }
)

// Soft delete query helper
taskSchema.query.notArchived = function () {
  return this.where({ isArchived: false })
}

export const Task = mongoose.model("Task", taskSchema)
