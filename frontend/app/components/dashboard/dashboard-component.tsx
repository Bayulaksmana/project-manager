import { colorOptions, type Comment, type Project, type StatisticsChartsProps, type StatsCardProps, type Task } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { ChartBarBig, ChartLine, ChartPie, CheckCircle2, Circle, ClockArrowUpIcon, LucideDot, LucideHeartHandshake, LucideUserRoundCheck } from "lucide-react"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Link, useSearchParams } from "react-router"
import { getProjectProgress, getTaskStatusColor } from "@/lib"
import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { truncateWords } from "../utils/title-cilik"

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
                                <ChartTooltip content={<ChartTooltipContent />} />
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
                                <Legend />
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
                <CardContent className="w-full">
                    <ChartContainer
                        className="h-[250px] w-full"
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
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                        </PieChart>
                    </ChartContainer>
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
                    <div className="w-full ">
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
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
            {/* Workspace Productivity Chart */}
            <Card className="col-span-1 md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">
                        Workspace Productivity
                        <CardDescription>Task completion by project</CardDescription>
                    </CardTitle>
                    <ChartBarBig className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="overflow-hidden">
                    <ChartContainer
                        className=" h-[250px] md:w-[56vw]"
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
                                stroke="#6366F1"
                                fontSize={13}
                                tickLine={false}
                                axisLine={false}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="total"
                                fill="#BE185D"
                                radius={[4, 4, 0, 0]}
                                name="Total Tasks"
                            />
                            <Bar
                                dataKey="completed"
                                fill="#6366F1"
                                radius={[4, 4, 0, 0]}
                                name="Completed Tasks"
                            />
                            <Legend />
                        </BarChart>
                    </ChartContainer>
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

export const DashboardSummaryCard = ({ icon, label, value, bgColor, color }: { icon: React.ReactNode, label: string, value: number, bgColor: string, color: string }) => {
    return (
        <div className="flex items-center space-x-4 p-4 gap-2 border rounded-lg">
            <div className={`w-10 md:w-8 md:h-8 flex items-center justify-center ${color} ${bgColor} rounded-sm`}>
                {icon}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
                <span className="text-sm md:text-[15px] text-black font-semibold">{value}</span>
            </p>{" "}{label}
        </div>
    )
}

export const TagInsight = ({ tagUsage }: { tagUsage: any }) => {
    const processedData = (() => {
        if (!tagUsage) return []
        const sorted = [...tagUsage].sort((a: any, b: any) => b.count - a.count)
        const topFive = sorted.slice(0, 10)
        const others = sorted.slice(10)
        const othersCount = others.reduce((sum: number, item: any) => sum + item.count, 0)
        const finalData = topFive.map((item: any) => ({
            ...item,
            name: item.tag || ""
        }))
        if (othersCount > 0) {
            finalData.push({ name: "Others", count: othersCount, color: "#d1d5db" })
        }
        return finalData
    })()
    return (
        <div className="grid grid-cols-12 justify-between m-2">
            <div className="col-span-12 md:col-span-7">
                <CostumPieChart data={processedData} colors={colorOptions} />
            </div>
            <div className="col-span-12 md:col-span-5 mt-5 md:mt-0 ">
                <TagCloud tags={
                    tagUsage.slice(0, 15).map((item: any) => ({
                        ...item,
                        name: item.tag || "",
                    })) || []
                }
                />
            </div>
        </div>
    )
}

const TagCloud = ({ tags }: { tags: { name: string; count: number; color?: string }[] }) => {
    const maxCount = Math.max(...tags.map(tag => tag.count), 1);
    return (
        <div className="flex flex-wrap gap-2 md:mt-4">
            {tags.map((tag) => {
                const fontSize = 10 + (tag.count / maxCount) * 5; // Scale font size between 12px and 28px
                return (
                    <span
                        key={tag.name}
                        style={{ fontSize: `${fontSize}px`, backgroundColor: tag.color }}
                        className="px-3 font-medium text-emerald-900/80 bg-emerald-100 py-0.5 rounded-lg"
                    >
                        #{tag.name.split(" ")
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(" ")}
                        {/* ({tag.count}) */}
                    </span>
                )
            })}
        </div>
    )
}

const CostumPieChart = ({ data, colors }: { data: any[], colors: string[] }) => {
    return (
        <Card className="md:m-4 " >
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold">
                    Tags Insight Post
                </CardTitle>
                <ChartPie className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <ChartContainer
                    className="w-full h-[200px]"
                    config={{
                        others: { color: "#d1d5db" },
                    }}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            dataKey="count"
                            nameKey="tag"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                            }
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card >
    )
}

export const TopPostCard = ({ title, views, likes, imgUrl, maxView, author, created, email }: { title: string; imgUrl: string; views: number; likes: number; maxView: number; author: string, created: string; email: string }) => {
    const viewPercentage = ((views / maxView) * 100).toFixed(0);
    return (
        <div className="flex flex-col border border-gray-200 bg-emerald-50 p-2 mb-2 shadow-xs rounded-lg">
            <div className="flex items-center gap-2">
                <img src={imgUrl} alt={title} className="w-10 h-10 rounded-md object-cover mb-1" />
                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col flex-wrap">
                        <p className="text-md font-medium text-slate-600">{truncateWords(title, 4)}</p>
                        <p className="text-xs text-muted-foreground flex">{created}&nbsp;<ClockArrowUpIcon className="w-3 h-3 text-sky-600" /></p>
                    </div>
                    <span className="flex flex-col items-end justify-end">
                        <p className="text-muted-foreground text-xs hidden md:block">@{author}</p>
                        {/* <p className="text-muted-foreground text-xs hidden md:block ">{email}</p> */}
                    </span>
                </div>
            </div>
            <div className="relative h-2 w-full bg-emerald-200/60 rounded-full mb-1">
                <div className="h-full bg-liniear-to-r from-emerald-700 to-green-400 rounded-full transition-all duration-300" style={{ width: `${viewPercentage}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span className="flex items-center gap-1 text-xs">
                    <LucideUserRoundCheck className="w-3 h-3" />{views} Views
                </span>
                <span className="flex items-center gap-1 text-xs">
                    <LucideHeartHandshake className="w-3 h-3" /> {likes} Likes
                </span>
            </div>
        </div>
    )
}

export const RecentCommentList = ({ comments }: { comments: Comment[] }) => {
    return (
        <div className="mt-4">
            <ul className="space-y-1">
                {comments?.slice(0, 10)?.map((comment: any) => (
                    <li className="flex gap-4 borde-b border-gray-700 pb-4 last:border-none" key={comment._id}>
                        <img src={comment.author?.profilePicture} alt={comment.author?.name} className="w-10 h-10 rounded-full object-cover border-1 border-amber-200" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div className="">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-[13px] text-muted-foreground">
                                            @{comment.author?.name}
                                        </p>
                                        <LucideDot className="text-muted-foreground" />
                                        <span className="text-[12px] text-muted-foreground font-medium">
                                            {comment.createdAt
                                                ? format(new Date(comment.createdAt), "dd MMM yyyy - HH:mm", { locale: id })
                                                : "Unknown"}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-black">{comment.content}</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <img src={comment.post?.imgUrl} alt={comment.post?.title} className="w-10 h-10 rounded-md object-cover border-1 border-sky-300" />
                                <div className="flex flex-col">
                                    <p className="text-[13px] text-gray-700 line-clamp-2">{comment.post?.title}</p>
                                    <span className="text-xs text-muted-foreground">Created by :&nbsp;<span className="font-medium">@{comment.post?.author?.name}</span></span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}