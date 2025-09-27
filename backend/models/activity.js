import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "Kader", required: true },
    action: {
        type: String, required: true,
        enum: [
            "created_task",
            "update_task",
            "completed_task",
            "created_subtask",
            "update_subtask",
            "created_project",
            "update_project",
            "completed_project",
            "created_workspace",
            "update_workspace",
            "added_comment",
            "added_member",
            "remove_member",
            "joined_workspace",
            "transferred_workspace_ownership",
            "added_attachment"
        ]
    },
    resourceType: {
        type: String, required: true,
        enum: ["Task", "Project", "Workspace", "Comment", "Kader"]
    },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    details: { type: Object }
}, {
    timestamps: true
})

const ActivityLog = mongoose.model("Activity", activityLogSchema)
export default ActivityLog