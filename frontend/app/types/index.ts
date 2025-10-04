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
    role: "admin" | "member" | "owner" | "viewer",
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


export interface Carousel {
    _id: string,
    user: User,
    img: string,
    title: string,
    total: number,
    description: string,
    website: string,
    createdAt: Date,
    updateAt: Date,
}

export interface Storyspace {
    _id: string,
    user: User
    author: User
    title: string,
    desc?: string,
    imgUrl: string,
    owner: User | string,
    slug: string,
    tags: string[],
    isDratf: boolean,
    views: number,
    likes: number,
    comments: number,
    isDeeleted: boolean,
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
    projects: Project[]
    onCreateProject: () => void
    onInviteMember: () => void
}

export interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void
}

export const RandomColors = [
    // Merah
    // Emerald & Green shades
    "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#064E3B",
    // Blue shades
    "#3B82F6", "#2563EB", "#1D4ED8", "#60A5FA", "#93C5FD",
    // Indigo & Purple shades
    "#6366F1", "#4F46E5", "#4338CA", "#818CF8", "#A5B4FC",
    "#8B5CF6", "#7C3AED", "#6D28D9", "#C4B5FD", "#DDD6FE",
    // Red shades
    "#EF4444", "#DC2626", "#B91C1C", "#F87171", "#FCA5A5",
    // Orange & Amber shades
    "#F97316", "#EA580C", "#C2410C", "#FDBA74", "#FED7AA",
    "#F59E0B", "#D97706", "#B45309", "#FCD34D", "#FDE68A",
    // Yellow shades
    "#EAB308", "#CA8A04", "#A16207", "#FACC15", "#FEF08A",
    // Pink & Rose shades
    "#EC4899", "#DB2777", "#BE185D", "#F472B6", "#FDA4AF",
    "#F43F5E", "#E11D48", "#9F1239", "#FB7185", "#FDA4AF",
    // Gray / Neutral shades
    "#6B7280", "#4B5563", "#374151", "#9CA3AF", "#D1D5DB", "#E5E7EB",
    // Cyan & Teal
    "#06B6D4", "#0891B2", "#155E75", "#67E8F9", "#A5F3FC",
    "#14B8A6", "#0D9488", "#115E59", "#5EEAD4", "#99F6E4",
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
    post: Storyspace,
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


export interface DashboardStats {
    totalPosts: number;
    drafts: number;
    published: number;
    views: number;
    likes: number;
    totalComments: number;
    aiGenerated: number;
    totalUsers: number;
}

export interface TrendingPost {
    _id: string;
    title: string;
    imgUrl?: string;
    views: number;
    likes: number;
}

export interface RecentComment {
    _id: string;
    post: {
        title: string;
        imgUrl?: string;
    };
    author: {
        username: string;
        profilePicture?: string;
    };
    createdAt: string;
}

export interface UserSummary {
    _id: string;
    name: string;
    profilePicture?: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
}

export interface TagUsage {
    tag: string;
    count: number;
}

export interface DashboardResponse {
    stats: DashboardStats;
    trendingPosts: Storyspace[];
    recentComments: Comment[];
    user: User[];
    tagUsage: Storyspace[];
}




