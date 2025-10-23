import { storyspaceSchema } from "@/lib/schema"
import type z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useDeletePostMutation, useRestorePostMutation } from "@/hooks/use-storypace"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { BookOpenCheckIcon, CalendarClock, LoaderIcon, LucideDot, LucideFileImage, LucideGaugeCircle, LucideHeartHandshake, LucideLoader2, LucideLoaderCircle, LucideMessageSquareDot, LucideMessageSquarePlus, LucideMessageSquareReply, LucideMessageSquareShare, LucideMessageSquareX, LucideReply, LucideSend, LucideTimer, LucideTrash, LucideTrash2, LucideUserCheck2, LucideWand, LucideWandSparkles } from "lucide-react"
import type { Storyspace, StoryStatus, PostSummaryProps, IdeaCardProps, CreateStoryspaceProps, commentProps, replayProps } from "@/types"
import { useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useNavigate } from "react-router"
import { postData } from "@/lib/fetch-utils"
import { useAuth } from "@/providers/auth-context"

export type StoryspaceForm = z.infer<typeof storyspaceSchema>
const CreateStoryspace = ({ isCreateStoryspace, setIsCreatingStoryspace, onNext }: CreateStoryspaceProps) => {
    const [filters, setFilters] = useState({
        type: "",
        category: "",
        description: "",
    })
    const handleNext = () => {
        if (!filters.type || !filters.category) {
            toast.warning("Pilih jenis tulisan dan kategori terlebih dahulu!")
            return
        }
        onNext(filters)
        setIsCreatingStoryspace()
    }
    return (
        <Dialog open={isCreateStoryspace} onOpenChange={setIsCreatingStoryspace}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                        ✨ Pilih Jenis Tulisan
                    </DialogTitle>
                    <DialogDescription>
                        Tentukan jenis tulisan dan kategori sebelum membuat Storyspace baru.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    {/* Jenis Tulisan */}
                    <div>
                        <label className="text-sm font-medium">Jenis Tulisan</label>
                        <Select
                            value={filters.type}
                            onValueChange={(val) => setFilters({ ...filters, type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis tulisan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="story">🖋️ Tulis Cerita</SelectItem>
                                <SelectItem value="article">📰 Artikel</SelectItem>
                                <SelectItem value="poem">🎭 Puisi</SelectItem>
                                <SelectItem value="idea">💡 Catatan / Ide</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="text-sm font-medium">Kategori</label>
                        <Select
                            value={filters.category}
                            onValueChange={(val) => setFilters({ ...filters, category: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="romance">Romance</SelectItem>
                                <SelectItem value="fantasy">Fantasy</SelectItem>
                                <SelectItem value="horror">Horror</SelectItem>
                                <SelectItem value="drama">Drama</SelectItem>
                                <SelectItem value="motivasi">Motivasi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Deskripsi Singkat */}
                    <div>
                        <label className="text-sm font-medium">Deskripsi Singkat (opsional)</label>
                        <Textarea
                            placeholder="Tuliskan sedikit gambaran tentang tulisanmu..."
                            value={filters.description}
                            onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={setIsCreatingStoryspace}>
                        Batal
                    </Button>
                    <Button onClick={handleNext}>Lanjutkan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const TagInput = ({ tags, setTags }: { tags: string[], setTags: (tags: string[]) => void }) => {
    const [input, setInput] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            const newTag = input.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInput('');
        }
        else if (e.key === 'Backspace' && !input && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    }

    const handleRemove = (index: any) => {
        const newTags = tags.filter((_, i) => i !== index)
        setTags(newTags)
    }
    return (
        <div className="flex flex-wrap gap-2 items-center border border-gray-300 rounded-md p-2 min-h-[48px] mt-2">
            {
                tags.map((tag, index) => (
                    <span className="relative group flex items-center bg-emerald-100/70 hover:bg-emerald-200 text-emerald-700 px-3 py-0.5 rounded text-sm font-medium transition-all duration-200" key={index}>
                        #{tag}
                        <button type="button" className="absolute rounded-full -top-4 -right-2 text-emerald-500 hover:text-emerald-700 font-bold text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={() => handleRemove(index)}>&times;</button>
                    </span>
                ))
            }
            < Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type and press enter"
                className="flex-1 min-w-[120px] border-none outline-none text-sm p-1"
            />
        </div>
    )
}

const CoverImageSelector = ({ image, setImage, preview, setPreview }: { image: string | File, setImage: (value: string) => void, preview: string, setPreview: (value: string) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
    const handleChangeImage = (event: any) => {
        const file = event.target.files[0]
        if (file) {
            setImage(file)
            const preview = URL.createObjectURL(file)
            if (setPreview) {
                setPreview(preview)
            }
            setPreviewUrl(preview)
        }
    }
    const handleRemoveImage = () => {
        setImage("")
        setPreviewUrl("")
        if (setPreview) {
            setPreview("")
        }
    }
    const onChooseFile = () => {
        inputRef.current?.click()
    }
    return (
        <div className="">
            <Input type="file" accept="image/*" ref={inputRef} onChange={handleChangeImage} className="hidden"
            />
            {!image && !preview ? (
                <div className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-100/50 rounded-md border border-dashed border-gray-300 cursor-pointer relative" onClick={onChooseFile}>
                    <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 rounded-full">
                        <LucideFileImage className="text-xl text-emerald-700" />
                    </div>
                    <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
                </div>
            ) : (
                <div className="relative w-full h-56">
                    <img src={preview || previewUrl} alt="Cover" className="w-full h-full object-cover rounded-2xl sm:mt-4" />
                    <Button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-400 hover:text-red-500 border hover:border-red-500 p-2 rounded-full"
                    >
                        <LucideTrash2 />
                    </Button>
                </div>
            )}
        </div>
    )
}

const StoryspaceCard = ({ storyspace }: { storyspace: Storyspace }) => {
    return <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <CardTitle className=''>{storyspace.title
                        // .split(" ")
                        // .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        // .join(" ")
                    }
                    </CardTitle>
                    <span className='text-muted-foreground text-xs flex items-center'>Post: {format(storyspace.createdAt, "dd-MMM-yyyy H:mm", { locale: id })} <CalendarClock className='size-3.5 ml-1 mr-1' />|| <BookOpenCheckIcon className='size-3.5 ml-1 mr-1' />{storyspace.visit}</span>
                </div>
                <span>{storyspace.members.map((m) => (
                    <span key={m.user._id} className="text-sm">
                        {m.user.username}
                    </span>
                ))}</span>
            </div>
        </CardHeader>
        <CardContent className="-mt-4">
            <div className="text-sm text-muted-foreground text-justify">
                {storyspace.desc}
            </div>
        </CardContent>
    </Card>
}

const TabsCostum = ({ tabs, activeTab, setActiveTab }: { tabs: any; activeTab: any, setActiveTab: any }) => {
    return (
        <div className="my-2">
            <div className="flex">
                {tabs.map((tab: any) => {
                    const tabValue = tab.label.toLowerCase() as StoryStatus; // normalize
                    const isActive = activeTab === tabValue;
                    return (
                        <button
                            key={tab.label}
                            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${isActive ? "text-black font-medium text-shadow-md" : "text-muted-foreground font-medium hover:text-emerald-500"} cursor-pointer`}
                            onClick={() => setActiveTab(tabValue)}
                        >
                            <div className="flex items-center">
                                <span>{tab.label}</span>
                                <span className={`text-xs font-medium ml-2 px-2 py-0.5 rounded-full ${isActive ? "bg-black text-white" : "bg-gray-200/70 text-gray-600"}`}>
                                    {tab.count}
                                </span>
                            </div>
                            {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
                        </button>
                    );
                }
                )}
            </div>
        </div>
    )
}

const StoryPostSummaryCard = ({ title, imgUrl, updateOn, tags, likes, views, isDeleted, onClick, postId }: PostSummaryProps) => {
    const { mutate: onRestore, isPending: isUpdating } = useRestorePostMutation()
    const { mutate: onDelete, isPending } = useDeletePostMutation()
    const handleRestore = () => {
        onRestore(postId,
            {
                onSuccess: (data: any) => {
                    const message = data?.message
                    toast.success(message)
                }, onError: (error: any) => {
                    const message = error?.response?.data?.message
                    toast.warning(message)
                }
            }
        )
    }
    const handleDelete = () => {
        onDelete(postId, {
            onSuccess: () => {
                toast.success("Post berhasil dilempar ke TPU")
            }, onError: (error: any) => {
                toast.warning("Gagal melemparkan post ke TPU.", error)
            }
        }
        )
    }
    return (
        <div className="flex items-start gap-4 bg-white p-2 mb-3 rounded-lg cursor-pointer group shadow-sm border-2 hover:shadow-2xl hover:-translate-y-0.5">
            <img src={imgUrl} alt={title} className="w-16 h-16 shadow-2xl hover:translate-y-1 rounded-md items-center" />
            <div className="flex-1">
                <h3 onClick={onClick} className="text-[13px] md:text-[15px] text-black font-semibold">{title}</h3>
                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                    <div className="text-[11px] text-muted-foreground font-medium bg-gray-100 px-2.5 py-1 rounded-md flex">{updateOn}<LucideTimer className="size-3.5" /></div>
                    <div className="h-6 w-[1px] bg-gray-300/70" />
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] flex items-center gap-1.5 text-sky-700 font-medium bg-sky-50 px-2.5 py-1 rounded-md"><LucideUserCheck2 className="text-[11px] text-sky-500 size-4" />{views}</span>
                        <span className="text-[11px] flex items-center gap-1.5 text-sky-700 font-medium bg-sky-50 px-2.5 py-1 rounded-md"><LucideHeartHandshake className="text-[11px] text-red-300 size-4" />{likes}</span>
                    </div>
                    <div className="h-6 w-[1px] bg-gray-300/70" />
                    <div className="flex items-center flex-wrap gap-2.5">
                        {tags.map((tag, index) => (
                            <div className="text-xs text-cyan-700 bg-cyan-100/50 font-medium px-2.5 py-1 rounded-md" key={`tag_${index}`}>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {!isDeleted
                ? <DeleteButton
                    className={"hidden bg-rose-100 sm:group-hover:flex items-center gap-1 text-xs hover:bg-rose-50 text-rose-300 hover:text-rose-500 hover:border-rose-500 border hover:bg-linear-to-r hover:from-rose-100 hover:to-rose-300"}
                    title={`Hapus Cerita - ${title}`}
                    isPending={isPending}
                    handleDelete={handleDelete} />
                : <button
                    className="hidden md:group-hover:flex items-center gap-1 text-xs text-sky-300 bg-sky-50 px-1.5 py-1 rounded-md text-nowrap border border-sky-100 hover:border-sky-500 hover:text-sky-500 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleRestore() }}
                    disabled={isUpdating}
                    title="Restore Post"
                >{isUpdating
                    ? <LucideLoaderCircle className="animate-spin text-[15px]" />
                    : <LucideTrash className="size-4 hidden md:block" />
                    }
                </button>}
        </div>
    )
}

const DeleteButton = ({ isPending, handleDelete, className, title }: { isPending: boolean; handleDelete: () => void; className: string; title: string }) => {
    const [open, setOpen] = useState(false)
    const confirmDelete = () => {
        handleDelete()
        setOpen(false)
    }
    return (
        <>
            <Button
                className={className}
                onClick={(e) => { e.stopPropagation(); setOpen(true) }}
                variant={"ghost"}
                size={"sm"}
                disabled={isPending}
                title="Delete Post"
            >
                {isPending ? (
                    <LucideLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                    <LucideTrash2 className="size-4" />
                )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Apakah kamu yakin ingin menghapus postingan ini?
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            disabled={isPending}
                            className="bg-linear-to-r from-rose-100 to-rose-300 hover: text-black hover:bg-linear-to-r hover:from-rose-300 hover:to-rose-600 border hover:border-rose-500 hover:text-rose-950"
                        >
                            {isPending ? (
                                <LucideLoaderCircle className="animate-spin size-4" />
                            ) : (
                                "Ya, Hapus"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

const SkeletonLoader = () => {
    return (
        <>
            <div
                role="status"
                className="w-full max-w-sm p-4 border border-gray-200 rounded-xl shadow animate-pulse"
            >
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded">
                    <LoaderIcon className="animate-spin text-muted-foreground" />
                </div>

                <div className="h-3 bg-gray-300 rounded-full w-48 mb-3"></div>
                <div className="h-3 bg-gray-300 rounded-full mb-2.5"></div>
                <div className="h-3 bg-gray-300 rounded-full w-40 mb-2.5"></div>

                <div className="flex items-center mt-4 space-x-3">
                    <svg
                        className="w-10 h-10 text-gray-200 rounded-full"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 18"
                    >
                    </svg>
                    <div>
                        <div className="h-3 bg-gray-300 rounded-full w-32 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded-full w-48"></div>
                    </div>
                </div>
                <span className="sr-only">Loading...</span>
            </div>
        </>
    )
}

const BlogPostIdeaCard = ({ title, description, tags, tone, onSelect, imgUrl, content }: IdeaCardProps) => {
    return (
        <div className="p-4 border rounded-xl space-y-2 mb-4 shadow-md transition hover:-translate-y-0.5" >
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <img src={imgUrl} alt="Cover" className="object-cover w-14 h-14 border rounded-xl" />
                <div className="">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span
                                key={`tag_${i}`}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                        <p className="text-xs hidden sm:block text-muted-foreground absolute right-2 top-1">Generate @gemini-2.0-flash-lite</p>
                    </div>
                </div>
            </div>
            <h3 onClick={onSelect} className="text-lg font-semibold cursor-pointer">{title}</h3>
            <p className="mt-3 text-xs text-gray-500 italic">Tone: {tone}</p>
            <p className="text-gray-600 text-sm mt-1 text-justify">{description}</p>
            <div className="">
                <p className="text-sm font-medium text-justify">{content}</p>
            </div>
        </div>
    )
}

const GenerateStoryForm = ({ contentParams, setPostContent, handleCloseForm }: { contentParams: any, setPostContent: any, handleCloseForm: () => void }) => {
    const [formData, setFormData] = useState({
        title: contentParams?.title || "",
        tone: contentParams?.tone || ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const handleChange = (key: any, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }))
    }
    const handleGenerateBlogSpot = async (e: any) => {
        e.preventDefault()
        const { title, tone } = formData
        if (!title || !tone) {
            toast.error('Isi form data terlebih dahulu.')
            return
        }
        setError("")
        setIsLoading(true)
        try {
            const aiResponse = await postData("/ai/generate", { title, tone }) as {
                message: string;
                parsed: string;
                sisaLimit: number;
            };
            if (aiResponse) {
                toast.success(aiResponse.message)
            }
            const generatePost = aiResponse.parsed
            setPostContent(title, generatePost || "")
            handleCloseForm()
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Ada kesalahan diserver, silahkan refresh page")
            }
        } finally {
            // toast.success("Generate post successfully.")
            setIsLoading(false)
        }
    }
    return (
        <form onSubmit={handleGenerateBlogSpot} className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Judul Story</label>
            <Input
                value={formData.title}
                onChange={({ target }) => handleChange("title", target.value)}
                placeholder="Try to consistence and diciplince"
                type="text"
            />
            <label className="text-sm font-medium text-gray-700">Tema Story</label>
            <Input
                value={formData.tone}
                onChange={({ target }) => handleChange("tone", target.value)}
                placeholder="Beginner Friendly, technical, futuristic modern light"
                type="text"
            />
            {error && <p className="">{error}</p>}
            <Button type="submit" className="bg-linear-to-r from-amber-100 to-amber-300 text-black hover:bg-linear-to-r hover:from-amber-200 hover:to-amber-500 hover:border hover:border-amber-700 hover:text-amber-800" disabled={isLoading} variant={"ghost"} size={"sm"}>
                {isLoading && <LucideLoader2 className="animate-spin" />}
                {isLoading ? "Generating..." : <span className="flex gap-2 items-center"><LucideGaugeCircle />Generate</span>}
            </Button>
        </form>
    )
}

const CommentInfoCard = ({ comId, authorName, authorPhoto, content, updateOn, post, replies, getAllComments, onDelete, isSubReply }: commentProps) => {
    const { user } = useAuth()
    const [replyText, setReplyText] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [showReplyFrom, setShowReplyFrom] = useState(false)
    const [showSubReplies, setShowSubReplies] = useState(false)
    const handleCancelReply = () => {
        setReplyText("")
        setShowReplyFrom(false)
    }
    const handleAddReply = async () => {
        try {
            const response = await postData(`/comments/${post._id}`, {
                content: replyText,
                parentComment: comId,
            }) as { message: string };
            const msg = response.message;
            toast.success(msg);
            setReplyText("")
            setShowReplyFrom(false)
            getAllComments()
        } catch (error: any) {
            const msg = error.message
            toast.error(msg)
        }
    }
    return (
        <div className={`bg-white px-2 rounded-lg group ${isSubReply ? 'mb-1' : 'mb-4'}`}>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 order-2">
                    <div className="flex items-start gap-3">
                        <img src={authorPhoto} alt={authorName} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center gap-1">
                                <h3 className="text-[12px] text-muted-foreground font-medium">@{authorName}</h3>
                                <LucideDot />
                                <span className="text-[12px] text-muted-foreground font-medium">
                                    {updateOn}
                                </span>
                            </div>
                            <p className="text-sm text-black font-medium">{content}</p>
                            <div className="flex items-center justify-end  mt-1.5">
                                <DeleteButton
                                    className='hidden sm:group-hover:flex text-rose-500 hover:bg-rose-500 hover:text-white rounded-full'
                                    title={`Hapus Komentar ${authorName}`}
                                    isPending={loading}
                                    handleDelete={() => onDelete(comId)}
                                />
                                {!isSubReply && (
                                    <>
                                        <Button size={"sm"} variant={"ghost"} className="flex rounded-full text-green-500 hover:bg-emerald-300 hover:text-white" onClick={() => setShowReplyFrom((prev) => !prev)}><LucideMessageSquareReply className="h-7 w-7" /></Button>
                                        <Button size={"sm"} variant={"ghost"} className="flex text-xs rounded-full text-blue-500  hover:bg-sky-500 hover:text-white" onClick={() => setShowSubReplies((prev) => !prev)}>
                                            {showSubReplies ? < LucideMessageSquareShare className="h-5 w-5" /> : <LucideMessageSquareDot className="h-5 w-5" />}
                                            <span className="text-xs">
                                                {replies.length || 0}
                                                {replies?.length == 1 ? "" : ""}
                                            </span>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {!isSubReply && (
                    <div className="col-span-12 order-1 flex gap-2 items-start justify-end">
                        <img src={post.imgUrl} alt={post.imgUrl} className="w-16 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                            <div className="flex items-center">
                                <h4 className="text-sm font-medium">{post?.title}</h4>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {!isSubReply && showReplyFrom && (
                <CommentReplayInput
                    user={user!}
                    authorName={authorName}
                    content={content}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    handleAddReply={handleAddReply}
                    handleCancelReply={handleCancelReply}
                    disableAutoGen={false}
                    type="reply"
                />
            )}
            {showSubReplies &&
                replies?.length > 0 &&
                replies.map((com, index) => (
                    <div key={com._id} className={`ml-5${index == 0 ? "mt-5" : ""}`}>
                        <CommentInfoCard
                            key={com._id}
                            comId={com._id || ""}
                            authorName={com.author.name || ""}
                            authorPhoto={com.author.profilePicture || ""}
                            content={com.content}
                            updateOn={
                                com.updatedAt
                                    ? formatDistanceToNow(new Date(com.updatedAt), { addSuffix: true })
                                    : "-"
                            }
                            post={com.post}
                            replies={com.replies}
                            getAllComments={getAllComments}
                            onDelete={() => onDelete(com._id)}
                            isSubReply={com.parentComment}
                        />
                    </div>
                ))
            }
        </div>
    )
}

const CommentReplayInput = ({ user, authorName, content, replyText, setReplyText, handleAddReply, handleCancelReply, disableAutoGen, type = "reply" }: replayProps) => {
    const [loading, setLoading] = useState(false)
    const generateReplay = async () => {
        setLoading(true)
        try {
            const aiResponse = await postData(`/ai/generate-reply`, { author: { name: authorName }, content }) as { message: string, reply: string };
            const msg = aiResponse.message;
            setReplyText(aiResponse.reply)
            toast.success(msg);
        } catch (error: any) {
            const message = error.message
            toast.warning(message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="ml-10 relative">
            <div className="flex items-start gap-3">
                <img src={user?.profilePicture} alt={user?.name} className="w-10 h-10 rounded-full mt-4" />
                <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">
                        {type === 'new'
                            ? typeof authorName === 'string'
                                ? authorName
                                : authorName.author.name
                            : `Reply to ${typeof authorName === 'string' ? authorName : authorName.author.name}`}
                    </label>
                    <div className="flex gap-2 items-center">
                        <Input
                            className="h-8"
                            value={replyText}
                            onChange={({ target }) => setReplyText(target.value)}
                            placeholder={type === "new" ? "Message" : "Add a Reply"}
                            type="text"
                        />
                        {!disableAutoGen && (
                            <Button size={"sm"} variant={"outline"} className="hover:bg-linear-to-r hover:from-purple-300 hover:to-rose-400 hover:text-black text-lime-700" disabled={loading} onClick={generateReplay}>
                                {loading ? (<LucideLoader2 className="animate-spin" />) : (<LucideWand className="" />)}
                                {/* {loading ? "Generating..." : "Generate Reply"} */}
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2 text-xs">
                        <Button size={"sm"} variant={"ghost"} className="text-xs hover:bg-linear-to-r hover:from-rose-300 hover:to-rose-400 hover:rose-lime-700 text-rose-600" disabled={replyText?.length == 0 || loading} onClick={handleCancelReply}><LucideMessageSquareX />Cancel</Button>
                        <Button size={"sm"} variant={"ghost"} className="text-xs hover:bg-linear-to-r hover:from-lime-300 hover:to-emerald-400 hover:text-emerald-700 text-emerald-600" disabled={replyText?.length == 0 || loading} onClick={handleAddReply}>
                            {type == 'new' ? <LucideSend className="" /> : <LucideMessageSquarePlus className="" />}
                            {type == 'new' ? 'Add' : "Reply"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CreateStoryspace, StoryspaceCard, TabsCostum, StoryPostSummaryCard, CoverImageSelector, TagInput, SkeletonLoader, BlogPostIdeaCard, GenerateStoryForm, DeleteButton, CommentInfoCard }