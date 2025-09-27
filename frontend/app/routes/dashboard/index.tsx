import { RecentProjects, StatisticsCharts, StatsCard, UpcomingTasks } from "@/components/dashboard/dashboard-component";
import Loading from "@/components/loader"
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover } from "@/components/ui/popover";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type { Project, ProjectStatusData, StatsCardProps, Task, TaskPriorityData, TaskTrendsData, WorkspaceProductivityData } from "@/types";
import { useParams, useSearchParams } from "react-router";

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId");
    if (!workspaceId) {
        return <NoDataFound title='Monitoring dashboard'
            description='Buat ruang kerja terlebih dahulu atau pilih Ruang Kerja'
            buttonText='Select Workspace'
            buttonAction={() => { }}
        />
    }
    const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId ?? "") as {
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
    };
    if (isPending) {
        return (
            <div>
                <Loading />
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="font-cabella font-bold text-3xl">Welcome to my Dashboard</h1>
            </div>
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
    )
}

export default Dashboard