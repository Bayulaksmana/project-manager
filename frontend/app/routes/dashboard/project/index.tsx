import { CreateTaskDialog, TaskColumn } from "@/components/dashboard/task-component"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackButton } from "@/components/utils/back-button"
import Loading from "@/components/utils/loader"
import { UseProjectQuery } from "@/hooks/use-project"
import { getProjectProgress } from "@/lib"
import type { Project, Task, TaskStatus } from "@/types"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"

const ProjectDetails = () => {
    const { projectId, workspaceId } = useParams<{ projectId: string, workspaceId: string }>()
    const navigate = useNavigate()
    const [isCreateTask, setIsCreateTask] = useState(false)
    const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All")
    const { data, isLoading } = UseProjectQuery(projectId!) as { data: { tasks: Task[], project: Project }, isLoading: boolean }
    if (isLoading) return <div className=""><Loading /></div>
    if (!data) <div className=""><Loading /></div>
    const { project, tasks } = data
    const projectProgress = getProjectProgress(tasks)
    const handleTaskClick = (taskId: string) => { navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`) }
    return (
        <div className="space-y-4">
            <div className="flex flex-col mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-xl text-justify sm:text-2xl font-semibold">{project.title}</h1>
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-xs text-muted-foreground">Progress:</span>
                            <span className="flex-1 w-20 sm:w-xs"><Progress value={projectProgress} className="h-2" /></span>
                            <span className="text-xs text-muted-foreground">{projectProgress}%</span>
                        </div>
                        <Button variant={"outline"} size={"sm"} onClick={() => setIsCreateTask(true)} className="hover:bg-emerald-200"><FilePlus2 /></Button>
                        <BackButton />
                    </div>
                </div>
                {project.description && (
                    <p className="text-sm text-gray-500 text-justify mt-4 sm:m-0 sm:mt-4">{project.description}</p>
                )}
            </div>
            <div className="flex items-center justify-center">
                <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <TabsList>
                            <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>All Tasks</TabsTrigger>
                            <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>To Do</TabsTrigger>
                            <TabsTrigger value="in-progress" onClick={() => setTaskFilter("In Progress")}>In Progress</TabsTrigger>
                            <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>Done</TabsTrigger>
                        </TabsList>
                        <div className="flex items-center text-sm">
                            <span className="text-muted-foreground">Status :&nbsp;</span>
                            <div className="flex gap-1">
                                <Badge variant={"outline"} className="bg-amber-500">{tasks.filter((task) => task.status === "To Do").length} To Do</Badge>
                                <Badge variant={"outline"} className="bg-blue-500">{tasks.filter((task) => task.status === "In Progress").length}{" "} In Progress</Badge>
                                <Badge variant={"outline"} className="bg-emerald-500">{tasks.filter((task) => task.status === "Done").length} Done</Badge>
                            </div>
                        </div>
                    </div>
                    <TabsContent value="all" className="mt-4 mb-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={tasks.filter((task) => task.status === "To Do")}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="In Progress"
                                tasks={tasks.filter((task) => task.status === "In Progress")}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="Done"
                                tasks={tasks.filter((task) => task.status === "Done")}
                                onTaskClick={handleTaskClick}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="todo" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={tasks.filter((task) => task.status === "To Do")}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="in-progress" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="In Progress"
                                tasks={tasks.filter((task) => task.status === "In Progress")}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="done" className="m-0">
                        <div className="grid md:grid-cols-1 gap-4">
                            <TaskColumn
                                title="Done"
                                tasks={tasks.filter((task) => task.status === "Done")}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <CreateTaskDialog
                open={isCreateTask}
                onOpenChange={setIsCreateTask}
                projectId={projectId!}
                projectMembers={project.members as any}
            />
        </div>
    )
}

export default ProjectDetails
