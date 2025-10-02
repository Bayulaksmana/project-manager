import { CreateProjectDialog, ProjectList } from "@/components/dashboard/project-component"
import { InviteMemberDialog, WorkspaceHeader } from "@/components/dashboard/workspace-component"
import Loading from "@/components/utils/loader"
import { useGetWorkspaceQuery } from "@/hooks/use-workspace"
import type { Project, Workspace } from "@/types"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"

const WorkspaceDetails = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>()
    const [isCreateProject, setIsCreateProject] = useState(false)
    const [isInviteMember, setIsInviteMember] = useState(false)
    if (!workspaceId) { return <div className="flex items-center gap-4 text-muted-foreground"><Loader2 className='w-4 h-4 animate-spin' />Workspace not found</div> }
    const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
        data: { workspace: Workspace, projects: Project[] }
        isLoading: boolean
    }
    if (isLoading) { return <Loading /> }
    return (
        <div className="space-y-4">
            <WorkspaceHeader
                workspace={data?.workspace}
                members={data?.workspace?.members as any}
                onCreateProject={() => setIsCreateProject(true)}
                onInviteMember={() => setIsInviteMember(true)}
                projects={data.projects}
            />
            <ProjectList
                workspaceId={workspaceId}
                projects={data.projects}
                onCreateProject={() => setIsCreateProject(true)}
            />
            <CreateProjectDialog
                isOpen={isCreateProject}
                onOpenChange={setIsCreateProject}
                workspaceId={workspaceId}
                workspaceMembers={data.workspace.members as any}
            />
            <InviteMemberDialog
                isOpen={isInviteMember}
                onOpenChange={setIsInviteMember}
                workspaceId={workspaceId}
            />
        </div>
    )
}

export default WorkspaceDetails