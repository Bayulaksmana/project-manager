import Loading from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/workspace/workspace-component";
import {
    useAcceptGenerateInviteMutation,
    useAcceptInviteByTokenMutation,
    useGetWorkspaceDetailsQuery,
} from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

const WorkspaceInvite = () => {
    const { workspaceId } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("tk");
    const navigate = useNavigate();
    if (!workspaceId) return <Loading />
    const { data: workspace, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as
        { data: Workspace; isLoading: boolean };
    const { mutate: acceptInviteByToken, isPending: isAcceptInviteByTokenPending, } = useAcceptInviteByTokenMutation();
    const { mutate: acceptGenerateInvite, isPending: isAcceptGenerateInvitePending, } = useAcceptGenerateInviteMutation();

    const handleAcceptInvite = () => {
        if (!workspaceId) return;
        if (token) {
            acceptInviteByToken(token, {
                onSuccess: () => {
                    toast.success("Invitation accepted");
                    navigate(`/workspaces/${workspaceId}`);
                }, onError: (error: any) => {
                    toast.error(error.response.data.message);
                    console.log(error);
                },
            });
        } else {
            acceptGenerateInvite(workspaceId, {
                onSuccess: () => {
                    toast.success("Invitation accepted");
                    navigate(`/workspaces/${workspaceId}`);
                },
                onError: (error: any) => {
                    toast.error(error.response.data.message);
                    console.log(error);
                },
            });
        }
    };

    const handleDeclineInvite = () => {
        toast.info("Invitation declined");
        navigate("/workspaces");
    };

    if (isLoading) {
        return (
            <div className="flex w-full h-screen items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Invalid Invitation</CardTitle>
                        <CardDescription>
                            This workspace invitation is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/workspaces")} className="w-full">
                            Go to Workspaces
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <WorkspaceAvatar name={workspace.name} color={workspace.color} className="w-5 h-5 items-center justify-center flex rounded" />
                        <CardTitle>{workspace.name}</CardTitle>
                    </div>
                    <CardDescription className="text-justify">
                        You've been invited to join the "<strong>{workspace.name}</strong>"
                        workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {workspace.description && (
                        <p className="text-sm text-muted-foreground text-justify">
                            {workspace.description}
                        </p>
                    )}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 hover:bg-emerald-500 hover:text-white"
                            size={"sm"}
                            onClick={handleAcceptInvite}
                            disabled={
                                isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
                            }
                        >
                            {isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
                                ? "Joining..."
                                : "Accept Invitation"}
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 hover:bg-red-400 hover:text-black"
                            size={"sm"}
                            onClick={handleDeclineInvite}
                            disabled={
                                isAcceptInviteByTokenPending || isAcceptGenerateInvitePending
                            }
                        >
                            Decline
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkspaceInvite;