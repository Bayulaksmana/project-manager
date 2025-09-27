import type { LucideIcon } from "lucide-react"

export interface User {
    length: number
    _id: string,
    email: string,
    name: string,
    username: string,
    createdAt: Date,
    isEmailVerified: boolean,
    updateAt: Date,
    profilePicture?: string,
}

export interface Workspace {
    _id: string,
    name: string,
    description?: string,
    icon: string
    owner: User | string,
    color: string,
    members: {
        user: User,
        role: "admin" | "member" | "owner" | "viewer"
        joinedAt: Date,
    }[],
    createdAt: Date,
    updateAt: Date,
}
export interface Storyspace {
    _id: string,
    user: User
    title: string,
    desc?: string,
    img: string,
    owner: User | string,
    slug: string,
    members: {
        user: User,
        role: "admin" | "member" | "owner" | "viewer"
        joinedAt: Date,
    }[],
    category: string,
    content: string,
    isFeatured: boolean,
    visit: number,
    createdAt: Date,
    updateAt: Date,
}
//  Part Enum
export enum ProjectStatus {
    PLANNING = "Planning",
    IN_PROGRESS = "In Progress",
    ON_HOLD = "On Hold",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}

export interface Project {
    _id: string,
    title: string,
    description?: string,
    status: ProjectStatus,
    workspace: Workspace,
    startDate: Date,
    dueDate: Date,
    progress: number,
    tasks: Task[],
    members: {
        user: User,
        role: "admin" | "member" | "owner" | "viewer"
    }[]
    createdAt: Date,
    updatedAt: Date,
    isArchived: boolean,
}

export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "High" | "Medium" | "Low"
export enum ProjectMemberRole {
    MANAGER = "manager",
    CONTRIBUTOR = "contributor",
    VIEWER = "viewer"

}
export interface Subtask {
    _id: string,
    title: string,
    completed: boolean,
    createdAt: Date,
}
export interface Attachment {
    fileName: string,
    fileUrl: string,
    fileType: string,
    fileSize: string,
    uploadedBy: string,
    uploadedAt: Date,
    _id: string
}

export interface Task {
    _id: string,
    title: string,
    description?: string,
    status: TaskStatus,
    project: Project,
    createdAt: Date,
    updatedAt: Date,
    isArchived: boolean,
    dueDate: Date,
    priority: TaskPriority,
    assignee: User | string,
    createdBy: User | string,
    assignees: User[],
    subtasks?: Subtask[],
    watchers?: User[],
    attachments?: Attachment[],
}

export interface MemberProps {
    _id: string,
    user: User
    role: "admin" | "member" | "owner" | "viewer",
    joinedAt: Date,
    workspace: Workspace
}

export interface WorkspaceHeaderProps {
    workspace: Workspace
    members: {
        _id: string
        user: User
        role: "admin" | "member" | "owner" | "viewer"
        joinedAt: Date
    }[]
    onCreateProject: () => void
    onInviteMember: () => void
}

export interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void
}

// export const RandomColors = [
//     "bg-red-500",
//     "bg-green-500",
//     "bg-blue-500",
//     "bg-yellow-500",
//     "bg-purple-500",
//     "bg-pink-500",
//     "bg-indigo-500",
//     "bg-amber-500",
//     "bg-emerald-500",
// ];
export const RandomColors = [
    // Merah
    "bg-red-500", "bg-rose-500", "bg-pink-500", "bg-fuchsia-500",
    // Oranye & Amber
    "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    // Hijau
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    // Biru
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    // Ungu
    "bg-violet-500", "bg-purple-500",
    // Netral
    "bg-stone-500", "bg-neutral-500", "bg-zinc-500", "bg-gray-500", "bg-slate-500",
]

export const colorOptions = [
    "#FF5733",
    "#33C1FF",
    "#28A745",
    "#FFC300",
    "#8E44AD",
    "#E67E22",
    "#2ECC71",
    "#34495E",
]

export interface TaskColumnProps {
    title: string
    tasks: Task[]
    onTaskClick: (taskId: string) => void
    isFullWidth?: boolean
}


export interface CreateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
    projectMembers: { user: User, role: ProjectMemberRole }[]
}

export interface SidebarNavProps extends React.HtmlHTMLAttributes<HTMLElement> {
    items: {
        title: string,
        href: string,
        icon: LucideIcon
    }[]
    isCollapsed: Boolean,
    currentWorkspace: Workspace | null,
    className?: string
}

export interface HeaderProps {
    onWorkspaceSelected: (workspace: Workspace) => void
    selectedWorkspace: Workspace | null
    onCreateWorkspace: () => void
}

export interface ProjectCardProps {
    project: Project
    progress: number
    workspaceId: string
}

export interface ProjectListProps {
    workspaceId: string,
    projects: Project[]
    onCreateProject: () => void
}

export interface CreateProjectDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    workspaceId: string
    workspaceMembers: MemberProps[]
}

export type ResourceType =
    | "Task"
    | "Project"
    | "Workspace"
    | "Comment"
    | "User";

export type ActionType =
    | "update_title"
    | "created_task"
    | "update_task"
    | "created_subtask"
    | "update_subtask"
    | "completed_task"
    | "created_project"
    | "updated_project"
    | "completed_project"
    | "created_workspace"
    | "updated_workspace"
    | "added_comment"
    | "added_member"
    | "removed_member"
    | "joined_workspace"
    | "added_attachment";

export interface ActivityLog {
    _id: string;
    user: User;
    action: ActionType;
    resourceType: ResourceType;
    resourceId: string;
    details: any;
    createdAt: Date;
}

export interface Comment {
    _id: string,
    author: User,
    text: string,
    createdAt: Date,
    reaction?: CommentReaction[],
    attachment?: {
        fileName: string,
        fileUrl: string,
        fileType: string,
        fileSize: string,
    }
}

export interface CommentReaction {
    emoji: string,
    user: User,
}

export interface StatsCardProps {
    totalProjects: number;
    totalTasks: number;
    totalProjectInProgress: number;
    totalTaskCompleted: number;
    totalTaskToDo: number;
    totalTaskInProgress: number;
}

export interface TaskTrendsData {
    name: string;
    completed: number;
    inProgress: number;
    todo: number;
}

export interface TaskPriorityData {
    name: string;
    value: number;
    color: string;
}

export interface ProjectStatusData {
    name: string;
    value: number;
    color: string;
}

export interface WorkspaceProductivityData {
    name: string;
    completed: number;
    total: number;
}

export interface StatisticsChartsProps {
    stats: StatsCardProps;
    taskTrendsData: TaskTrendsData[];
    projectStatusData: ProjectStatusData[];
    taskPriorityData: TaskPriorityData[];
    workspaceProductivityData: WorkspaceProductivityData[];
}

export interface InviteMemberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
}

export const ROLES = ["admin", "member", "viewer"] as const;