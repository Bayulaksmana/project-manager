import { BackButton } from "@/components/back-button"
import Loading from "@/components/loader"
import { CommentSection, SubTasksDetails, TaskActivity, TaskAssigneesSelector, TaskDescription, TaskPrioritySelector, TaskStatusSelector, TaskTitle, Watchers } from "@/components/taks/task-component"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTaskByIdQuery } from "@/hooks/use-task"
import { useAuth } from "@/providers/auth-context"
import type { Project, Task } from "@/types"
import { format, formatDistanceToNow } from "date-fns"
import { Archive, ArchiveIcon, ArchiveXIcon, Eye, EyeOff, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router"

const TaskDetails = () => {
    const { user } = useAuth()
    const { taskId, projectId, workspaceId } = useParams<{ taskId: string, projectId: string, workspaceId: string }>()
    const navigate = useNavigate()
    const { data, isLoading } = useTaskByIdQuery(taskId!) as {
        data: {
            task: Task
            project: Project
        }
        isLoading: boolean
    }
    if (isLoading) { return <Loading /> }
    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-2xl font-bold">Task not found</div>
            </div>)
    }
    const { task, project } = data
    const isUserWatching = task.watchers?.some(
        (watcher) => watcher._id.toString() === user?._id.toString()
    )
    const goBack = () => navigate(-1)
    const members = task?.assignees || []
    return (
        <div className="container mx-auto p-0 py-2 sm:px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                <div className="flex mt-2 sm:mt-0 md:flex-row md:items-center gap-2 justify-center sm:justify-between">
                    <h1 className="text-lg font-bold md:text-xl">{task.title}</h1>
                    {task.isArchived && <Badge title="Is Archived" className="bg-emerald-300" variant="outline"><Archive /></Badge>}
                </div>
                <div className="flex mt-2 md:mt-0 gap-2">
                    <Button variant={"outline"} size={"sm"} onClick={() => { }} className="w-fit hover:bg-emerald-200">
                        {isUserWatching ? (<><EyeOff className="size-4" />Unwatch</>)
                            : (<><Eye className="size-4" /><span className="sm:block hidden">Watch</span></>)}
                    </Button>
                    <Button variant={"outline"} size={"sm"} className="w-fit hover:bg-emerald-200">
                        {task.isArchived ? (<><ArchiveXIcon className="size-4" />Unarchived</>)
                            : (<><Archive className="size-4" /><span className="sm:block hidden">Archive</span></>)}
                    </Button>
                    <BackButton />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="sm:col-span-2 w-full">
                    <div className="bg-card rounded-lg p-6 shadow-xl space-y-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <div className="">
                                <Badge className={
                                    task.priority === "High"
                                        ? "bg-red-600 text-white"
                                        : task.priority === "Medium"
                                            ? "bg-orange-500 text-white"
                                            : "bg-blue-500 text-white"
                                }>
                                    {task.priority} Priority
                                </Badge>
                                <TaskTitle title={task.title} taskId={task._id} />
                                <div className="text-xs text-muted-foreground">
                                    Created at :&nbsp;
                                    {formatDistanceToNow(new Date(task.createdAt), {
                                        addSuffix: true
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <TaskPrioritySelector priority={task.priority} taskId={task._id} />
                                <TaskStatusSelector status={task.status} taskId={task._id} />
                                <Button title="Delete" variant={"destructive"} size={"default"} onClick={() => { }} className="items-center mt-4">
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                        <div className="">
                            <h3 className="text-sm text-muted-foreground font-medium mb-2">Description</h3>
                            <TaskDescription description={task.description || ""} taskId={task._id} />
                        </div>
                        <TaskAssigneesSelector task={task} assignees={task.assignees} projectMembers={project.members as any} />
                        <SubTasksDetails subTasks={task.subtasks || []} taskId={task._id} />
                    </div>
                    <CommentSection taskId={task._id} members={project.members as any} />
                </div>
                <div className="w-fit">
                    <Watchers watchers={task.watchers || []} />
                    <TaskActivity resourceId={task._id} />
                </div>
            </div>
        </div>
    )
}

export default TaskDetails