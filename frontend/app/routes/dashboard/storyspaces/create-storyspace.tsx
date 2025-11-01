import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, } from 'react-router'
import { Editor } from '@tinymce/tinymce-react';
import { LucideLightbulb, LucideLoader2, LucideMessageCircleMore, LucideSave, LucideSend, LucideSparkles, LucideStarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BlogPostIdeaCard, CommentInfoCard, CoverImageSelector, DeleteButton, GenerateStoryForm, SkeletonLoader, TagInput } from '@/components/dashboard/storyspace-component';
import { deleteData, fetchData, postData, updateData } from '@/lib/fetch-utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { uploadImage } from '@/hooks/use-auth';
import { getToastMessageByType, type CommentIdea, type PostIdea } from '@/types';
import { formatDistanceToNow } from 'date-fns';



const CreateStoryspace = () => {
    const { mode, slug } = useParams<{ mode?: string; slug?: string }>()
    const isEdit = mode === "edit"
    const location = useLocation()
    const filterData = location.state as {
        type?: string
        category?: string
        description?: string
    }
    const [postingData, setPostingData] = useState({
        _id: "",
        title: "",
        content: "",
        imgUrl: "",
        slug: "",
        coverPreview: "",
        tags: [] as string[],
        isDraft: "",
        tone: "",
        generatedByAI: false,
    })
    const navigate = useNavigate()
    const [postIdeas, setPostIdeas] = useState<PostIdea[]>([])
    const [comments, setComments] = useState<CommentIdea[]>([])
    const [openStory, setOpenStory] = useState<{ open: boolean; data: PostIdea | null }>({ open: false, data: null })
    const [ideaLoading, setIdeaLoading] = useState(false)
    const [loading, isLoading] = useState(false)
    const [error, setError] = useState("")
    const handleValueChange = (key: any, value: any) => {
        setPostingData((prevData) => ({ ...prevData, [key]: value }))
    }
    const generatePostAI = async () => {
        setIdeaLoading(true)
        try {
            const aiResponse = await postData("/ai/generate-story", { topics: "Teknologi, Totabuan, Analitik &Reflektif, Daerah Tercinta Bolaang Mongondow", }) as any
            const generatedIdeas = aiResponse.parsed
            if (generatedIdeas?.length > 0) {
                setPostIdeas(generatedIdeas);
            }
        } catch (error) {
            console.error("Tunggu AI belum merespon")
        } finally {
            setIdeaLoading(false)
        }
    }
    const handlePublish = async (isDraft: boolean) => {
        let imgUrl = ""
        if (!postingData.title.trim()) {
            setError("Masukan judul story anda")
        }
        if (!postingData.content.trim()) {
            setError("Tambahkan content anda")
        }
        if (!isDraft) {
            if (!isEdit && !postingData.imgUrl) {
                setError("Pilih gambar sebagai cover story")
            }
            if (isEdit && !postingData.imgUrl && !postingData.coverPreview) {
                setError("Masukan gambar dulu ya boss..")
            }
            if (!postingData.tags.length) {
                setError("Tambahkan tags jangan sampai lupa")
            }
        }
        isLoading(true)
        setError("")
        try {
            if (postingData.imgUrl && typeof postingData.imgUrl !== "string") {
                const imgUploadRes = await uploadImage(postingData.imgUrl as File)
                imgUrl = (imgUploadRes as any).imgUrl || (imgUploadRes as any).imageUrl || postingData.coverPreview
            } else {
                imgUrl = postingData.coverPreview
            }
            const reqPayload = {
                _id: postingData._id,
                title: postingData.title,
                content: postingData.content,
                imgUrl,
                tags: postingData.tags,
                isDraft: isDraft ? true : false,
                generatedByAI: true
            }
            const response = isEdit
                ? await updateData(`/storyspaces/${postingData._id}`, reqPayload) as { post: PostIdea; message?: string }
                : await postData(`/storyspaces`, reqPayload) as { post: PostIdea; message?: string }
            const successMsg = getToastMessageByType(isDraft ? "draft" : isEdit ? "edit" : "published")
            toast.success(successMsg)
            setTimeout(() => navigate("/storyspaces"), 800)
        } catch (error: any) {
            const msg =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Gagal membuat Story karena tulisanmu belum cukup bagus 😅";
            toast.error(msg);
        } finally {
            isLoading(false)
        }
    }
    const fetchPostSlug = async () => {
        try {
            const response = await fetchData(`/storyspaces/slug/${slug}`, {}) as { post: PostIdea }
            if (response) {
                const data = response.post
                setPostingData((prevState) => ({
                    ...prevState,
                    _id: data._id,
                    title: data.title,
                    content: data.content,
                    coverPreview: data.imgUrl,
                    tags: data.tags,
                    isDraft: data.isDraft ? "true" : "",
                    generatedByAI: data.generatedByAI,
                }))
            }
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Terjadi kesalahan saat menghapus story!"
            toast.error(msg)
        }
    }
    const deletePost = async () => {
        try {
            const res = await deleteData(`/storyspaces/${postingData._id}`) as { message?: string }
            toast.success(res?.message)
            navigate("/storyspaces")
        } catch (error: any) {
            const msg = error.response?.data?.message
            toast.error(msg)
        }
    }
    const getAllComments = async () => {
        try {
            const response = await fetchData(`/comments`, { params: {} }) as { nestedComments: any; message: any }
            setComments(response.nestedComments?.length > 0 ? response.nestedComments : [])
        } catch (error: any) {
            const msg = error.response.message
            toast.error(msg)
        }
    }
    const deleteComment = async (comId: string) => {
        try {
            const response = await deleteData(`/comments/${comId}`) as { message: string }
            toast.success(response.message)
            getAllComments()
        } catch (error: any) {
            const msg = error.response.message
            toast.error(msg)
        }
    }
    useEffect(() => {
        if (isEdit) {
            fetchPostSlug()
            getAllComments()
        }
        else {
            generatePostAI()
        }
        return () => { }
    }, [])
    return (
        <>
            <div className="-space-y-4 flex gap-4 flex-col lg:flex-row">
                <div className="lg:w-5/7">
                    <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-0">
                        <span className='flex gap-1 '>
                            <h2 className="text-2xl sm:text-3xl font-cabella">Write An Amazing Story</h2>
                            <div>{isEdit
                                ? <p className='px-1.5 py-0.5 bg-amber-200 rounded-md text-xs font-medium'> 🖋️Edit</p>
                                : <p className='px-1.5 py-0.5 bg-emerald-200 rounded-md text-xs font-medium'>✨New</p>
                            }
                            </div>
                        </span>
                        <span className='flex items-center flex-wrap justify-between gap-2'>
                            {filterData && (
                                <span className='hidden md:block'><div className="border-sky-100 bg-sky-50 rounded-md gap-2 w-fit flex text-xs px-1.5 py-1.5">
                                    <p><strong>Jenis: </strong> {filterData.type || "—"}</p>
                                    <p><strong>Kategori: </strong> {filterData.category || "—"}</p>
                                    {filterData.description && (
                                        <p><strong>Deskripsi: </strong> {filterData.description}</p>
                                    )}
                                </div></span>
                            )}
                            <div className="flex gap-1 items-center justify-end mt-3 md:mt-0">
                                {isEdit && (
                                    <DeleteButton
                                        className='flex bg-rose-100 hover:bg-rose-50 text-rose-300 hover:text-rose-500 hover:border-rose-500 border hover:bg-linear-to-r hover:from-rose-100 hover:to-rose-300'
                                        title={`Hapus "${postingData.title}"`}
                                        isPending={loading}
                                        handleDelete={deletePost}
                                    />
                                )}
                                <Button
                                    className='flex hover:bg-sky-50 bg-sky-100 text-sky-500 hover:text-black hover:bg-linear-to-r hover:from-sky-100 hover:to-sky-400 hover:border-sky-500 border'
                                    variant={"ghost"}
                                    size={"sm"}
                                    disabled={loading}
                                    onClick={() => handlePublish(true)}
                                >
                                    {loading ? (
                                        <LucideLoader2 className='animate-spin text-[15px]' />
                                    ) : (
                                        <LucideSave className='' />
                                    )}
                                </Button>
                                <Button
                                    className='flex text-xs hover:bg-linear-to-r hover:from-emerald-100 hover:to-emerald-400 bg-linear-to-r from-emerald-50 to-emerald-300 hover:text-black text-emerald-900 hover:border-emerald-500 border'
                                    variant={"ghost"}
                                    size={"sm"}
                                    disabled={loading}
                                    onClick={() => handlePublish(false)}
                                >
                                    {loading ? (
                                        <LucideLoader2 className='animate-spin text-[15px]' />
                                    ) : (
                                        <LucideSend className='' />
                                    )}
                                    <span className='hidden md:block'>Publish</span>
                                </Button>
                            </div>
                        </span>
                    </div>
                    <Separator className='mt-2' />
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
                    <div className="md:pt-4 rounded-2xl gap-2 flex flex-col border mt-2.5 shadow-md">
                        <div className="flex flex-col md:flex-row justify-between gap-8 px-2">
                            <div className="md:w-4/6 flex flex-col">
                                <Label className='text-xs font-medium text-muted-foreground text-center'>Post Title</Label>
                                <Input
                                    type=''
                                    placeholder='"How to Modern Schema"'
                                    // className='bg-transparent focus:outline-none font-medium w-full mb-2 mt-2 border'
                                    className='flex flex-wrap gap-2 items-center border-gray-300 rounded-md mt-2 bg-transparent focus:outline-none font-medium w-full mb-2 border'
                                    value={postingData.title}
                                    onChange={({ target }) => handleValueChange("title", target.value)}
                                />
                                <Label className='text-xs font-medium text-muted-foreground text-center'>Post Tags</Label>
                                <TagInput
                                    // tags={postData?.tags || []}
                                    tags={postingData?.tags || []}
                                    setTags={(data: any) => { handleValueChange("tags", data) }}
                                />
                            </div>
                            <div className="md:w-2/6">
                                <CoverImageSelector
                                    image={postingData.imgUrl}
                                    setImage={(value: string) => handleValueChange("imgUrl", value)}
                                    preview={postingData.coverPreview}
                                    setPreview={(value: string) => handleValueChange("coverPreview", value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center space-y-2">
                            <Separator className='mt-4 mb-4' />
                            <div className="w-full p-2">
                                <Editor
                                    apiKey='ih2jrrv0v85b0hyexn6e0sxrh3bvsf4djnbwrbh4ki2ad4ol'
                                    value={postingData.content}
                                    onEditorChange={(data) => handleValueChange("content", data)}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins:
                                            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                        toolbar:
                                            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                        content_css: 'default',
                                        file_picker_types: 'image',
                                        placeholder: "Tulis cerita atau ide kreatifmu di sini... ✍️",
                                        file_picker_callback: (cb: (url: string, meta?: { title?: string }) => void, value: string, meta: { filetype: string }
                                        ) => {
                                            if (meta.filetype === 'image') {
                                                const input = document.createElement('input');
                                                input.setAttribute('type', 'file');
                                                input.setAttribute('accept', 'image/*');
                                                input.click();
                                                input.onchange = async () => {
                                                    const file = input.files?.[0];
                                                    if (!file) return;
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        const base64 = reader.result as string
                                                        cb(base64, { title: file.name });
                                                    };
                                                    reader.readAsDataURL(file);
                                                };
                                            }
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-2/7 border-b rounded-2xl h-[123vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] mt-4 lg:mt-0">
                    <div className="rounded-2xl gap-2 flex flex-col ">
                        {!isEdit && (
                            <div className="form-card col-span-12 md:col-span-4 px-2">
                                <div className="flex items-center justify-between mt-4 lg:mt-0">
                                    <h4 className="text-sm md:text-base font-medium inline-flex">
                                        <span className="text-emerald-600"><LucideSparkles /></span>
                                        Ideas for your next post
                                    </h4>
                                    <Button
                                        onClick={() => setOpenStory({ open: true, data: null })}
                                        size={'sm'}
                                        disabled={ideaLoading}
                                        className='flex hover:bg-linear-to-r hover:from-emerald-200 hover:to-emerald-400 bg-linear-to-r from-emerald-100 to-emerald-300 text-emerald-500 hover:text-emerald-900 hover:border-emerald-500 border'
                                    >{ideaLoading ? <span className='text-xs text-muted-foreground'><LucideLightbulb className='animate-spin' /></span> : <span className='text-xs text-black flex'><LucideStarHalf className='' />Generate AI</span>}</Button>
                                </div>
                                <div className="mt-6">
                                    {ideaLoading
                                        ? (<div className='p-4'><SkeletonLoader /></div>)
                                        : (postIdeas.map((idea, index) => (
                                            <BlogPostIdeaCard
                                                key={`idea_${index}`}
                                                title={idea.title || ""}
                                                description={idea.description || ""}
                                                tags={idea.tags || []}
                                                tone={idea.tone}
                                                imgUrl={idea.imgUrl}
                                                content={idea.content}
                                                onSelect={() => setOpenStory({ open: true, data: idea })}
                                            />
                                        )))
                                    }
                                </div>
                            </div>
                        )}
                        {isEdit && (
                            <div className="form-card col-span-12 md:col-span-4 px-2">
                                <div className="flex items-center justify-between mt-4 lg:mt-0">
                                    <h4 className="text-sm items-center md:text-base font-medium inline-flex gap-2">
                                        <span className="text-emerald-600"><LucideMessageCircleMore /></span>
                                        Daftar Komentar
                                    </h4>
                                    <Button
                                        onClick={() => setOpenStory({ open: true, data: null })}
                                        size={'sm'}
                                        disabled={ideaLoading}
                                        className='flex hover:bg-linear-to-r hover:from-emerald-200 hover:to-emerald-400 bg-linear-to-r from-emerald-100 to-emerald-300 text-emerald-500 hover:text-emerald-900 hover:border-emerald-500 border'
                                    >{ideaLoading ? <span className='text-xs text-muted-foreground'><LucideLightbulb className='animate-spin' /></span> : <span className='text-xs text-black flex'><LucideStarHalf className='' />Generate AI</span>}</Button>
                                </div>
                                <div className="mt-6">
                                    {comments.length ? (
                                        comments.map((com) => (
                                            <CommentInfoCard
                                                key={com._id}
                                                comId={com._id}
                                                authorName={com.author?.name}
                                                authorPhoto={com.author?.profilePicture}
                                                content={com.content}
                                                updateOn={com.updatedAt
                                                    ? formatDistanceToNow(new Date(com.updatedAt), { addSuffix: true })
                                                    : "-"}
                                                post={com.post}
                                                replies={com.replies}
                                                getAllComments={getAllComments}
                                                onDelete={deleteComment}
                                                isSubReply={com.parentComment} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Belum ada komentar.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
            <div className="w-full h-screen bg-slate-500 mt-4 rounded-2xl">
                <Dialog open={openStory?.open} onOpenChange={() => { setOpenStory({ open: false, data: null }) }} modal={true}>
                    <DialogContent className="max-h-[80vh] overflow-y-auto text-slate-600">
                        <DialogHeader>
                            <DialogTitle>Generate Post by AI</DialogTitle>
                            <DialogDescription>Provide a title and tone to generate your story post</DialogDescription>
                        </DialogHeader>
                        <GenerateStoryForm
                            contentParams={openStory?.data || null}
                            setPostContent={(title: string, content: string,) => {
                                const postInfo = openStory?.data || null
                                setPostingData((prevState) => ({
                                    ...prevState,
                                    title: title || prevState.title,
                                    content: content,
                                    tags: postInfo?.tags || prevState.tags,
                                    generatedByAI: true
                                }))
                            }}
                            handleCloseForm={() => {
                                setOpenStory({ open: false, data: null })
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default CreateStoryspace