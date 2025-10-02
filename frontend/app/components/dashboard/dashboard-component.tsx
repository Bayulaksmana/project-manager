import type { Project, StatisticsChartsProps, StatsCardProps, Task } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartBarBig, ChartLine, ChartPie, CheckCircle2, Circle } from "lucide-react"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Link, useSearchParams } from "react-router"
import { getProjectProgress, getTaskStatusColor } from "@/lib"
import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"
import { format } from "date-fns"

export const StatsCard = ({ data }: { data: StatsCardProps }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.totalProjectInProgress} in progress
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalTasks}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.totalTaskCompleted} completed
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">To Do</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalTaskToDo}</div>
                    <p className="text-xs text-muted-foreground">
                        Tasks waiting to be done
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalTaskInProgress}</div>
                    <p className="text-xs text-muted-foreground">
                        Tasks currently in progress
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export const StatisticsCharts = ({ stats, taskTrendsData, projectStatusData, taskPriorityData, workspaceProductivityData, }: StatisticsChartsProps) => {
    return (
        <div className="grid h-full gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-medium">Task Trends</CardTitle>
                        <CardDescription>Daily task status changes</CardDescription>
                    </div>
                    <ChartLine className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="w-full items-center justify-center flex">
                        <ChartContainer
                            className="h-[250px] min-w-[300px] w-[1000px] -ml-10"
                            config={{
                                completed: { color: "#10b981" }, // green
                                inProgress: { color: "#f59e0b" }, // blue
                                todo: { color: "#3b82f6" }, // gray
                            }}
                        >
                            <LineChart data={taskTrendsData}>
                                <XAxis
                                    dataKey={"name"}
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />

                                <CartesianGrid strokeDasharray={"3 3"} vertical={false} />
                                <ChartTooltip />

                                <Line
                                    type="monotone"
                                    dataKey={"completed"}
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="inProgress"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="todo"
                                    stroke="#6b7280"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />

                                <ChartLegend content={<ChartLegendContent />} />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* project status  */}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="">
                        <CardTitle className="text-base font-medium">
                            Project Status
                        </CardTitle>
                        <CardDescription>Project status breakdown</CardDescription>
                    </div>
                    <ChartPie className="size-5 text-muted-foreground" />
                </CardHeader>

                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="min-w-full">
                        <ChartContainer
                            className="h-full"
                            config={{
                                Completed: { color: "#10b981" },
                                "In Progress": { color: "#3b82f6" },
                                Planning: { color: "#f59e0b" },
                            }}
                        >
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={false}
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* task priority  */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="">
                        <CardTitle className="text-base font-medium">
                            Task Priority
                        </CardTitle>
                        <CardDescription>Task priority breakdown</CardDescription>
                    </div>
                    <ChartPie className="size-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="w-full">
                        <ChartContainer
                            className="h-full"
                            config={{
                                High: { color: "#ef4444" },
                                Medium: { color: "#f59e0b" },
                                Low: { color: "#6b7280" },
                            }}
                        >
                            <PieChart>
                                <Pie
                                    data={taskPriorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {taskPriorityData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
            {/* Workspace Productivity Chart */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="">
                        <CardTitle className="text-base font-medium">
                            Workspace Productivity
                        </CardTitle>
                        <CardDescription>Task completion by project</CardDescription>
                    </div>
                    <ChartBarBig className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
                    <div className="min-w-[350px]">
                        <ChartContainer
                            className="h-[300px]"
                            config={{
                                completed: { color: "#3b82f6" },
                                total: { color: "red" },
                            }}
                        >
                            <BarChart
                                data={workspaceProductivityData}
                                barGap={0}
                                barSize={20}
                            >
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="total"
                                    fill="#000"
                                    radius={[4, 4, 0, 0]}
                                    name="Total Tasks"
                                />
                                <Bar
                                    dataKey="completed"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    name="Completed Tasks"
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export const RecentProjects = ({ data }: { data: Project[] }) => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No Recent project yet
                    </p>
                ) : (
                    data.map((project) => {
                        const projectProgress = getProjectProgress(project.tasks);
                        return (
                            <div key={project._id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Link
                                        to={`/workspaces${workspaceId}/projects/${project._id}`}
                                    >
                                        <h3 className="font-medium hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                    </Link>
                                    <span
                                        className={cn(
                                            "px-2 py-1 text-xs rounded-full",
                                            getTaskStatusColor(project.status)
                                        )}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Progress</span>
                                        <span>{projectProgress}%</span>
                                    </div>
                                    <Progress value={projectProgress} className="h-2" />
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
};

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Here are the tasks that are due soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        No upcoming tasks yet
                    </p>
                ) : (
                    data.map((task) => (
                        <Link
                            to={`/workspaces${workspaceId}/projects/${task.project}/tasks/${task._id}`}
                            key={task._id}
                            className="flex items-start space-x-3 border-b pb-3 last:border-0"
                        >
                            <div
                                className={cn(
                                    "mt-0.5 rounded-full p-1",
                                    task.priority === "High" && "bg-red-100 text-red-700",
                                    task.priority === "Medium" && "bg-yellow-100 text-yellow-700",
                                    task.priority === "Low" && "bg-gray-100 text-gray-700"
                                )}
                            >
                                {task.status === "Done" ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <Circle className="w-4 h-4" />
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="font-medium text-sm md:text-base">{task.title}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <span>{task.status}</span>
                                    {task.dueDate && (
                                        <>
                                            <span className="mx-1"> - </span>
                                            <span>
                                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

