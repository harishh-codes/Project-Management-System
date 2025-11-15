import mongoose, { Schema } from "mongoose"

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "editor", "viewer"],
          default: "viewer",
        },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    archivedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
)

// Soft delete query helper
projectSchema.query.notArchived = function () {
  return this.where({ isArchived: false })
}

export const Project = mongoose.model("Project", projectSchema)
