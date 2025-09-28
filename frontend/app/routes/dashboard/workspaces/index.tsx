import { CreateWorkspace, WorkspaceCard } from '@/components/dashboard/workspace-component'
import { Button } from '@/components/ui/button'
import Loading from '@/components/utils/loader'
import { NoDataFound } from '@/components/utils/no-data-found'
import { useGetWorkspacesQuery } from '@/hooks/use-workspace'
import type { Workspace } from '@/types'
import { CopyPlus } from 'lucide-react'
import React, { useState } from 'react'

const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
        data: Workspace[],
        isLoading: boolean
    }
    if (isLoading) {
        return <Loading />
    }
    return (
        <>
            <div className="space-y-8 ">
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                    <h2 className="text-3xl font-cabella">Workspace Area</h2>
                    <Button onClick={() => setIsCreatingWorkspace(true)} className='text-xs hover:bg-emerald-300' variant={'outline'}><CopyPlus /><span className="hidden sm:block"> New Workspace</span></Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-10 ">
                    {
                        workspaces.map((ws) => (
                            <WorkspaceCard key={ws._id} workspace={ws} />
                        ))
                    }
                    {workspaces.length === 0 && <NoDataFound title='Ruang kerja tidak tersedia'
                        description='Buat ruang kerja terlebih dahulu'
                        buttonText='Create Workspace'
                        buttonAction={() => setIsCreatingWorkspace(true)} />
                    }
                </div>
            </div>
            <CreateWorkspace
                isCreatingWorkspace={isCreatingWorkspace}
                setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
        </>
    )
}

export default Workspaces