import { useAddCommentkMutation, useAddSubTaskMutation, useCreateTaskMutation, useGetCommentByTaskIdQuery, useTaskActivityQuery, useUpdateSubTaskMutation, useUpdateTaskAssigneesMutation, useUpdateTaskDescriptionMutation, useUpdateTaskPriorityMutation, useUpdateTaskStatusMutation, useUpdateTaskTitleMutation } from "@/hooks/use-task"
import { createTaskSchema } from "@/lib/schema"
import { RandomColors, type ActionType, type ActivityLog, type Comment, type CreateTaskDialogProps, type ProjectMemberRole, type Subtask, type Task, type TaskColumnProps, type TaskPriority, type TaskStatus, type User } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { AlertCircle, Building2, CalendarCheck, CalendarDaysIcon, CheckCircle, CheckCircle2, CheckSquare, Clock, Clock1, Edit, FileCode2, FileEdit, FilePlus, FolderEdit, FolderPlus, ListPlusIcon, LogIn, MessageSquare, Save, SendHorizonal, SquareX, Upload, UserMinus, UserPlus, WholeWord } from "lucide-react"
import { format, formatDistance, formatDistanceToNow } from "date-fns"
import { Checkbox } from "../ui/checkbox"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { id } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Calendar } from "../ui/calendar"
import React, { useState } from "react"
import Loading from "../loader"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"


