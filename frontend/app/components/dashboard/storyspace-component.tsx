import { storyspaceSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useCreateStory, useDeletePostMutation, useRestorePostMutation } from "@/hooks/use-storypace"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { BookOpenCheckIcon, CalendarClock, LoaderIcon, LucideFileImage, LucideHeartHandshake, LucideLoaderCircle, LucideTimer, LucideTrash, LucideTrash2, LucideUserCheck2 } from "lucide-react"
import type { Storyspace, StoryStatus, PostSummaryProps } from "@/types"
import Loading from "../utils/loader"
import { useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface CreateStoryspaceProps {
    isCreateStoryspace: boolean
    setIsCreatingStoryspace: () => void
    onNext: (filters: { type: string; category: string; description: string }) => void
}

export const colorOptions = [
    "#FF5733",
    "#33C1FF",
    "#28A745",
    "#FFC300",
    "#8E44AD",
    "#E67E22",
    "#2ECC71",
    "#34495E",
]

export type StoryspaceForm = z.infer<typeof storyspaceSchema>

const CreateStoryspace = ({ isCreateStoryspace, setIsCreatingStoryspace, onNext }: CreateStoryspaceProps) => {
    // const form = useForm<StoryspaceForm>({
    //     resolver: zodResolver(storyspaceSchema),
    //     defaultValues: {
    //         title: "",
    //         conten: colorOptions[0],
    //         description: ""
    //     }
    // })
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

    const navigate = useNavigate()
    const { mutate, isPending } = useCreateStory()
    // const onSubmit = (data: StoryspaceForm) => {
    //     mutate(data, {
    //         onSuccess: (data: any) => {
    //             form.reset()
    //             setIsCreatingStoryspace()
    //             toast.success("Ruang kerja berhasil dibuat")
    //             navigate(`/workspaces/${data._id}`)
    //         }, onError: (error: any) => {
    //             const errorMessage = error.response.data.message
    //             toast.error(errorMessage)
    //             console.log(error)
    //         }
    //     })
    // }
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

const TagInput = ({ tags, setTags }: { tags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>> }) => {
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

const CoverImageSelector = ({ image, setImage, preview, setPreview }: { image: string, setImage: (value: string) => void, preview: string, setPreview: (value: string) => void }) => {
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
                <div className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-md border border-dashed border-gray-300 cursor-pointer relative" onClick={onChooseFile}>
                    <div className="w-14 h-14 flex items-center justify-center bg-emerald-50 rounded-full">
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
                    toast.info(message)
                }, onError: (error: any) => {
                    const message = error?.response?.data?.message
                    toast.warning(message)
                }
            }
        )
    }
    const handleDelete = () => {
        onDelete(postId,
            {
                onSuccess: () => {
                    toast.info("Post berhasil dilempar ke TPU")
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

const DeleteButton = ({ isPending, handleDelete }: { isPending: boolean; handleDelete: () => void }) => {
    const [open, setOpen] = useState(false)
    const confirmDelete = () => {
        handleDelete()
        setOpen(false)
    }
    return (
        <>
            <button
                className="hidden sm:group-hover:flex items-center gap-1 text-xs text-rose-300 bg-rose-50 px-1.5 py-1 rounded-md text-nowrap border border-rose-100 hover:border-rose-500 hover:text-rose-500 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen(true)
                }}
                disabled={isPending}
                title="Delete Post"
            >
                {isPending ? (
                    <LucideLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                    <LucideTrash2 className="size-4 hidden md:block" />
                )}
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Hapus Postingan</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <p className="text-sm text-slate-600">
                            Apakah kamu yakin ingin menghapus postingan ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </DialogDescription>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            disabled={isPending}
                            className="bg-rose-500 hover:bg-rose-600 text-white"
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
                className="w-full max-w-sm p-4 border border-gray-200 rounded-xl shadow animate-pulse md:p-6"
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

export interface IdeaCardProps {
    title: string
    description: string
    tags: string[]
    tone: "casual" | "formal" | "informative" | "creative"
    onSelect: () => void
    imgUrl: string
    content: string
}
const BlogPostIdeaCard: React.FC<IdeaCardProps> = ({ title, description, tags, tone, onSelect, imgUrl, content }) => {
    return (
        <div className="p-4 border rounded-xl cursor-pointer space-y-2 mb-4 shadow-md transition hover:-translate-y-0.5" >
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
            <h3 onClick={onSelect} className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600 text-sm mt-1 text-justify">{description}</p>
            <p className="mt-3 text-xs text-gray-500 italic">Tone: {tone}</p>
            <div className="">
                <p className="text-sm font-medium text-justify">{content}</p>
            </div>
        </div>
    )
}

export { CreateStoryspace, StoryspaceCard, TabsCostum, StoryPostSummaryCard, CoverImageSelector, TagInput, SkeletonLoader, BlogPostIdeaCard }