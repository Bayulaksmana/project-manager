import { ProjectStatus, RandomColors, type CreateProjectDialogProps, type ProjectCardProps, type ProjectListProps } from "@/types"
import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"
import { BookPlusIcon, CalendarDays, LucideCalendarFold } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { getTaskStatusColor } from "@/lib"
import { projectSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseCreateProject } from "@/hooks/use-project"
import type z from "zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Checkbox } from "../ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { NoDataFound } from "../utils/no-data-found"

export const ProjectList = ({ workspaceId, projects, onCreateProject }: ProjectListProps) => {
    return (
        <div className="">
            <Separator className="mb-4" />
            <h3 className="text-2xl text-center font-bold mb-4 font-cabella">Daftar Projects ( % )</h3>
            <Separator className="mb-4" />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {projects.length === 0 ?
                    <NoDataFound title="No Project Found"
                        description="Create a project to get started"
                        buttonAction={onCreateProject}
                        buttonText="Create Project"
                    />
                    : (projects.map((p) => {
                        return (
                            <ProjectCard
                                key={p._id}
                                project={p}
                                progress={p.progress}
                                workspaceId={workspaceId}
                            />)
                    })
                    )
                }
            </div>
        </div>
    )
}
export const ProjectCard = ({ project, progress, workspaceId }: ProjectCardProps) => {
    return (
        <Card className="transition-all duration-300 hover:shadow-xl hover:translate-y-1 mb-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{project.title}</CardTitle>
                    <span className={cn("text-muted-foreground text-xs rounded-full p-2 text-center", getTaskStatusColor(project.status))}>{project.status}</span>
                </div>
                <CardDescription className="line-clamp-1 -mb-2">{project.description || "No Description"}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="">Progress</span>
                            <span className=""> {progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm gap-2 text-muted-foreground">
                            <span className="">
                                {project?.tasks.length}
                            </span>
                            <span>Tasks</span>
                        </div>
                        {project.dueDate && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarDays className="w-5 h-5 mr-1" />
                                <span>end of {formatDistanceToNow(project.dueDate)}</span>
                            </div>
                        )}
                    </div>
                    <Separator />
                </div>
                {!project.members ?
                    (<></>)
                    :
                    (<></>)
                }
                <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
                    <div className="-mb-6 -mr-4 text-end">
                        <Button variant={"link"} className="hover:text-emerald-500 text-xs text-muted-foreground italic">
                            Details Project
                        </Button>
                    </div>
                </Link >
            </CardContent>
        </Card>
    )
}
export type CreateProjectFormData = z.infer<typeof projectSchema>
export const CreateProjectDialog = ({ isOpen, onOpenChange, workspaceId, workspaceMembers }: CreateProjectDialogProps) => {
    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            members: [],
            tags: undefined,
        }
    })
    const { mutate, isPending } = UseCreateProject()
    const maxDescription = 400
    const onSubmit = (values: CreateProjectFormData) => {
        if (!workspaceId) return;
        mutate({
            projectData: values,
            workspaceId
        }, {
            onSuccess: () => {
                toast.success("Project berhasil ditambahkan")
                form.reset()
                onOpenChange(false)
            },
            onError: (error: any) => {
                const errorMessage = error.response.data.message;
                // toast.error("Tambah project eror, periksa part backend dan frontend")
                toast.error(errorMessage)
                console.log(error)
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[540px] text-slate-600">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>Create a new project to get started</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Title</FormLabel>
                                <FormControl><Input {...field} placeholder="New Project Title" /></FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea {...field} placeholder="Project Description" maxLength={maxDescription} /></FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full hover:bg-slate-100">
                                            <SelectValue placeholder="Select Project Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(ProjectStatus).map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )} />
                        <div className="sm:grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={"w-full justify-start text-left font-normal" + (!field.value ? "text-muted-foreground" : "")}>
                                                    <LucideCalendarFold className="size-4" />
                                                    {field.value ? format(new Date(field.value), "dd MMMM yyyy", { locale: id }) : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => { field.onChange(date?.toISOString() || undefined) }} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="dueDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Popover modal={true}>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={"w-full justify-start text-left font-normal" + (!field.value ? "text-muted-foreground" : "")}>
                                                    <LucideCalendarFold className="size-4" />
                                                    {field.value ? format(new Date(field.value), "dd MMMM yyyy", { locale: id }) : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => { field.onChange(date?.toISOString() || undefined) }} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="tags" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hashtags</FormLabel>
                                <FormControl><Input {...field} placeholder="Tags separated by comma" /></FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="members" render={({ field }) => {
                            const selectedMembers = field.value || []
                            return (
                                <FormItem>
                                    <FormLabel>Members List</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"}
                                                    className="w-full justify-start text-left font-normal min-h-11">
                                                    {selectedMembers.length === 0
                                                        ? <span className="text-muted-foreground">Select Members</span>
                                                        : selectedMembers.length <= 1
                                                            ? (selectedMembers.map((m) => {
                                                                const member = workspaceMembers.find((wm) => wm.user._id === m.user)
                                                                return `${member?.user.name.split(" ")
                                                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                                    .join(" ")} (${member?.role})`
                                                            }))
                                                            : (`${selectedMembers.length} members selected`)
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full max-w-75 overflow-y-auto" align="start">
                                                <div className="flex flex-col gap-2">{workspaceMembers.map((member) => {
                                                    const selectedMember = selectedMembers.find((m) => m.user === member.user._id)
                                                    return <div key={member._id} className="flex items-center gap-2 p-2 border rounded">
                                                        <Checkbox
                                                            checked={!!selectedMember}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange([...selectedMembers, { user: member.user._id, role: "contributor" }])
                                                                } else {
                                                                    field.onChange(selectedMembers.filter((m) => m.user !== member.user._id))
                                                                }
                                                            }}
                                                            id={`member-${member.user._id}`}
                                                        />
                                                        <Avatar key={member._id}
                                                            className='h-8 w-8'
                                                            title={member.user.name}>
                                                            <AvatarImage src={member.user.profilePicture} alt={member.user.name.charAt(0).toUpperCase()} />
                                                            <AvatarFallback className={RandomColors[Math.floor(Math.random() * RandomColors.length)]}>
                                                                {member.user.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm truncate flex-1">
                                                            {member.user.name
                                                                .split(" ")
                                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                                .join(" ")}
                                                        </span>
                                                        {selectedMember && (
                                                            <Select value={selectedMember.role} onValueChange={(role) => {
                                                                // selectedMembers.map((m) => m.user === member.user._id ? { ...m, role: role as | "manager" | "contributor" | "viewer", } : m)
                                                                field.onChange(
                                                                    selectedMembers.map((m) => m.user === member.user._id ? { ...m, role: role as | "manager" | "contributor" | "viewer", } : m)
                                                                )
                                                            }}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Role" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="manager">Manager</SelectItem>
                                                                    <SelectItem value="contributor">Contributor</SelectItem>
                                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                                </SelectContent>
                                                            </Select>)}
                                                    </div>
                                                })}</div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )
                        }} />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending} >
                                {isPending ? "Creating ..." : <span className="text-xs flex items-center gap-2"><BookPlusIcon />Create Project</span>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
