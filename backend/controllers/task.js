import Project from "../models/project.js"
import Workspace from "../models/workspace.js"
import Task from "../models/task.js"
import { recordActivity } from "../libs/index.js"
import Activity from "../models/activity.js"
import Comment from "../models/comment.js"

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params
        const { title, description, status, priority, dueDate, assignees } = req.body
        const project = await Project.findById(projectId)
        const workspace = await Workspace.findById(project.workspace)
        const isMember = workspace.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        )
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }
        const newTask = await Task.create({ title, description, status, priority, dueDate, assignees, project: projectId, createdBy: req.user._id })
        project.tasks.push(newTask._id)
        await project.save()
        res.status(200).json(newTask)
    } catch (error) {
        return res.status(500).json(error)
    }
}
const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId)
            .populate("assignees", "name profilePicture")
            .populate("watchers", "name profilePicture");
        if (!task) {
            return res.status(404).json({ message: "Task not found", });
        }
        const project = await Project.findById(task.project)
            .populate("members.user", "name profilePicture");
        res.status(200).json({ task, project });
    } catch (error) {
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> getTaskById -> task.js" })
    }
};
const updateTaskTitle = async (req, res) => {
    try {
        const { taskId } = req.params
        const { title } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        )
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }
        const oldtitle = task.title
        task.title = title
        await task.save()
        await recordActivity(req.user._id, "update_task", "Task", taskId, {
            description: `update Title change from ${oldtitle} to ${title}`
        })
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> updateTaskTitle -> task.js" })
    }
}
const updateTaskDescription = async (req, res) => {
    try {
        const { taskId } = req.params
        const { description } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString())
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun sebagai member" }) }
        const oldDescription = task.description.substring(0, 50) + (task.description.length > 50 ? "..." : "")
        const newDescription = description.substring(0, 50) + (description.length > 50 ? "..." : "")
        task.description = description
        await task.save()
        await recordActivity(req.user._id, "update_task", "Task", taskId, {
            description: `update Description change from ${oldDescription} to ${newDescription}`
        })
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> updateTaskDescription -> task.js" })
    }
}
const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params
        const { status } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        )
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }
        const oldStatus = task.status
        task.status = status
        await task.save()
        await recordActivity(req.user._id, "update_task", "Task", taskId, {
            description: `update Status change from ${oldStatus} to ${status}`
        })
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> updateTaskStatus -> task.js" })
    }
}
const updateTaskAssignees = async (req, res) => {
    try {
        const { taskId } = req.params
        const { assignees } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        )
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }
        const oldAssignees = assignees
        await task.save()
        await recordActivity(req.user._id, "update_task", "Task", taskId, {
            description: `update Assignees Task change from ${oldAssignees.length} to ${assignees.length}`
        })
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> updateTaskAssignees -> task.js" })
    }
}
const updateTaskPriority = async (req, res) => {
    try {
        const { taskId } = req.params
        const { priority } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        )
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }
        const oldPriority = task.priority
        task.priority = priority
        await task.save()
        await recordActivity(req.user._id, "update_task", "Task", taskId, {
            description: `update Priority change from ${oldPriority} to ${priority}`
        })
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> updateTaskPriority -> task.js" })
    }
}
const addSubTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const { title } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString())
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }
        const newSubTask = {
            title, completed: false
        }
        task.subtasks.push(newSubTask)
        await task.save()
        await recordActivity(req.user._id, "created_subtask", "Task", taskId, {
            description: `created subtask ${title}`
        })
        res.status(201).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> addSubTask -> task.js" })
    }
}
const updateSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params
        const { completed } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Tugas tidak ditemukan" }) }
        const subTask = task.subtasks.find((subTask) => subTask._id.toString() === subTaskId)
        if (!subTask) { return res.status(404).json({ message: "Belum ada data sub tugas" }) }
        subTask.completed = completed
        await task.save()
        await recordActivity(req.user._id, "update_subtask", "Task", taskId, {
            description: `Update subtask ${subTask.title}`
        })
        res.status(201).json(task)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> addSubTask -> task.js" })
    }
}
const getActivityByResourceId = async (req, res) => {
    try {
        const { resourceId } = req.params
        const activity = await Activity.find({ resourceId })
            .populate("user", "name profilePicture")
            .sort({ createdAt: -1 })
        res.status(200).json(activity)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> getResourceActivity -> task.js" })
    }
}
const getCommetByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params
        const comments = await Comment.find({ task: taskId })
            .populate("author", "name profilePicture")
            .sort({ createdAt: -1 })
        res.status(200).json(comments)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> getCommetByTaskId -> task.js" })
    }
}
const addComment = async (req, res) => {
    try {
        const { taskId } = req.params
        const { text } = req.body
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Task not found" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString())
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }
        const newComment = await Comment.create({
            text,
            task: taskId,
            author: req.user._id
        })
        task.comments.push(newComment._id)
        await task.save()
        await recordActivity(req.user._id, "added_comment", "Task", taskId, {
            description: `Added a comment : ${text.substring(0, 50) + (text.length > 50 ? "..." : "")}`
        })
        res.status(201).json(newComment)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> addComment -> task.js" })
    }
}
const watchTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) { return res.status(404).json({ message: "Task not found" }) }
        const project = await Project.findById(task.project)
        if (!project) { return res.status(404).json({ message: "Project tidak ditemukan" }) }
        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString())
        if (!isMember) { return res.status(404).json({ message: "Daftarkan akun member" }) }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> watchTask -> task.js" })
    }
}
const achievedTask = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> achievedTask -> task.js" })
    }
}
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignees: { $in: [req.user._id] } })
            .populate("project", "title workspace")
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export {
    createTask,
    addSubTask,
    getTaskById,
    updateTaskTitle,
    updateTaskDescription,
    updateTaskStatus,
    updateTaskAssignees,
    updateTaskPriority,
    updateSubTask,
    getActivityByResourceId,
    getCommetByTaskId,
    addComment,
    watchTask,
    achievedTask,
    getMyTasks
}