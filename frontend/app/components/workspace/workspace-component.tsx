import { colorOptions, ROLES, type CreateWorkspaceProps, type InviteMemberDialogProps, type User, type Workspace, type WorkspaceHeaderProps } from "@/types"
import { Link, useNavigate } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { CalendarClock, Copy, CopyCheckIcon, MailsIcon, Plus, Send, UserPlus, UserStarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { BackButton } from "../back-button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { inviteMemberSchema, workspaceSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateWorkspace, useInviteMemberMutation } from "@/hooks/use-workspace"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { cn } from "@/lib/utils"
import type z from "zod"
import { useState } from "react"
import { Separator } from "../ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Label } from "../ui/label"


export const WorkspaceAvatar = ({ color, name, className }: { color: string, name: string, className: string }) => {
    return (
        // <div className="w-6 h-6 rounded flex items-center justify-center"
        <div className={className}
            style={{
                backgroundColor: color,
            }}>
            <span className="text-xs font-medium text-white">
                {name.charAt(0).toUpperCase()}
            </span>

        </div>
    )
}
export const WorkspaceHeader = ({ workspace, members, onCreateProject, onInviteMember }: WorkspaceHeaderProps) => {
    return (
        <div className='space-y-8'>
            <div className="space-y-3">
                <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
                    <div className="flex items-center justify-center gap-2">
                        {workspace.color && (
                            <WorkspaceAvatar color={workspace.color} name={workspace.name} className='w-6 h-6 items-center justify-center flex rounded' />
                        )}
                        <h2 className='text-lg sm:text-2xl font-semibold'>{workspace.name}</h2>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0 gap-2 justify-center mb-2 md:mb-0">
                        {members.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className='text-sm text-muted-foreground'>Member's :</span>
                                <div className="flex ">
                                    {members.map((member) => (
                                        <Avatar key={member._id}
                                            className='relative h-8 w-8 rounded-full border-b border-background overflow-hidden'
                                            title={member.user.name}>
                                            <AvatarImage src={member.user.profilePicture} alt={member.user.name} />
                                            <AvatarFallback>
                                                {member.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button className='hover:bg-emerald-200 shadow-2xl text-xs' size={"sm"} variant={"outline"} onClick={onInviteMember}><UserPlus className='' /><span className="hidden sm:block">Invite Member</span></Button>
                        <Button className='hover:bg-emerald-200 shadow-2xl text-xs' size={"sm"} variant={"outline"} onClick={onCreateProject}><Plus className='' /><span className="hidden sm:block">New Project</span></Button>
                        <BackButton />
                    </div>
                </div>
                {workspace.description && <p className='text-xs md:text-sm text-muted-foreground text-justify m-4'>{workspace.description}</p>}
            </div>
        </div>
    )
}
export const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Card className='transition-all hover:shadow-lg hover:-translate-y-1'>
            <CardHeader className=''>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <WorkspaceAvatar name={workspace.name} color={workspace.color} className="w-9 h-9 rounded flex items-center justify-center" />
                        <div className="flex justify-between flex-col">
                            <CardTitle className=''>{workspace.name
                                .split(" ")
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(" ")
                            }
                            </CardTitle>
                            <span className='text-muted-foreground text-xs flex items-center'>post: {format(workspace.createdAt, "dd-MMM-yyyy H:mm", { locale: id })} <CalendarClock className='size-3 ml-1' /></span>
                        </div>
                    </div>
                    <Popover>
                        <PopoverTrigger>
                            <div className="text-muted-foreground flex items-center">
                                <UserStarIcon className='size-4 mr-1' />
                                <span className='text-sm'>{workspace.members.length}</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="leading-none font-medium">Listing Members</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Set the dimensions for the layer.
                                    </p>
                                    {workspace.members?.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className='text-sm text-muted-foreground'>Member's :</span>
                                            <div className="flex space-x-2">
                                                {workspace.members.map((member) => (
                                                    <Avatar key={member.user._id}
                                                        className='relative h-8 w-8 rounded-full border-b border-background overflow-hidden'
                                                        title={member.user.name}>
                                                        <AvatarImage src={member.user.profilePicture} alt={member.user.name} />
                                                        <AvatarFallback>
                                                            {/* {member?.user?.name.charAt(0).toUpperCase() ?? "?"} */}
                                                            {member?.user?.name?.charAt(0).toUpperCase().split(" ")
                                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                                .join(" ") ?? "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <CardDescription className='text-justify'>
                    {workspace.description?.split(" ")
                        .slice(0, 15)
                        .join(" ")}{(workspace.description ?? "").split(" ").length && " ..."}
                </CardDescription>
                <Separator />
            </CardHeader>
            <CardContent className="-mb-6">
                <Link to={`/workspaces/${workspace._id}`}>
                    <div className="text-end -mt-7 -mr-4">
                        <Button variant={"link"} className="text-xs text-muted-foreground hover:text-emerald-600 italic">
                            View details project
                        </Button>
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}
export type WorkspaceForm = z.infer<typeof workspaceSchema>
export const CreateWorkspace = ({ isCreatingWorkspace, setIsCreatingWorkspace }: CreateWorkspaceProps) => {
    const form = useForm<WorkspaceForm>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: colorOptions[0],
            description: ""
        }
    })
    const maxDescription = 400
    const navigate = useNavigate()
    const { mutate, isPending } = useCreateWorkspace()
    const onSubmit = (data: WorkspaceForm) => {
        mutate(data, {
            onSuccess: (data: any) => {
                form.reset()
                setIsCreatingWorkspace(false)
                toast.success("Ruang kerja berhasil dibuat")
                navigate(`/workspaces/${data._id}`)
            }, onError: (error: any) => {
                const errorMessage = error.response.data.message
                toast.error(errorMessage)
                console.log(error)
            }
        })
    }
    return <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
        <DialogContent className="max-h-[80vh] overflow-y-auto text-slate-600">
            <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogDescription>Ruang Kerja Digital - Project Managerial</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem >
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Workspace Name" className="" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea maxLength={maxDescription} {...field} placeholder="Workspace Description" rows={3} />
                                </FormControl>
                                <FormMessage />
                                <span className="text-xs text-muted-foreground text-end">{field.value?.length || 0}/{maxDescription} characters</span>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="color" render={({ field }) => (
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
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
export const InviteMemberDialog = ({ isOpen, onOpenChange, workspaceId, }: InviteMemberDialogProps) => {
    const [inviteTab, setInviteTab] = useState("email");
    const [linkCopied, setLinkCopied] = useState(false);
    const form = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "member",
        },
    });
    const { mutate, isPending } = useInviteMemberMutation();
    const onSubmit = async (data: InviteMemberFormData) => {
        if (!workspaceId) return;
        mutate({
            workspaceId,
            ...data,
        }, {
            onSuccess: () => {
                toast.success("Invite sent successfully");
                form.reset();
                setInviteTab("email");
                onOpenChange(false);
            },
            onError: (error: any) => {
                toast.error(error.response.data.message);
                console.log(error);
            },
        }
        );
    };
    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/workspace-invite/${workspaceId}`
        );
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 3000);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite to Workspace</DialogTitle>
                </DialogHeader>
                <Tabs
                    defaultValue="email"
                    value={inviteTab}
                    onValueChange={setInviteTab}
                >
                    <TabsList>
                        <TabsTrigger value="email" disabled={isPending}>
                            Send Email
                        </TabsTrigger>
                        <TabsTrigger value="link" disabled={isPending}>
                            Share Link
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="email">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)}>
                                        <div className="flex flex-col space-y-6 w-full">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Enter email" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Select Role</FormLabel>
                                                        <FormControl>
                                                            <div className="flex gap-3 flex-wrap">
                                                                {ROLES.map((role) => (
                                                                    <label
                                                                        key={role}
                                                                        className="flex items-center cursor-pointer gap-2 text-sm"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            value={role}
                                                                            className="peer hidden"
                                                                            checked={field.value === role}
                                                                            onChange={() => field.onChange(role)}
                                                                        />
                                                                        <span
                                                                            className={cn(
                                                                                "w-5 h-5 rounded-full border-2 border-emerald-300 flex items-center justify-center transition-all duration-300 hover:shadow-lg bg-emerald-500 text-white",
                                                                                field.value === role &&
                                                                                "ring-2 ring-emerald-500 ring-offset-1 "
                                                                            )}
                                                                        >
                                                                            {field.value === role && (
                                                                                <span className="w-3 h-3 rounded-full bg-slate-700" />
                                                                            )}
                                                                        </span>
                                                                        <span className="capitalize">{role}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            className="mt-6 w-full hover:bg-emerald-500 hover:text-white"
                                            size={"sm"}
                                            disabled={isPending}
                                            variant={"secondary"}
                                        >
                                            <Send className="w-4 h-4 mr-1 " />
                                            Send Invitation Email
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="link">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Share this link to invite people</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        readOnly
                                        value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                                    />
                                    <Button onClick={handleCopyInviteLink} disabled={isPending} size={"sm"}>
                                        {linkCopied ? (
                                            <>
                                                <CopyCheckIcon className="h-4 w-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Anyone with the link can join this workspace
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};