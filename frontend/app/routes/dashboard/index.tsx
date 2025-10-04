import { DashboardSummaryCard, RecentCommentList, RecentProjects, StatisticsCharts, StatsCard, TagInsight, TopPostCard, UpcomingTasks } from "@/components/dashboard/dashboard-component";
import { NoDataFound } from "@/components/utils/no-data-found";
import { useGetDashboardSummaryQuery, useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import { useAuth } from "@/providers/auth-context";
import type { Project, ProjectStatusData, StatsCardProps, Task, TaskPriorityData, TaskTrendsData, WorkspaceProductivityData } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LucideChartBar, LucideChartLine, LucideFileBadge2, LucideGalleryVerticalEnd, LucideHeartHandshake, LucideMessageSquareDot, LucideUserCircle2, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const Dashboard = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");
    const today = new Date()
    const navigate = useNavigate()
    const [maxView, setMaxView] = useState(0)
    const { data: dashboard } = useGetDashboardSummaryQuery()
    const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
        data: {
            stats: StatsCardProps;
            taskTrendsData: TaskTrendsData[];
            projectStatusData: ProjectStatusData[];
            taskPriorityData: TaskPriorityData[];
            workspaceProductivityData: WorkspaceProductivityData[];
            upcomingTasks: Task[];
            recentProjects: Project[];
        };
        isPending: boolean;
    }
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mt-8 md:mt-0">
                <h1 className="font-cabella font-bold text-3xl">Dashboard Dega Nion Don </h1>
                <span className="text-sm xl:w-1/7 hidden sm:block text-end ">
                    <h1 className="font-semibold text-slate-700">
                        {user?.name.split(" ")
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(" ")} - {user?.role}
                    </h1>
                    <p className="text-xs text-muted-foreground">{format(today, "EEEE, dd MMMM yyyy", { locale: id })}</p>
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <DashboardSummaryCard
                    icon={<LucideGalleryVerticalEnd />}
                    label="Total Posts"
                    value={dashboard?.stats.totalPosts || 0}
                    bgColor="bg-sky-100/60"
                    color="text-sky-800"
                />
                <DashboardSummaryCard
                    icon={<LucideFileBadge2 />}
                    label="Published"
                    value={dashboard?.stats.published || 0}
                    bgColor="bg-sky-100/60"
                    color="text-sky-500"
                />
                <DashboardSummaryCard
                    icon={<LucideChartLine />}
                    label="Views"
                    value={dashboard?.stats.views || 0}
                    bgColor="bg-sky-100/60"
                    color="text-sky-800"
                />
                <DashboardSummaryCard
                    icon={<LucideHeartHandshake />}
                    label="Likes"
                    value={dashboard?.stats.likes || 0}
                    bgColor="bg-sky-100/60"
                    color="text-sky-500"
                />
                <DashboardSummaryCard
                    icon={<LucideUserCircle2 />}
                    label="User Active"
                    value={dashboard?.stats.totalUsers || 0}
                    bgColor="bg-sky-100/60"
                    color="text-sky-800"
                />
                <DashboardSummaryCard
                    icon={<LucideMessageSquareDot />}
                    label="Comments"
                    value={dashboard?.stats.totalComments || 0}
                    bgColor="bg-sky-100/60"
                    color="text-sky-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-8">
                <div className="col-span-12 md:col-span-7 bg-amber-50 rounded-lg shadow-lg border shadow-gray-100 border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <TagInsight tagUsage={dashboard?.tagUsage || []} />
                    </div>
                </div>
                <div className=" col-span-12 md:col-span-5 p-4 rounded-lg shadow-lg border shadow-gray-100 border-gray-200/50">
                    <div className="flex items-center justify-between mx-2 mb-1 ">
                        <h5 className="font-bold">Top Posts</h5>
                        <LucideChartBar className="text-muted-foreground h-5 w-5" />
                    </div>
                    {dashboard?.trendingPosts?.slice(0, 3).map((post) => (
                        <TopPostCard
                            key={post._id}
                            title={post.title}
                            imgUrl={post.imgUrl}
                            views={post.views}
                            likes={post.likes}
                            author={post.author.name}
                            email={post.author?.email || ""}
                            created={format(new Date(post.createdAt), "dd MMM yyyy", { locale: id })}
                            maxView={maxView}
                        />
                    ))}
                </div>
                <div className="col-span-12 bg-white p-4 rounded-lg shadow-lg border shadow-gray-100 border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <h5 className="font-medium">Recent Comment</h5>
                    </div>
                    <RecentCommentList comments={dashboard?.recentComments || []} />
                </div>
            </div>

            {workspaceId ? (isPending ? ("") : (
                <div className="col-span-12 space-y-6">
                    <StatsCard data={data.stats} />
                    <StatisticsCharts
                        stats={data.stats}
                        taskTrendsData={data.taskTrendsData}
                        projectStatusData={data.projectStatusData}
                        taskPriorityData={data.taskPriorityData}
                        workspaceProductivityData={data.workspaceProductivityData}
                    />
                    <div className="flex gap-6 pb-8">
                        <RecentProjects data={data.recentProjects} />
                        <UpcomingTasks data={data.upcomingTasks} />
                    </div>
                </div>
            )) : (
                <div className="mt-20">
                    <NoDataFound title='Monitoring dashboard'
                        description='Buat ruang kerja terlebih dahulu atau pilih Ruang Kerja'
                        buttonText='Select Workspace'
                        buttonAction={() => { }}
                    />
                </div>
            )}
        </div>
    )
}

export default Dashboard