export type CreateTaskFormData = z.infer<typeof createTaskSchema>
export const CreateTaskDialog = ({ open, onOpenChange, projectId, projectMembers }: CreateTaskDialogProps) => {
    const form = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium",
            dueDate: "",
            assignees: [],
        }
    })
    const { mutate, isPending } = useCreateTaskMutation()
    const onSubmit = (values: CreateTaskFormData) => {
        mutate(
            {
                projectId,
                taskData: values,
            },
            {
                onSuccess: () => {
                    toast.success("Task berhasil ditambahkan")
                    form.reset()
                    onOpenChange(false)
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message
                    toast.error(errorMessage)
                    console.log(error)
                }
            }
        )
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Masukan judul task" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Masukan deskripsi tugas" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )} />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField control={form.control} name="status" render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <FormItem>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="To Do">To Do</SelectItem>
                                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                                            <SelectItem value="Done">Done</SelectItem>
                                                        </SelectContent>
                                                    </FormItem>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="priority" render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Priority</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                    <FormItem>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full"><SelectValue placeholder="Priority" /></SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Low">Low</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="High">High</SelectItem>
                                                        </SelectContent>
                                                    </FormItem>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="dueDate" render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={"w-full justify-start text-left font-normal" + (!field.value ? "text-muted-foreground" : "")}>
                                                        <CalendarDaysIcon className="size-4 mr-2" />
                                                        {field.value
                                                            ? (format(new Date(field.value), "PPPP", { locale: id }))
                                                            : (<span>Pick a date</span>)
                                                        }
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => { field.onChange(date?.toISOString() || undefined) }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="assignees" render={({ field }) => {
                                    const selectedMembers = field.value || []
                                    return (
                                        <FormItem>
                                            <FormLabel>Assignees</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className="w-full justify-start text-left font-normal min-h-11">
                                                            {selectedMembers.length === 0 ? (
                                                                <span className="text-muted-foreground">Selected Assignees</span>
                                                            ) : selectedMembers.length <= 2 ? (
                                                                selectedMembers.map((m) => {
                                                                    const member = projectMembers.find((wm) => wm.user._id === m)
                                                                    return `${member?.user.name}`
                                                                }).join(", ")
                                                            ) : (`${selectedMembers.length} assignees selected`)}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-sm max-h-60 overflow-y-auto p-2" align="center">
                                                        <div className="flex flex-col gap-2">
                                                            {projectMembers.map((member) => {
                                                                const selectedMember = selectedMembers.find((m) => m === member.user?._id)
                                                                return (
                                                                    <div className="flex items-center gap-2 p-2 border rounded" key={member.user._id}>
                                                                        <Checkbox checked={!!selectedMember} onCheckedChange={(checked) => {
                                                                            if (checked) { field.onChange([...selectedMembers, member.user._id]) }
                                                                            else { field.onChange(selectedMembers.filter((m) => m !== member.user._id)) }
                                                                        }} id={`member-${member.user._id}`} />
                                                                        <span className="truncate flex-1">{member.user.name}</span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )
                                }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : <span className="text-xs">Create Task</span>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export const TaskColumn = ({ title, tasks, onTaskClick, isFullWidth = false, }: TaskColumnProps) => {
    return (
        <div className={isFullWidth ? "grid grid-cols-1 md:grid-cols-1 gap-4" : ""}>
            <div className={cn("space-y-6", !isFullWidth ? "hfull" : "col-span-full")}>
                {!isFullWidth && (
                    <div className="flex items-center justify-center gap-1">
                        <h1 className="font-medium">{title}</h1>
                        <Badge variant="outline">{tasks.length}</Badge>
                    </div>
                )}
                <div className={cn("space-y-4", isFullWidth && "grid grid-cols-1 lg:grid-cols-3 gap-4")}>
                    {tasks.length === 0
                        ? (
                            <div className="text-center text-sm text-muted-foreground mt-4">
                                No tasks yet
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onClick={() => onTaskClick(task._id)}
                                />
                            ))
                        )}
                </div>
            </div>
        </div>
    );
};
const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
    return (
        <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full mt-4">
            <CardHeader>
                <div className="flex items-center justify-between -mb-6">
                    <div className="flex gap-2 items-center">
                        <Badge className={task.priority === "High"
                            ? "bg-red-600 text-white"
                            : task.priority === "Medium"
                                ? "bg-orange-500 text-white"
                                : "bg-blue-500 text-white"
                        }>{task.priority}</Badge>
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                                {task.subtasks.filter((subtask) => subtask.completed).length}/
                                {task.subtasks.length} Sub Tasks
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {task.status !== "To Do" && (
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="size-7 hover:text-amber-500"
                                onClick={() => {
                                    console.log("mark as to do");
                                }}
                                title="Mark as To Do">
                                <AlertCircle className={cn("size-6")} />
                                <span className="sr-only">Mark as To Do</span>
                            </Button>
                        )}
                        {task.status !== "In Progress" && (
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="size-7 hover:text-blue-600"
                                onClick={() => {
                                    console.log("mark as in progress");
                                }}
                                title="Mark as In Progress"
                            >
                                <Clock className={cn("size-6")} />
                                <span className="sr-only">Mark as In Progress</span>
                            </Button>
                        )}
                        {task.status !== "Done" && (
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="size-7 hover:text-emerald-600"
                                onClick={() => {
                                    console.log("mark as done");
                                }}
                                title="Mark as Done"
                            >
                                <CheckCircle className={cn("size-6")} />
                                <span className="sr-only">Mark as Done</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="cursor-pointer" onClick={onClick}>
                <h4 className="font-medium">{task.title}</h4>
                {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                    </p>
                )}
                <Separator className="mt-2 mb-2" />
                <div className="flex items-center justify-between text-sm -mb-2">
                    <div className="flex items-center gap-2">
                        {task.assignees && task.assignees.length > 0 && (
                            <div className="flex space-x-2">
                                {task.assignees.slice(0, 10).map((member) => (
                                    <Avatar
                                        key={member._id}
                                        className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                                        title={member.name}
                                    >
                                        <AvatarImage src={member.profilePicture} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {task.assignees.length > 10 && (
                                    <span className="text-xs text-muted-foreground">
                                        + {task.assignees.length - 10}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {task.dueDate && (
                        <div className="text-xs text-muted-foreground flex items-center">
                            <CalendarCheck className="size-3 mr-1" />
                            {format(new Date(task.dueDate), "d MMMM yyyy", { locale: id })}
                        </div>
                    )}
                </div>
                {/* 5/10 subtasks */}
            </CardContent>
        </Card>
    )
}
export const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newTitle, setNewTitle] = useState(title)
    const { mutate, isPending } = useUpdateTaskTitleMutation()
    const updateTitle = () => {
        mutate(
            { taskId, title: newTitle },
            {
                onSuccess: () => {
                    setIsEditing(false)
                    toast.success("Title has been updated")
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message
                    toast.error(errorMessage)
                    console.log(error)
                }
            }
        )
    }
    return (
        <div className="flex items-center gap-2 mt-2">
            {isEditing
                ? (<Input className="text-lg! font-semibold w-full sm:min-w-lg" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} disabled={isPending} />)
                : (<h2 className="text-xl flex-1 font-semibold">{title}</h2>)
            }
            {isEditing
                ? (<Button variant={"outline"} className="py-0 bg-emerald-400" size={"sm"} onClick={updateTitle} disabled={isPending}><Save /></Button>)
                : (<Edit className="size-4 cursor-pointer hover:text-slate-500" onClick={() => setIsEditing(true)} />)
            }
        </div>
    )
}
export const TaskStatusSelector = ({ status, taskId }: { status: TaskStatus, taskId: string }) => {
    const { mutate, isPending } = useUpdateTaskStatusMutation()
    const handleStatusChange = (value: string) => {
        mutate({ taskId, status: value as TaskStatus }, {
            onSuccess: () => {
                toast.success("Update status berhasil men.")
            },
            onError: (error: any) => {
                const errorMessage = error.response.data.message
                toast.error(errorMessage)
                console.log(error)
            }
        })
    }
    return (<div className="">
        <h3 className="text-xs text-center font-medium text-muted-foreground">Status</h3>
        <Select value={status || ""} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-fit text-xs font-bold tracking-wide" disabled={isPending} >
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="To Do">To do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
        </Select>
    </div>
    )
}
export const TaskDescription = ({ description, taskId }: { description: string; taskId: string }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newDescription, setNewDescription] = useState(description)
    const { mutate, isPending } = useUpdateTaskDescriptionMutation()
    const maxDescription = 400
    const updateDescription = () => {
        mutate(
            { taskId, description: newDescription },
            {
                onSuccess: () => {
                    setIsEditing(false)
                    toast.success("Description has been updated")
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message
                    toast.error(errorMessage)
                    console.log(error)
                }
            }
        )
    }
    return (
        <>
            <div className="flex flex-col justify-start sm:flex-row items-center gap-2 ">
                {isEditing
                    ? (<Textarea className="text-justify sm:min-w-lg" maxLength={maxDescription} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} disabled={isPending} />)
                    : (<div className="py-4 shadow-xs text-sm md:text-base text-pretty text-justify flex-1">{description}</div>)
                }
                {isEditing
                    ?
                    (<span className="flex sm:flex-col gap-2">
                        <Button title="Save" variant={"outline"} className="bg-emerald-400 " size={"sm"} onClick={updateDescription} disabled={isPending}><Save /></Button>
                        <Button title="Cancel" variant={"outline"} className="bg-red-500 text-white" size={"sm"} onClick={() => setIsEditing(false)} disabled={isPending}><SquareX /></Button>
                    </span>)
                    :
                    (<span className="">
                        <Button variant={"ghost"} className="hover:bg-emerald-400" size={"sm"} onClick={() => setIsEditing(true)} disabled={isPending}><Edit /></Button>
                    </span>)
                }
            </div>
            <p className="text-sm hidden sm:block text-gray-400 text-start mt-2">
                {newDescription.length}/{maxDescription} characters
            </p>
        </>
    )
}
export const TaskAssigneesSelector = ({ task, assignees, projectMembers }: {
    task: Task
    assignees: User[]
    projectMembers: { user: User; role: ProjectMemberRole }[]
}) => {
    const [initialIds, setInitialIds] = useState<string[]>(
        assignees.map((assignee) => assignee._id)
    )
    const [selectedIds, setSelectedIds] = useState<string[]>(initialIds)
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const { mutate, isPending } = useUpdateTaskAssigneesMutation()
    const handleSelectAll = () => {
        const allIds = projectMembers.map((m) => m.user._id)
        setSelectedIds(allIds)
    }
    const handleUnSelectAll = () => {
        setSelectedIds([])
    }
    const handleSelect = (id: string) => {
        let newSelected: string[] = []
        if (selectedIds.includes(id)) {
            newSelected = selectedIds.filter((sid) => sid !== id)
        } else {
            newSelected = [...selectedIds, id]
        }
        setSelectedIds(newSelected)
    }
    const handleSave = () => {
        mutate({
            taskId: task._id,
            assignees: selectedIds
        }, {
            onSuccess: () => {
                setInitialIds(selectedIds)
                setDropDownOpen(false)
                toast.success("Daftar member berhasil dirubah men.")
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Gagal menambahkan member men."
                toast.error(errorMessage)
                console.log(errorMessage)
            }
        })
    }
    const handleCancel = () => {
        setSelectedIds(initialIds) // reset ke kondisi awal
        setDropDownOpen(false)
    }
    return (
        <>
            <div className="">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigness</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedIds.length === 0
                        ? (<span className="text-xs text-muted-foreground ">Nothing member a signed to this task</span>)
                        : (
                            projectMembers.filter((member) => selectedIds.includes(member.user._id)).map((m) =>
                                <div className="flex items-center bg-gray-100 rounded px-2 py-2" key={m.user._id}>
                                    <Avatar className="size-6 mr-1">
                                        <AvatarImage className='h-8 w-8' title={m.user.name} src={m.user.profilePicture} alt={m.user.name.charAt(0).toUpperCase()} />
                                        <AvatarFallback className={RandomColors[Math.floor(Math.random() * RandomColors.length)]}>{m.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{m.user.name
                                        .split(" ")
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(" ")}
                                    </span>
                                </div>
                            )
                        )}
                </div>
                <div className="relative">
                    <button className="text-xs text-muted-foreground w-full border px-3 py-2 text-left bg-white" onClick={() => setDropDownOpen(!dropDownOpen)}>
                        {setSelectedIds.length === 0 ? "Select Assignees" : `${selectedIds.length} Selected`}
                    </button>
                    {dropDownOpen &&
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                            <div className="flex justify-between px-2 py-2 border-b">
                                <Button variant={"ghost"} className="text-xs text-blue-600" onClick={handleSelectAll}>Select All</Button>
                                <Button variant={"ghost"} className="text-xs text-red-600" onClick={handleUnSelectAll}>Unselect All</Button>
                            </div>
                            {projectMembers.map((m) => (
                                <label className="flex items-center px-3 py-2 gap-4 cursor-pointer hover:bg-gray-50" key={m.user._id}>
                                    <Checkbox checked={selectedIds.includes(m.user._id)}
                                        onCheckedChange={() => handleSelect(m.user._id)}
                                        className="mr-2 ml-2" />
                                    <Avatar className="size-6">
                                        <AvatarImage className='h-8 w-8' title={m.user.name} src={m.user.profilePicture} alt={m.user.name.charAt(0).toUpperCase()} />
                                        <AvatarFallback className={RandomColors[Math.floor(Math.random() * RandomColors.length)]}>{m.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{m.user.name
                                        .split(" ")
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(" ")}
                                    </span>
                                </label>
                            ))}
                            <div className="flex  items-center justify-between mx-4">
                                <span className="text-xs text-muted-foreground mt-2">
                                    {setSelectedIds.length === 0 ? "Select Assignees" : `${selectedIds.length} Selected`}
                                </span>
                                <div className="flex justify-end items-center gap-2 px-2 py-2  border-b">
                                    <Button variant={"destructive"} size={"sm"} className="font-light"
                                        // onClickCapture={() => setDropDownOpen(false)}
                                        // onClick={(e) => setDropDownOpen(false)}
                                        onClick={handleCancel} // <-- reset & close
                                        disabled={isPending}>
                                        <SquareX />
                                    </Button>
                                    <Button variant={"outline"} size={"sm"} className="font-light bg-emerald-400"
                                        onClickCapture={() => handleSave()} disabled={isPending} >
                                        <Save />
                                    </Button>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        </>
    )
}
export const TaskPrioritySelector = ({ taskId, priority }: {
    taskId: string
    priority: TaskPriority
}) => {
    const { mutate, isPending } = useUpdateTaskPriorityMutation()
    const handleStatusChange = (value: string) => {
        mutate({ taskId, priority: value as TaskPriority }, {
            onSuccess: () => {
                toast.success("Prioritas member berhasil dirubah men.")
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message
                toast.error(errorMessage)
                console.log(errorMessage)
            }
        })
    }

    return (
        <div className="">
            <h3 className="text-xs text-center font-medium text-muted-foreground">Priority</h3>
            <Select value={priority || ""} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-fit text-xs font-bold tracking-wide" disabled={isPending}>
                    <SelectValue placeholder={"Priority"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
export const SubTasksDetails = ({ subTasks, taskId }: { subTasks: Subtask[]; taskId: string }) => {
    const [newSubTask, setNewSubTask] = useState("")
    const { mutate: addSubTask, isPending } = useAddSubTaskMutation()
    const { mutate: updateSubTask, isPending: isUpdating } = useUpdateSubTaskMutation()
    const handleToggleTask = (subTaskId: string, checked: boolean) => {
        updateSubTask(
            { taskId, subTaskId, completed: checked },
            {
                onSuccess: () => {
                    if (checked) {
                        toast.info("Update Sub Tugas baru berhasil")
                    } else {
                        toast.warning("Perubahan dibatalkan")
                    }
                },
                onError: (error) => {
                    console.log(error)
                    toast.error("Gagal mengubah Sub Tugas loh")
                }
            }
        )
    }
    const handleAddSubTask = () => {
        addSubTask(
            { taskId, title: newSubTask },
            {
                onSuccess: () => {
                    setNewSubTask("")
                    toast.success("Sub Tugas baru berhasil ditambahkan men")
                },
                onError: (error: any) => {
                    console.log(error)
                    toast.error("Gagal menambahkan Sub Tugas baru men")
                }
            }
        )
    }
    return (
        <div className="mb-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Sub Task Add & Checklist if Done </h3>
            <div className="flex items-center flex-wrap gap-2 mb-4">
                {subTasks.length > 0 ? (
                    subTasks.map((s) => (
                        <div className="flex items-center space-x-2" key={s._id}>
                            <Checkbox
                                id={s._id}
                                checked={s.completed}
                                onCheckedChange={(checked) => handleToggleTask(s._id, !!checked)}
                                disabled={isUpdating}
                            />
                            <label className={cn("text-sm", s.completed ? "line-through text-muted-foreground" : "")}>{s.title}</label>
                        </div>
                    ))) : (
                    <div className="text-xs text-muted-foreground">No Sub Task Detected</div>
                )}
            </div>
            <div className="flex items-center">
                <Input placeholder="Add a sub task for detailing project"
                    value={newSubTask} onChange={(e) => setNewSubTask(e.target.value)}
                    className="mr-1" disabled={isPending}
                />
                <Button variant={"outline"} className="bg-emerald-300 ml-2" onClick={handleAddSubTask} disabled={isPending || newSubTask.length === 0} size={"default"}><ListPlusIcon /></Button>

            </div>
        </div>
    )
}
export const Watchers = ({ watchers }: { watchers: User[] }) => {
    return (
        <div className="bg-card rounded-lg p-6 shadow-xl mb-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">Watchers & Members </h3>
            <div className="space-y-2">
                {watchers && watchers.length > 0 ? (
                    watchers.map((w) => (
                        <div className="flex items-center gap-2" key={w._id}>
                            <Avatar className="size-6">
                                <AvatarImage src={w.profilePicture} />
                                <AvatarFallback>{w.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    ))
                ) : (<div className="text-sm text-muted-foreground">No Data is pull to Database</div>)}
            </div>
        </div>
    )
}
export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
    const { data, isPending } = useTaskActivityQuery(resourceId) as {
        data: ActivityLog[]
        isPending: boolean
    }
    if (isPending) return <Loading />
    return (
        <div className="bg-card rounded-lg p-5 shadow-xl">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">Activity Task</h3>
            <ScrollArea className="h-[270px] mb-4">
                {data.map((act) => (
                    <div className="flex gap-2" key={act._id}>
                        <div className="size-4 rounded-full justify-center text-primary flex items-center mb-2">
                            {getActivityIcon(act.action)}
                        </div>
                        <div className="">
                            <p className="text-xs text-muted-foreground text-justify">
                                <span className="font-bold">{act.user.name.split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(" ")} - </span>
                                &nbsp;{act.details?.description}
                            </p>
                        </div>
                    </div>
                ))
                }
            </ScrollArea>
        </div>
    )
}
export const getActivityIcon = (action: ActionType) => {
    switch (action) {
        case "created_task":
            return (
                <div className="rounded-md">
                    <CheckSquare className="h-4 w-4 text-green-600 rounded-full" />
                </div>
            );
        case "created_subtask":
            return (
                <div className="p-2 rounded-md">
                    <CheckSquare className="h-4 w-4 text-emerald-600 rounded-full" />
                </div>
            );
        case "update_task":
            return (
                <div className="p-2 rounded-md">
                    <FileEdit className="h-4 w-4 text-blue-600 rounded-full" />
                </div>
            );
        case "update_title":
            return (
                <div className="p-2 rounded-md">
                    <WholeWord className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case "update_subtask":
            return (
                <div className="p-2 rounded-md">
                    <FileCode2 className="h-4 w-4 text-fuchsia-700 rounded-full" />
                </div>
            );
        case "completed_task":
            return (
                <div className="bg-green-600/10 p-2 rounded-md">
                    <CheckCircle className="h-4 w-4 text-green-600 rounded-full" />
                </div>
            );
        case "created_project":
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <FolderPlus className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case "updated_project":
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <FolderEdit className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case "completed_project":
            return (
                <div className="bg-green-600/10 p-2 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600 rounded-full" />
                </div>
            );
        case "created_workspace":
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <Building2 className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case "added_comment":
            return (
                <div className="p-2 rounded-md">
                    <MessageSquare className="h-4 w-4 text-amber-600 rounded-full" />
                </div>
            );
        case "added_member":
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <UserPlus className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case "removed_member":
            return (
                <div className="bg-red-600/10 p-2 rounded-md">
                    <UserMinus className="h-5 w-5 text-red-600 rounded-full" />
                </div>
            );
        case "joined_workspace":
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <LogIn className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        case "added_attachment":
            return (
                <div className="bg-blue-600/10 p-2 rounded-md">
                    <Upload className="h-5 w-5 text-blue-600 rounded-full" />
                </div>
            );
        default:
            return null;
    }
};
export const CommentSection = ({ taskId, members }: { taskId: string; members: User[] }) => {
    const [newComment, setNewComment] = useState("")
    const { mutate: addComment, isPending } = useAddCommentkMutation()
    const { data: comments, isLoading } = useGetCommentByTaskIdQuery(taskId) as {
        data: Comment[],
        isLoading: boolean
    }
    const handleAddComment = () => {
        if (!newComment.trim()) return
        addComment({ taskId, text: newComment }, {
            onSuccess: () => { setNewComment(""), toast.success("Comment berhasil ditambahkan") },
            onError: (error: any) => { toast.error("Gagal menambahkan comment", error) }
        })
    }
    return (
        <div className="bg-card rounded-lg p-6 shadow-xl mb-6" >
            <h3 className="text-lg font-medium text-muted-foreground mb-4">Comment's & Review's</h3>
            <ScrollArea className="h-[300px] mb-4" >
                {(comments?.length ?? 0) > 0 ? (comments.map((c) => (
                    <div key={c._id} className="flex sm:gap-4 py-2 sm:mr-6">
                        <Avatar className="size-8 hidden sm:block">
                            <AvatarImage src={c.author.profilePicture} />
                            <AvatarFallback>{c.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{c.author.name
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(" ")}</span>
                                <span className="text-xs text-muted-foreground flex gap-1"><Clock1 className="size-4" />{formatDistanceToNow(c.createdAt, { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-muted-foreground text-justify mb-2">{c.text}</p>
                            <Separator />
                        </div>
                    </div>
                )))
                    : (<div className="flex items-center justify-center h-full flex-col py-8 gap-4">
                        <p className="text-sm text-muted-foreground">Comment not yet</p>
                    </div>)
                }
            </ScrollArea>
            <Separator className="my-4" />
            <div className="mt-4 flex items-center gap-2">
                <Textarea placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <div className="flex justify-end">
                    <Button size={"sm"} variant={"outline"} className="bg-emerald-400" disabled={!newComment.trim() || isPending} onClick={handleAddComment} ><SendHorizonal /></Button>
                </div>
            </div>
        </div>
    )
}
