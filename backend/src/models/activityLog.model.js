import mongoose, { Schema } from "mongoose"

const activityLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["create", "update", "delete", "archive", "restore"],
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: ["project", "task", "user", "team"],
      required: true,
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
)

// Index for efficient queries
activityLogSchema.index({ createdAt: -1 })
activityLogSchema.index({ userId: 1, createdAt: -1 })
activityLogSchema.index({ resourceType: 1, resourceId: 1 })

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema)
