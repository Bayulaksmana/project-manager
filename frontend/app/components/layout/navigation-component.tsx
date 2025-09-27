import { useAuth } from "@/providers/auth-context"
import { RandomColors, type HeaderProps, type SidebarNavProps, type Workspace } from "@/types"
import { Button } from "../ui/button"
import { BadgeCheck, Bell, FileArchive, FileChartPieIcon, LayoutDashboard, ListTodo, LogOut, PlusCircle, Settings2, UserRoundCogIcon, Users, WorkflowIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Link, useLoaderData, useLocation, useNavigate } from "react-router"
import { WorkspaceAvatar } from "../workspace/workspace-component"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"


const Header = ({ onWorkspaceSelected, selectedWorkspace, onCreateWorkspace }: HeaderProps) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { workspaces } = useLoaderData() as { workspaces: Workspace[] }
    const isOnWorkspacePage = useLocation().pathname.includes("/workspace");
    const handleOnClick = (workspace: Workspace) => {
        onWorkspaceSelected(workspace);
        const location = window.location;
        if (isOnWorkspacePage) {
            navigate(`/workspaces/${workspace._id}`);
        } else {
            const basePath = location.pathname;
            navigate(`${basePath}?workspaceId=${workspace._id}`);
        }
    };
    return (
        <div className="bg-background sticky top-0 z-40 border-b">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className="hover:bg-emerald-100" >
                            {selectedWorkspace ?
                                (<>{
                                    selectedWorkspace.color && <WorkspaceAvatar color={selectedWorkspace.color} name={selectedWorkspace.name} className="w-6 h-5 rounded" />
                                }
                                    <span className="font-medium">{selectedWorkspace?.name}</span>
                                </>)
                                : (
                                    <span className="font-medium text-xs">Selected Workspace</span>
                                )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="text-xs">Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {workspaces.map((ws) => (
                                // <DropdownMenuItem key={ws._id} onClick={() => onWorkspaceSelected(ws) }>
                                <DropdownMenuItem
                                    key={ws._id}
                                    onClick={() => {
                                        handleOnClick(ws)
                                        // onWorkspaceSelected(ws)
                                        // if (window.location.pathname) {
                                        //     navigate(`/dashboard?workspaceId=${ws._id}`);
                                        // } else {
                                        //     navigate(`/members?workspaceId=${ws._id}`);
                                        // }
                                    }}
                                >
                                    {ws.color && (<WorkspaceAvatar color={ws.color} name={ws.name} className="w-6 h-6 rounded flex items-center justify-center" />)}
                                    <span className="ml-2 text-xs">{ws.name}</span>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={onCreateWorkspace}>
                                <PlusCircle />
                                <span className="text-xs items-center">Create Workspace</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2">
                    <Button variant={"ghost"} size={"icon"} className="hover:bg-emerald-100">
                        <Bell />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button>
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback className={RandomColors[Math.floor(Math.random() * RandomColors.length)]}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-fit text-gray-700 font-bold">
                            <DropdownMenuLabel className="flex items-center gap-2 font-bold">
                                <BadgeCheck className="w-4 h-4 text-gray-500" />
                                Login as {user?.name}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="default"><Link to={"/dashboard"} className="flex items-center gap-2"><LayoutDashboard />Dashboard</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link to={"/profile"} className="flex items-center gap-2"><UserRoundCogIcon />My Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link to={"/setings"} className="flex items-center gap-2"><Settings2 />Setting</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={logout}><LogOut />Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

const SidebarComponent = ({ currentWorkspace }: { currentWorkspace: Workspace | null; }) => {
    const { user, logout } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(true)
    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard
        },
        {
            title: "Workspaces",
            href: "/workspaces",
            icon: WorkflowIcon
        },
        {
            title: "My Tasks",
            href: "/my-tasks",
            icon: ListTodo
        },
        {
            title: "Members",
            href: "/members",
            icon: Users
        },
        {
            title: "Achieved",
            href: "/achieved",
            icon: FileArchive
        },
        {
            title: "Storyspace",
            href: "/storyspaces",
            icon: FileChartPieIcon
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings2
        },
    ]
    return (
        <div className={cn("flex flex-col border-r bg-sidebar transition-all duration-300", isCollapsed ? "w-16 md:w-[65px]" : "w-16 md:w-[220px]")}>
            <div className="flex items-baseline mb-4 p-1 justify-center">
                <Link to={"/dashboard"} className="flex items-center">
                    {isCollapsed && <img src="/logo/logo-utama-kecil.jpg" className="w-12 block sm:hidden" />}
                </Link>
                <Button variant={"link"} className="hover:text-emerald-600 text-gray-700 hidden md:block cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {!isCollapsed ? <img src="/logo/logo-utama-hitam.png" className="w-38 -mt-3 mb-4" /> : <img src="/logo/logo-utama-kecil.jpg" className="w-10" />}
                </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-2 mt-4">
                <SideNav
                    items={navItems}
                    isCollapsed={isCollapsed}
                    className={cn("space-y-2", isCollapsed && "items-center space-y-2")}
                    currentWorkspace={currentWorkspace}
                />
            </ScrollArea>
            <div className="sm:p-3 w-full">
                <Button variant={"ghost"} size={isCollapsed ? "icon" : "default"} onClick={logout} title="Logout" className="w-full flex justify-start items-center hover:bg-red-200 hover:text-red-700">
                    <LogOut className={cn("justify-center flex items-center m-3")} />
                    {isCollapsed ? "" : <span className="hidden sm:block">Logout</span>}
                </Button>
            </div>
        </div>
    )
}

const SideNav = ({ items, isCollapsed, className, currentWorkspace, ...props }: SidebarNavProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <div className={cn("flex flex-col gap-y-2", className)}{...props}>
            {items.map((el) => {
                const Icon = el.icon
                const isActive = location.pathname === el.href
                const handleClick = () => {
                    if (el.href === "/workspaces") {
                        navigate(el.href)
                    } else if (currentWorkspace && currentWorkspace._id) {
                        navigate(`${el.href}?workspaceId=${currentWorkspace._id}`)
                    } else {
                        navigate(el.href)
                    }
                }
                return <Button
                    key={el.href}
                    title={el.title}
                    variant={isActive ? "outline" : "ghost"}
                    className={cn("justify-start hover:bg-emerald-100 text-slate-700", isActive && "bg-emerald-300 hover:bg-emerald-200 text-black font-semibold")}
                    onClick={handleClick}
                >
                    <Icon className={isCollapsed ? "" : "mr-2 sm:mx-2"} />
                    {isCollapsed ? <span className="sr-only">{el.title}</span> : (el.title)}
                </Button>
            })}
        </div>
    )
}

export { Header, SidebarComponent, SideNav }