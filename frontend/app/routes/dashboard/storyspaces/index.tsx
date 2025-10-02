import { CreateStoryspace, StoryspaceCard } from "@/components/dashboard/storyspace-component"
import { Button } from "@/components/ui/button"
import Loading from "@/components/utils/loader"
import { NoDataFound } from "@/components/utils/no-data-found"
import { useGetStoryspaceQuery } from "@/hooks/use-storypace"
import type { Storyspace, User } from "@/types"
import { LucideFilePlus2 } from "lucide-react"
import { useState } from "react"

const Storyspaces = () => {
    const [isCreateStoryspace, setIsCreateStoryspace] = useState(false)
    const { data: storyspaces, isLoading } = useGetStoryspaceQuery() as {
        data: Storyspace[],
        isLoading: boolean
    }
    if (isLoading) {
        return <Loading />
    }
    return (
        <>
            <div className="space-y-8">
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                    <h2 className="text-3xl font-cabella">Storyspace</h2>
                    <Button onClick={() => setIsCreateStoryspace(true)} className='text-xs hover:bg-emerald-500' variant={'default'}><LucideFilePlus2 /></Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {
                        // storyspaces.map((ss) => (
                        //     <StoryspaceCard key={ss._id} storyspace={ss} />
                        // ))
                    }
                    {storyspaces.length === 0 && <NoDataFound title='Cerita anda tidak tersedia'
                        description='Tulis cerita terbaik anda disini'
                        buttonText='Create Story'
                        buttonAction={() => setIsCreateStoryspace(true)} />
                    }
                </div>
            </div>
            <CreateStoryspace
                isCreatingStoryspace={isCreateStoryspace}
                setIsCreatingStoryspace={setIsCreateStoryspace}
            />
        </>
    )
}

export default Storyspaces