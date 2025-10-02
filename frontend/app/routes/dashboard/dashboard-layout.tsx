import { Header, SidebarComponent } from '@/components/dashboard/navigation-component'
import { CreateWorkspace } from '@/components/dashboard/workspace-component'
import Loading from '@/components/utils/loader'
import { fetchData } from '@/lib/fetch-utils'
import { useAuth } from '@/providers/auth-context'
import type { Workspace } from '@/types'
import { useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { toast } from 'sonner'

export const clientLoader = async () => {
    try {
        // const [dashboard] = await Promise.all([fetchData("dashboard")])
        const [workspaces] = await Promise.all([fetchData("/workspaces")])
        // console.log(dashboard)
        return { workspaces }
    } catch (error) {
        console.log(error)
        toast.error("Belahan dunia terbelah dan kamu masih disini?")
    }
}

const DashboardLayout = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
    if (isLoading) {
        return <Loading />
    }
    if (!isAuthenticated) {
        return <Navigate to={"/sign-in"} />
    }
    const handleWorkspaceSelected = (workspace: Workspace) => {
        setCurrentWorkspace(workspace)
    }

    return (
        <div className='flex h-screen w-full'>
            <SidebarComponent currentWorkspace={currentWorkspace} />
            <div className="flex flex-1 flex-col h-full">
                <Header
                    onWorkspaceSelected={handleWorkspaceSelected}
                    selectedWorkspace={currentWorkspace}
                    onCreateWorkspace={() => setIsCreatingWorkspace(true)}
                />
                <main className='flex-1 overflow-y-auto w-full'>
                    <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
                        <Outlet />
                    </div>
                </main>
                <CreateWorkspace
                    isCreatingWorkspace={isCreatingWorkspace}
                    setIsCreatingWorkspace={setIsCreatingWorkspace}
                />
            </div>
        </div>
    )
}

export default DashboardLayout