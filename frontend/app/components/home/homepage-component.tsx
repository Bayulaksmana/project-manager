import { fetchData } from '@/lib/fetch-utils'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../ui/button'
import { LucideDot, LucideEye, LucideGalleryVerticalEnd, LucideLoaderCircle, LucideMessageSquareDot, LucideThumbsUp } from 'lucide-react'
import type { FeatureProps, Storyspace, TrendingProps } from '@/types'
import { format } from 'date-fns'

const BlogLandingPage = () => {
    const navigate = useNavigate()
    const [blogPostList, setBlogPostList] = useState<Storyspace[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const getAllPost = async (pageNumber = 1) => {
        try {
            setIsLoading(true)
            const response = await fetchData(`/storyspaces?page=${pageNumber}`, {
                params: {
                    status: "published",
                    page: pageNumber
                }
            }) as { posts: any; totalPages: any }
            const { posts, totalPages } = response
            setBlogPostList((prev) => pageNumber === 1 ? posts : [...prev, ...posts])
            setTotalPages(totalPages)
            setPage(pageNumber)
        } catch (error: any) {
            console.error("Error mengambil data dari API", error)
        } finally {
            setIsLoading(false)
        }
    }
    const handleMore = () => {
        if (totalPages && page < (totalPages)) {
            getAllPost(page + 1)
        }
    }
    useEffect(() => {
        getAllPost(1)
    }, [])
    const handleClik = (post: any) => {
        navigate(`/storyspace/${post.slug}`)
    }
    return (
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-8 mt-6">
                {blogPostList.length > 0 && (
                    <FeaturedBlogPost
                        title={blogPostList[0].title}
                        img={blogPostList[0].imgUrl}
                        content={blogPostList[0].content}
                        tags={blogPostList[0].tags}
                        updateOn={blogPostList[0].updatedAt
                            ? format(new Date(blogPostList[0].updatedAt), "do, MMM yyyy")
                            : "-"
                        }
                        authorName={blogPostList[0].author.name}
                        authProfileImg={blogPostList[0].author.profilePicture}
                        like={blogPostList[0].likes}
                        comment={blogPostList[0].comments}
                        view={blogPostList[0].views}
                        onClick={() => handleClik(blogPostList[0])}
                    />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {blogPostList.length > 0 && blogPostList.slice(1).map((item, index) => (
                        <BlogPostSummaryCard
                            key={`${item._id}-${index}`}
                            title={item.title}
                            img={item.imgUrl}
                            content={item.content}
                            tags={item.tags}
                            updateOn={item.updatedAt
                                ? format(new Date(item.updatedAt), "do, MMM yyyy")
                                : "-"
                            }
                            authorName={item.author.name}
                            authProfileImg={item.author.profilePicture}
                            onClick={() => handleClik(item)}
                            like={item.likes}
                            comment={item.comments}
                            view={item.views}
                        />
                    ))}
                </div>
                {totalPages && page < totalPages && (
                    <div className="flex items-center mt-5 mb-5 justify-center">
                        <Button size={'sm'} className='flex items-center gap-3 text-xs hover:scale-90 transition-all' disabled={isLoading} onClick={handleMore} >
                            {isLoading
                                ? (<span className='flex text-xs'><LucideLoaderCircle className='animate-spin' />Loading..</span>)
                                : (<span className='flex text-xs gap-2'><LucideGalleryVerticalEnd className='' />Load More..</span>)
                            }
                        </Button>
                    </div>
                )}
            </div>
            <div className="col-span-12 md:col-span-4">
                <TrandingPostSection />
            </div>
        </div>
    )
}

const FeaturedBlogPost = ({ title, img, content, tags, updateOn, authorName, authProfileImg, onClick, like, comment, view }: FeatureProps) => {
    const navigate = useNavigate()
    return (
        <div className="grid grid-cols-12 bg-white shadow-lg rounded-xl overflow-hidden" >
            <div className="col-span-12 md:col-span-6">
                <img src={img} alt={title} className='w-full h-80 object-cover' />
            </div>
            <div className="col-span-12 md:col-span-6 group">
                <div className="px-3 py-2">
                    <h2 className='text-md md:text-xl font-bold mb-2 line-clamp-3 text-justify cursor-pointer' onClick={onClick}>{title}</h2>
                    <p className="text-gray-700 text-[13px] mb-4 line-clamp-6 text-justify">{content.replace(/<[^>]+>/g, '')}</p>
                    <div className="flex items-center gap-2 mb-4 justify-between">
                        <span className='flex gap-2'>
                            {tags.slice(0, 3).map((tag, index) =>
                                <Button variant={'ghost'} size={'sm'} key={index} className='bg-emerald-300/50 text-green-800/80 text-xs font-medium h-5 rounded-md text-nowrap' onClick={(e) => { e.stopPropagation(); navigate(`/storyspace/tag/${tag}`) }}>#{tag.split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(" ")}</Button>
                            )}
                        </span>
                        <Button variant={'ghost'} size={'sm'} className='italic text-xs hover:text-white hover:bg-linear-to-r hover:bg-black h-5 text-muted-foreground hidden group-hover:block transition-all duration-200' onClick={onClick} >Selengkapnya...</Button>
                    </div>
                    <div className="flex items-center justify-between gap-2 relative">
                        <div className="flex items-center gap-1">
                            <img src={authProfileImg} alt={authorName} className='w-8 h-8 rounded-full mr-1' />
                            <p className='text-sm flex flex-col text-gray-600'>{authorName}<span className='text-xs text-muted-foreground'>{updateOn}</span></p>
                        </div>
                        <div className='hidden md:block text-xs rounded-md items-center -tracking-widest text-slate-600'>
                            <p className='flex'>
                                <span className='flex items-center'><LucideThumbsUp className='h-3' />{like}<LucideDot /></span>
                                <span className='flex items-center'><LucideMessageSquareDot className='h-3' />{comment}<LucideDot /></span>
                                <span className='flex items-center'><LucideEye className='h-4' />{view}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const BlogPostSummaryCard = ({ title, img, content, tags, updateOn, authorName, authProfileImg, onClick, like, comment, view }: FeatureProps) => {
    const navigate = useNavigate()
    return (
        <div className='bg-white shadow-lg shadow-gray-100 rounded-xl overflow-hidden'>
            <img src={img} alt={title} className='w-full h-64 object-cover' />
            <div className="md:p-2 group">
                <h2 className="text-base md:text-lg font-bold mb-2 line-clamp-1 text-justify" onClick={onClick}>{title}</h2>
                <p className="text-gray-700 text-xs mb-4 line-clamp-5 text-justify ">{content.replace(/<[^>]+>/g, '')}</p>
                <div className="px-2 pb-2">
                    <div className="flex items-center gap-2 mb-3  justify-between">
                        <span className='flex items-center gap-2'>
                            {tags.slice(0, 3).map((tag, index) =>
                                <Button variant={'ghost'} size={'sm'} key={index} className='bg-emerald-300/50 text-green-800/80 text-xs font-medium h-5 rounded-md text-nowrap' onClick={(e) => { e.stopPropagation(); navigate(`/storyspace/tag/${tag}`) }}>#{tag.split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(" ")}</Button>
                            )}
                        </span>
                        <Button variant={'ghost'} size={'sm'} className='italic text-xs hover:text-white hover:bg-linear-to-r hover:bg-black h-5 text-muted-foreground hidden group-hover:block transition-all duration-200' onClick={onClick} >Selengkapnya...</Button>
                    </div>
                    <div className="flex items-center justify-between gap-2 relative">
                        <div className="flex items-center gap-1">
                            <img src={authProfileImg} alt={authorName} className='w-8 h-8 rounded-full mr-1' />
                            <p className='text-sm flex flex-col text-gray-600'>{authorName}<span className='text-xs text-muted-foreground'>{updateOn}</span></p>
                        </div>
                        <div className='hidden md:block text-xs rounded-md items-center mt-4 -tracking-widest text-slate-600'>
                            <p className='flex'>
                                <span className='flex items-center'><LucideThumbsUp className='h-3' />{like}<LucideDot /></span>
                                <span className='flex items-center'><LucideMessageSquareDot className='h-3' />{comment}<LucideDot /></span>
                                <span className='flex items-center'><LucideEye className='h-4' />{view}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TrandingPostSection = () => {
    const navigate = useNavigate()
    const [postList, setPostList] = useState<Storyspace[]>([])
    const getTrendingPost = async () => {
        try {
            const response = await fetchData("/storyspaces/trending", { params: { isDraft: false, isDelete: false } }) as { post: any }
            setPostList(response.post?.length > 0 ? response.post : [])
        } catch (error) {
            console.error("Error mengambil data dari API", error)
        }
    }
    const handleClick = (post: any) => {
        navigate(`/storyspace/${post.slug}`)
    }
    useEffect(() => {
        getTrendingPost()
        return () => { }
    }, [])
    return (
        <div className="">
            <h4 className="font-medium text-center text-base">Trending Post</h4>
            {postList.length > 0 &&
                postList.map((item) => (
                    <PostCard
                        key={item._id}
                        title={item.title}
                        img={item.imgUrl}
                        tags={item.tags}
                        onClick={() => handleClick(item)}
                    />
                ))}
        </div>
    )
}

const PostCard = ({ title, img, tags, onClick }: TrendingProps) => {
    return (
        <div className="cursor-pointer mb-3" onClick={onClick}>
            <h6 className='text-[10px] font-semibold text-sky-500'>
                {tags[0]?.toUpperCase() || "BLOG"}
            </h6>
            <div className="flex items-start gap-4 mt-2">
                <img src={img} alt={title} className='w-14 h-14 object-cover rounded-md' />
                <h2 className='text-sm font-medium mb-2 line-clamp-3 text-justify'>{title}</h2>
            </div>
        </div>
    )
}

export { BlogLandingPage, TrandingPostSection }