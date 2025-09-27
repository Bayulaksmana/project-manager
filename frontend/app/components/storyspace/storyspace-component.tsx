import { storyspaceSchema, workspaceSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useCreateWorkspace } from "@/hooks/use-workspace"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useCreateStory } from "@/hooks/use-storypace"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Image from "../image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { BookOpenCheckIcon, CalendarClock } from "lucide-react"
import type { Storyspace } from "@/types"

interface CreateStoryspaceProps {
    isCreatingStoryspace: boolean
    setIsCreatingStoryspace: (isCreatingStoryspace: boolean) => void
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

const CreateStoryspace = ({ isCreatingStoryspace, setIsCreatingStoryspace }: CreateStoryspaceProps) => {
    const form = useForm<StoryspaceForm>({
        resolver: zodResolver(storyspaceSchema),
        defaultValues: {
            title: "",
            conten: colorOptions[0],
            description: ""
        }
    })
    const navigate = useNavigate()
    const { mutate, isPending } = useCreateStory()
    const onSubmit = (data: StoryspaceForm) => {
        mutate(data, {
            onSuccess: (data: any) => {
                form.reset()
                setIsCreatingStoryspace(false)
                toast.success("Ruang kerja berhasil dibuat")
                navigate(`/workspaces/${data._id}`)
            }, onError: (error: any) => {
                const errorMessage = error.response.data.message
                toast.error(errorMessage)
                console.log(error)
            }
        })
    }
    return <Dialog open={isCreatingStoryspace} onOpenChange={setIsCreatingStoryspace} modal={true}>
        <DialogContent className="max-h-[80vh] overflow-y-auto text-slate-600">
            <DialogHeader>
                <DialogTitle>Create a new Story</DialogTitle>
                <DialogDescription>Ruang Kerja DIgital - Pengurus KPMIBM-R P.C Bandung</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Workspace Name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Workspace Description" rows={3} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="conten" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <div className="flex gap-4 flex-wrap">
                                        {colorOptions.map((color) => (
                                            <div key={color} onClick={() => field.onChange(color)} className={cn("w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300", field.value === color && "ring-2 ring-offset-2 border-slate-700")} style={{ backgroundColor: color }}></div>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating ..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}
const StoryspaceCard = ({ storyspace }: { storyspace: Storyspace }) => {
    return <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
            <div className="flex gap-4">
                <Image src={storyspace.img} alt="image" className="rounded object-cover" h={70} w={70} />
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


export {CreateStoryspace, StoryspaceCard}