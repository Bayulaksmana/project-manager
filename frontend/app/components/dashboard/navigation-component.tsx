import { useAuth } from "@/providers/auth-context"
import { RandomColors, type HeaderProps, type SidebarNavProps, type Workspace } from "@/types"
import { Button } from "../ui/button"
import { BadgeCheck, Bell, CircleCheckIcon, CircleHelpIcon, CircleIcon, FileArchive, FileChartPieIcon, Home, InfoIcon, LayoutDashboard, ListIcon, ListTodo, LogInIcon, LogOut, LucideTabletSmartphone, PlusCircle, Search, Settings2, UserLock, UserRoundCogIcon, Users, WorkflowIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Link, useLoaderData, useLocation, useNavigate } from "react-router"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { WorkspaceAvatar } from "./workspace-component"
import Image from "../utils/image"
import { Input } from "../ui/input"
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "../ui/sheet"
import { Separator } from "../ui/separator"


const Header = ({ onWorkspaceSelected, selectedWorkspace, onCreateWorkspace }: HeaderProps) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { workspaces } = useLoaderData() as { workspaces: Workspace[] }
    const handleOnClick = (workspace: Workspace) => {
        onWorkspaceSelected(workspace);
        navigate(`/workspaces/${workspace._id}`);
    };
    return (
        <div className="bg-background sticky top-0 z-40 border-b">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className="hover:bg-emerald-100" >
                            {selectedWorkspace ?
                                (<>
                                    {selectedWorkspace.color && <WorkspaceAvatar color={selectedWorkspace.color} name={selectedWorkspace.name} className="w-6 h-5 rounded" />}
                                    <span className="font-medium">{selectedWorkspace?.name}</span>
                                </>) :
                                (<span className="font-medium text-xs">Selected Workspace</span>)
                            }
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="text-xs text-center">Workspace</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {workspaces.map((ws) => (
                                <DropdownMenuItem
                                    key={ws._id}
                                    onClick={() => {
                                        handleOnClick(ws)
                                    }}>
                                    {ws.color && (<WorkspaceAvatar color={ws.color} name={ws.name} className="w-7 h-7 font-semibold rounded flex items-center justify-center" />)}
                                    <span className="ml-2 text-xs font-semibold tracking-wide">{ws.name}</span>
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
                        <DropdownMenuContent align="end" className="w-fit text-gray-700 font-medium gap-2 tracking-wide">
                            <DropdownMenuLabel className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-gray-500" />
                                {user && (<><img src={user.profilePicture} alt="" className="w-4 h-4 rounded-2xl" /></>)}
                                Login as<span className="font-semibold">{user?.name}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="default"><Link to={"/dashboard"} className="flex items-center gap-2"><LayoutDashboard />Dashboard</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link to={"/profile"} className="flex items-center gap-2"><UserRoundCogIcon />My Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem><Link to={"/setings"} className="flex items-center gap-2"><Settings2 />Setting</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link to={"/"} className="flex items-center gap-2"><Home />Homepage</Link></DropdownMenuItem>
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
        // {
        //     title: "Homepage",
        //     href: "/",
        //     icon: Home
        // },
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
                    {!isCollapsed ? <img src="/logo/logo-utama-hitam.png" className="w-38 mb-4" /> : <img src="/logo/logo-utama-kecil.jpg" className="w-10" />}
                </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-2 mt-4 tracking-wide">
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
        <div className={cn("flex flex-col", className)}{...props}>
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

const NavigationHomepage = () => {
    const { user } = useAuth()
    const [openSearchBar, setOpenSearchBar] = useState(false)
    const [open, setOpen] = useState(false);

    interface NavLink {
        to: string;
        label: string;
    }
    const navLinks: NavLink[] = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/services", label: "Services" },
        { to: "/contact", label: "Contact" },
    ];

    const navMenuProps: { title: string; href: string; description: string }[] = [
        {
            title: "Alert Dialog",
            href: "/docs/primitives/alert-dialog",
            description:
                "A modal dialog that interrupts the user with important content and expects a response.",
        },
        {
            title: "Hover Card",
            href: "/docs/primitives/hover-card",
            description:
                "For sighted users to preview content available behind a link.",
        },
        {
            title: "Progress",
            href: "/docs/primitives/progress",
            description:
                "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
        },
        {
            title: "Scroll-area",
            href: "/docs/primitives/scroll-area",
            description: "Visually or semantically separates content.",
        },
        {
            title: "Tabs",
            href: "/docs/primitives/tabs",
            description:
                "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        },
        {
            title: "Tooltip",
            href: "/docs/primitives/tooltip",
            description:
                "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        },
    ]
    const ListItem = ({ title, children, href, ...props }: React.ComponentPropsWithoutRef<"li"> & { href: string }) => {
        return (
            <li {...props}>
                <NavigationMenuLink asChild>
                    <Link to={href}>
                        <div className="text-sm leading-none font-medium">{title}</div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            {children}
                        </p>
                    </Link>
                </NavigationMenuLink>
            </li>
        )
    }
    return (
        <div className="flex justify-between items-center -ml-2 md:ml-0 md:mr-2 py-4 z-1">
            <Link to="/" className="transition-transform hover:scale-105">
                <Image src="logo/logo.svg" alt={'logo svg'} w={32} h={32} className={'w-full h-16 object-contain hidden sm:block'} />
                <Image src="logo/logo-utama-besar.jpg" alt={'logo svg'} w={50} h={50} className={' block sm:hidden'} />
            </Link>
            <NavigationMenu viewport={false} className="hidden md:block">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-md">Home</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-2xl"
                                            href="/"
                                        >
                                            <div className="mt-4 mb-2 text-lg font-medium">
                                                shadcn/ui
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-tight">
                                                Beautifully designed components built with Tailwind CSS.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/docs" title="Introduction">
                                    Re-usable components built using Radix UI and Tailwind CSS.
                                </ListItem>
                                <ListItem href="/docs/installation" title="Installation">
                                    How to install dependencies and structure your app.
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Typography">
                                    Styles for headings, paragraphs, lists...etc
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-md">Components</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[300px] gap-2 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                                {navMenuProps.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/docs"><span className="text-md">Docs</span></Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-md">List</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[300px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">
                                            <div className="font-medium">Components</div>
                                            <div className="text-muted-foreground">
                                                Browse all components in the library.
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">
                                            <div className="font-medium">Documentation</div>
                                            <div className="text-muted-foreground">
                                                Learn how to use the library.
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">
                                            <div className="font-medium">Blog</div>
                                            <div className="text-muted-foreground">
                                                Read our latest blog posts.
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-md">Simple</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Components</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Documentation</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#">Blocks</Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem >
                        <NavigationMenuTrigger className="text-md" >Action</NavigationMenuTrigger>
                        <NavigationMenuContent >
                            <ul className="grid w-[120px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="/sign-in" className="flex-row items-center gap-2  hover:bg-emerald-200">
                                            <LogInIcon />
                                            Sign In
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="sign-up" className="flex-row items-center gap-2">
                                            <UserLock />
                                            Sign Up
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="#" className="flex-row items-center gap-2">
                                            <InfoIcon />
                                            About Us
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            {/* Mobile Navigation */}
            <div className="flex items-center justify-center -mr-6 md:mr-0">
                <Button variant={"ghost"} title="Search" onClick={() => setOpenSearchBar(true)} className="hover:text-emerald-600 hover:bg-sky-100 md:block hidden">
                    <Search className="size-6 text-muted-foreground" />
                </Button>
                <button title="Side Bar" onClick={() => setOpen(true)} className="hover:text-emerald-600 mr-4 block md:hidden">
                    {open
                        ? (<LucideTabletSmartphone className="size-7 text-slate-700" />)
                        : (<ListIcon className="size-7 text-slate-700" />)
                    }
                </button>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side={"top"} className="bg-sky-50 px-10 flex flex-col justify-between">
                    <SheetHeader className="right-1">
                        <Image src="logo/logo.svg" alt={'logo svg'} w={0} h={0} className={'w-full right-1 flex h-16 object-contain -mb-6'} />
                    </SheetHeader>
                    <Separator />
                    <div className="relative flex justify-between ">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-10 w-full" placeholder="Search now ..." />
                    </div>
                    <div className="flex flex-col text-sm tracking-wider font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                // className="hover:text-emerald-400 transition-colors wfull p-1 rounded text-center"
                                className={cn("justify-start hover:bg-emerald-100 text-slate-700", navLinks && "hover:bg-sky-200 text-black p-1")}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="">
                        <Link to={"/dashboard"}>
                            {user ? (<div className="flex items-center">
                                <button type="button" title={user.name} className=" w-10 rounded-md flex items-center justify-center bg-none!">
                                    <img src={user.profilePicture} alt="Login" className='rounded-md w-9 h-6' />
                                </button>
                                    <h1 className="">
                                        <span className="font-semibold italic tracking-wide flex"><BadgeCheck className="w-3 h-3" />{user.name}</span>
                                    </h1>
                            </div>) : (<>
                                <Button type="button" variant={"ghost"} className="flex items-center justify-center hover:bg-emerald-50 w-full">
                                    <LogInIcon />Login
                                </Button>
                            </>)}
                        </Link>
                    </div>
                    <SheetFooter className="mt-8 border-t text-xs text-center text-gray-600 flex flex-col gap-1">
                        <span >Moyokapit © 2025. All rights reserved.</span>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}




export { Header, SidebarComponent, SideNav, NavigationHomepage }