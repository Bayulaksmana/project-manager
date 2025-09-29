import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/root/homepage-layout.tsx", [
        index("routes/root/home.tsx"),
    ]),
    layout("routes/auth/auth-layout.tsx", [
        route("sign-in", "routes/auth/sign-in.tsx"),
        route("sign-up", "routes/auth/sign-up.tsx"),
        route("forgot-password", "routes/auth/forgot-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
        route("verify-email", "routes/auth/verify-email.tsx"),
    ]),
    layout("routes/dashboard/dashboard-layout.tsx", [
        route("dashboard", "routes/dashboard/index.tsx"),
        route("workspaces", "routes/dashboard/workspaces/index.tsx"),
        route("storyspaces", "routes/dashboard/storyspaces/index.tsx"),
        route("my-tasks", "routes/dashboard/my-task/index.tsx"),
        route("workspaces/:workspaceId", "routes/dashboard/workspaces/workspace-details.tsx"),
        route("workspaces/:workspaceId/projects/:projectId", "routes/dashboard/project/index.tsx"),
        route("workspaces/:workspaceId/projects/:projectId/tasks/:taskId", "routes/dashboard/task/index.tsx"),
        route("members", "routes/dashboard/members/index.tsx"),
        route("/profile", "routes/user/profile.tsx")
    ]),

    route("workspace-invite/:workspaceId", "routes/dashboard/workspaces/workspace-invite.tsx"),
] satisfies RouteConfig;
