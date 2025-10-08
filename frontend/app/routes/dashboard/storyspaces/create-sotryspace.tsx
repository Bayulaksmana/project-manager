import { useEffect, useRef, useState } from 'react'
import { data, useLocation, useNavigate, useParams } from 'react-router'
import { Editor } from '@tinymce/tinymce-react';
import { LucideLoader2, LucideSave, LucideSend, LucideSparkles, LucideTrash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BlogPostIdeaCard, CoverImageSelector, SkeletonLoader, TagInput } from '@/components/dashboard/storyspace-component';
import axios from 'axios';
import { postData } from '@/lib/fetch-utils';
import { toast } from 'sonner';

type PostIdea = {
    title: string;
    description: string;
    tags: string[];
    category: string[];
    content: string;
    imgUrl: string;
    slug: string

};

const CreateStoryspace = ({ isEdit }: { isEdit: string }) => {
    const location = useLocation()
    const filterData = location.state as {
        type?: string
        category?: string
        description?: string
    }
    const navigate = useNavigate()
    const { postSlug } = useParams()
    const [postingData, setPostingData] = useState({
        id: "",
        title: "",
        content: "",
        imgUrl: "",
        coverPreview: "",
        tags: [] as string[],
        isDraft: "",
        generatedByAI: false,
    })

    // const editorRef = useRef(null);
    const [postIdeas, setPostIdeas] = useState<PostIdea[]>([])
    const [error, setError] = useState("")
    const [loading, isLoading] = useState(false)
    const [openStory, setOpenStory] = useState<{ open: boolean; data: PostIdea | null }>({ open: false, data: null })
    const [ideaLoading, setIdeaLoading] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const handleValueChange = (key: any, value: any) => {
        setPostingData((prevData) => ({ ...prevData, [key]: value }))
    }
    const generatePostAI = async () => {
        setIdeaLoading(true)
        try {
            const aiResponse = await postData("/ai/generate-story", { topics: "Mahasiswa, Totabuan, Manusia, Masyarakat adat bolaang mongondow", }) as any
            console.log("ini ai response", aiResponse)
            // const generatedIdeas = aiResponse.data.parsed

            const generatedIdeas = aiResponse?.parsed || [];
            if (Array.isArray(generatedIdeas) && generatedIdeas.length > 0) {
                setPostIdeas(generatedIdeas);
            } else {
                console.warn("AI tidak mengembalikan ide valid:", generatedIdeas);
            }
            console.log("ini generated", generatedIdeas)
        } catch (error) {
            console.log("Tunggu AI Berak dulu", error)
        } finally {
            setIdeaLoading(false)
        }
    }
    const handlePublish = async (isDraft: any) => {
    }
    const fetchPostSlug = async () => { }
    const deletePost = async () => { }
    useEffect(() => {
        if (isEdit) {
            fetchPostSlug()
        } else {
            generatePostAI()
        }
        return () => { }
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 md:mt-0">
                <span className='flex gap-1 '>
                    <h2 className="text-2xl sm:text-3xl font-cabella">Write An Amazing Story</h2>
                    <div>{!isEdit
                        ? <p className='px-1.5 py-0.5 bg-emerald-200 rounded-md text-xs font-medium'>✨New</p>
                        : <p className='px-1.5 py-0.5 bg-amber-200 rounded-md text-xs font-medium'> 🖋️Edit</p>
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
                            <Button
                                className='flex hover:bg-rose-50 text-rose-300 hover:text-rose-500 hover:border-rose-500 border'
                                variant={"ghost"}
                                size={"sm"}
                                disabled={loading}
                                onClick={() => setOpenDeleteAlert(true)}
                            >
                                <LucideTrash2 className='' />
                            </Button>
                        )}
                        <Button
                            className='flex hover:bg-sky-50 bg-sky-100 text-sky-500 hover:text-sky-700 hover:border-sky-500 border'
                            variant={"ghost"}
                            size={"sm"}
                            disabled={loading}
                            onClick={() => handlePublish(true)}
                        >
                            <LucideSave className='' />
                        </Button>
                        <Button
                            className='flex hover:bg-linear-to-r hover:from-emerald-200 hover:to-emerald-400 bg-linear-to-r from-emerald-100 to-emerald-300 text-emerald-500 hover:text-emerald-900 hover:border-emerald-500 border'
                            variant={"ghost"}
                            size={"sm"}
                            disabled={loading}
                            onClick={() => handlePublish(false)}
                        >
                            {loading ? (
                                <LucideLoader2 className='' />
                            ) : (
                                <LucideSend className='' />
                            )}
                            <span className='hidden md:block'>Publish</span>
                        </Button>
                    </div>
                </span>
            </div>
            <Separator />
            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            <div className="bg-slate-50 md:p-4 rounded-2xl shadow-2xl gap-2 flex flex-col">
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
                    {/* <Label className='text-xs font-medium text-muted-foreground text-center mb-4'></Label> */}
                    <div className="w-full p-2">
                        <Editor
                            apiKey='ih2jrrv0v85b0hyexn6e0sxrh3bvsf4djnbwrbh4ki2ad4ol'
                            value={postingData.content}
                            // readOnly={0 > progress && progress < 100}
                            // onChange={setValue}
                            onEditorChange={(data) => handleValueChange("content", data)}
                            init={{
                                height: 500,
                                menubar: false,
                                plugins:
                                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar:
                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                // content_css: 'tinymce-5-dark',
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
                                                // Mengirim gambar sebagai Base64 Data URL
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
            <div className="bg-slate-50 md:p-4 rounded-2xl shadow-2xl gap-2 flex flex-col">
                {!isEdit && (
                    <div className="form-card col-span-12 md:col-span-4 p-0">
                        <div className="flex items-center justify-between px-4 pt-6">
                            <h4 className="text-sm md:text-base font-medium inline-flex">
                                <span className="text-emerald-600"><LucideSparkles /></span>
                                Ideas for your next post
                            </h4>
                            <Button onClick={() => setOpenStory({ open: true, data: null })}
                                disabled={ideaLoading} className='bg-linear-to-r from-emerald-500 to-green-400 text-sm'>{ideaLoading ? "Generating..." : "Generate Story"}</Button>
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
                                        tone={"casual"}
                                        imgUrl={idea.imgUrl}
                                        content={idea.content}
                                        onSelect={() => setOpenStory({ open: true, data: idea })}
                                    />
                                )))
                            }
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default CreateStoryspace