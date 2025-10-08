import { CreateStoryspace, StoryPostSummaryCard, TabsCostum } from "@/components/dashboard/storyspace-component"
import { Button } from "@/components/ui/button"
import Loading from "@/components/utils/loader"
import { useGetStoryspaceQuery } from "@/hooks/use-storypace"
import type { Storyspace, StoryspaceProps, StoryStatus } from "@/types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { LucideFilePlus2, LucideGalleryVerticalEnd, LucideLoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const Storyspaces = () => {
    const navigate = useNavigate()
    const [tabs, setTabs] = useState<{ label: string; count: number }[]>([]);
    const [filterStatus, setFilterStatus] = useState<StoryStatus>("all")
    const [storyList, setStoryList] = useState<Storyspace[]>([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages, setTotalPages] = useState<number | null>(null)
    const [isCreateStoryspace, setIsCreatingStoryspace] = useState(false)
    const { data: response } = useGetStoryspaceQuery(filterStatus, page) as { data: StoryspaceProps }
    useEffect(() => {
        if (!response) return
        const { posts, totalPages, counts } = response;
        setTotalPages(totalPages ?? 1);
        setStoryList(posts);
        const statusArray = [
            { label: "All", count: counts.all || 0 },
            { label: "Published", count: counts.published || 0 },
            { label: "Draft", count: counts.draft || 0 },
            { label: "Deleted", count: counts.deleted || 0 },
        ];
        setTabs(statusArray);
    }, [response]);
    const handleMore = () => {
        if (page < (totalPages ?? 1)) {
            setPage((prev) => prev + 1)
        }
    }
    const handleNext = (filters: { type: string; category: string; description: string }) => {
        const params = new URLSearchParams(filters).toString()
        navigate(`/create?${params}`, { state: filters })
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mt-4 md:mt-0 bg-white">
                <h2 className="text-3xl font-cabella">Storyspace</h2>
                <Button
                    onClick={() => setIsCreatingStoryspace(true)}
                    className='text-xs hover:bg-emerald-300 font-medium'
                    variant={'outline'}
                    size={"sm"}
                >
                    <LucideFilePlus2 />
                    <span className="hidden sm:block font-medium">New Story</span>
                </Button>
            </div>
            <TabsCostum
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={(val: StoryStatus) => {
                    setFilterStatus(val.toLowerCase() as StoryStatus);
                }}
            />
            <div className="mt-5 rounded-md">
                {storyList.map((post) => (
                    <StoryPostSummaryCard
                        key={post._id}
                        postId={post._id}
                        title={post.title}
                        imgUrl={post.imgUrl}
                        updateOn={
                            post.updatedAt && post.updatedAt !== post.createdAt
                                ? (
                                    <span className="text-blue-500 font-medium">
                                        Updated: {format(new Date(post.updatedAt), "dd MMM yyyy - HH:mm", { locale: id })}
                                    </span>
                                ) : (
                                    <span className="text-green-500 font-medium">
                                        Created: {format(new Date(post.createdAt), "dd MMM yyyy - HH:mm", { locale: id })}
                                    </span>
                                )
                        }
                        tags={post.tags}
                        likes={post.likes}
                        views={post.views}
                        isDeleted={post.isDeleted}
                        onClick={() => navigate(`/dashboard/edit/${post.slug}`)}
                    />
                ))}
                {page < (totalPages ?? 0) && (
                    <div className="flex items-center justify-center mt-8">
                        <button
                            className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-1.5 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                            disabled={isLoading}
                            onClick={handleMore}
                        >
                            {isLoading
                                ? (<span className="flex gap-2 items-center"><LucideLoaderCircle className="animate-spin text-[15px]" />Loading...</span>)
                                : (<span className="flex gap-2 items-center"><LucideGalleryVerticalEnd className="text-lg" />Load More</span>)
                            }
                        </button>
                    </div>
                )}
            </div>
            <CreateStoryspace
                isCreateStoryspace={isCreateStoryspace}
                setIsCreatingStoryspace={() => setIsCreatingStoryspace(false)}
                onNext={handleNext}
            />
        </div>
    )
}

export default Storyspaces
