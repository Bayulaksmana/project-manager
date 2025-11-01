import { TrandingPostSection } from '@/components/home/homepage-component'
import { CommentInfoCard, MarkdownContent, SharePost } from '@/components/home/storyspace-component'
import { Button } from '@/components/ui/button'
import { sanitizeMarkdown } from '@/lib'
import { deleteData, fetchData, postData } from '@/lib/fetch-utils'
import { useAuth } from '@/providers/auth-context'
import type { CommentIdea, Storyspace } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'
import { LucideDot, LucideWandSparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

const SinglePost = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [blogPostData, setBlogPostData] = useState<Storyspace | null>(null)
    const [comments, setComments] = useState<CommentIdea[]>([])
    const { user } = useAuth()
    const [replyText, setReplyText] = useState("")
    const [showReplyFrom, setShowReplayFrom] = useState(false)
    const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false)
    const [summaryContent, setSummaryContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const fetchPostDetailsBySlug = async () => {
        try {
            const response = await fetchData(`/storyspaces/slug/${slug}`, { slug }) as { post: any }
            if (response.post) {
                const data = response.post
                setBlogPostData(data)
                fetchCommentByPostId(data._id)
                incrementViews(data._id)
            }
        } catch (error: any) {
            const msg = error.response.data.message
            console.log(msg)
        }
    }
    const fetchCommentByPostId = async (postId: any) => {
        try {
            const response = await fetchData(`/comments/${postId}`, { postId }) as { nestedComments: any }
            if (response.nestedComments) {
                const data = response.nestedComments
                setComments(data)
            }
        } catch (error: any) {
            const msg = error.response.data.message
            console.log(msg)
        }
    }
    const generateBlogPostBySummary = async () => {
    }
    const incrementViews = async (postId: any) => {
        if (!postId) return
        try {
            const response = await postData(`/storyspaces/${postId}/view`, { postId })
        } catch (error) {

        }
    }
    const handleCancelReply = () => {
        setReplyText("")
        setShowReplayFrom(false)
    }
    const handleAddReply = async (postId: any, commentId: any) => {
    }
    const deleteComment = async (comId: string) => {
        try {
            const response = await deleteData(`/comments/${comId}`) as { message: string }
            toast.success(response.message)
            fetchCommentByPostId(comId)
        } catch (error: any) {
            const msg = error.response.message
            toast.error(msg)
        }
    }
    // const incrementedRef = useRef(false)
    useEffect(() => {
        // if (incrementedRef.current) return
        // incrementedRef.current = true
        fetchPostDetailsBySlug()
        return () => { }
    }, [slug])

    return (
        <>
            {blogPostData && (
                <>
                    <title>{blogPostData.title}</title>
                    <meta name='description' content={blogPostData.title} />
                    <meta property='og:title' content={blogPostData.title} />
                    <meta property='og:image' content={blogPostData.imgUrl} />
                    <meta property='og:type' content="article" />
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-8">
                            <h1 className='text-lg md:text-2xl font-bold mb-2 line-clamp-3'>{blogPostData.title}</h1>
                            <div className="flex items-center flex-wrap mb-5">
                                <span className="text-[14px] text-muted-foreground font-medium">{format(new Date(blogPostData.updatedAt), "do, MMM yyyy")}</span>
                                <LucideDot className='text-xl text-muted-foreground' />
                                <div className="flex gap-2 flex-wrap items-center">
                                    {blogPostData.tags.slice(0, 10).map((tag, index) =>
                                        <Button variant={'ghost'} size={'sm'} key={index} className='bg-emerald-300/50 text-green-800/80 text-xs font-medium h-5 rounded-md text-nowrap' onClick={(e) => { e.stopPropagation(); navigate(`/storyspace/tag/${tag}`) }}>#{tag.split(" ")
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                            .join(" ")}</Button>
                                    )}
                                </div>
                                <LucideDot className='text-xl text-muted-foreground' />
                                <Button className='text-xs hover:bg-linear-to-r h-5 hover:from-slate-700 hover:to-emerald-400 transition-all hover:scale-[1.02]' size={'sm'} >
                                    <LucideWandSparkles /> Summarize Story
                                </Button>
                            </div>
                            <img src={blogPostData.imgUrl || ""} alt={blogPostData.title} className='w-full h-96 object-cover mb-6 rounded-lg' />
                            <div className="">
                                <MarkdownContent
                                    content={sanitizeMarkdown(blogPostData.content || "")}
                                />
                                <SharePost
                                    title={blogPostData.title}
                                />
                                <div className="bg-gray-100 p-4 rounded-lg mb-10">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold">Komentar</h4>
                                        <Button className='flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs font-semibold text-white rounded-full hover:scale-95 hover:text-black'
                                            onClick={() => {
                                                if (!user) {
                                                    toast.warning("Login terlebih dahulu")
                                                    navigate("/sign-in")
                                                }
                                                setShowReplayFrom(true)
                                            }}
                                        >Mari Komen</Button>
                                    </div>
                                    {showReplyFrom && (
                                        <div className="bg-amber-100 pt-4 pb-5 pr-8 rounded-lg mb-8">
                                            {/* <CommentReplyInput
                                                user={user}
                                                authorName={user?.name}
                                                content={""}
                                                replyText={replyText}
                                                setReplyText={setReplyText}
                                                handleAddReply={handleAddReply}
                                                handleCancelReply={handleCancelReply}
                                                disableAutoGen
                                                type="new"
                                            /> */}
                                        </div>
                                    )}
                                    {comments?.length > 0 &&
                                        comments.map((comment) => (
                                            <CommentInfoCard
                                                key={comment._id}
                                                comId={comment._id || ""}
                                                authorName={comment.author.name}
                                                authorPhoto={comment.author.profilePicture}
                                                content={comment.content}
                                                updateOn={comment.updatedAt
                                                    ? formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })
                                                    : "-"}
                                                post={comment.post}
                                                replies={comment.replies || []}
                                                getAllComments={() => fetchCommentByPostId(blogPostData._id)}
                                                onDelete={deleteComment}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <TrandingPostSection />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default SinglePost