import Project from "../models/project.js"
import Task from "../models/task.js"
import Workspace from "../models/workspace.js"

const createProject = async (req, res) => {
    try {
        const { workspaceId } = req.params
        const { title, description, status, startDate, dueDate, tags, members } = req.body
        const workspace = await Workspace.findById(workspaceId)
        if (!workspace) {
            return res.status(400).json({ message: "Data id dari Workspace model tidak ditemukan!" })
        }
        const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString())
        if (!isMember) {
            return res.status(400).json({ message: "Data user dari isMember tidak ditemukan!" })
        }
        const tagArray = tags ? tags.split(",") : []
        const newProject = await Project.create({
            title,
            description,
            status,
            startDate,
            dueDate,
            tags: tagArray,
            workspace: workspaceId,
            members,
            createdBy: req.user._id,
        })
        workspace.projects.push(newProject._id)
        await workspace.save()
        return res.status(200).json(newProject)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kehancuran pada backend controllers -> createProject -> project.js " })
    }
}
const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project tidak ditemukan, mungkin di Kutub" })
        }
        const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString())
        if (!isMember) {
            return res.status(403).json({ message: "Anda bukan member dari project ini" })
        }
        res.status(200).json(project)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kehancuran pada backend controllers -> getProjectDetails -> project.js " })
    }
}
const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId).populate("members.user")
        if (!project) {
            return res.status(404).json({ message: "Project tidak ditemukan, mungkin di Kutub" })
        }
        const isMember = project.members.some((member) => member.user._id.toString() === req.user._id.toString())
        if (!isMember) {
            return res.status(403).json({ message: "Anda bukan member dari project ini" })
        }
        const tasks = await Task.find({
            project: projectId,
            isArchived: false
        }).populate("assignees", "name profilePicture").sort({ createdAt: -1 })
        res.status(200).json({ project, tasks })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kehancuran pada backend controllers -> getProjectTasks -> project.js " })
    }
}

export { createProject, getProjectDetails, getProjectTasks }