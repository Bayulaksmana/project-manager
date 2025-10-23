import type { StoryspaceForm } from "@/components/dashboard/storyspace-component"
import { deleteData, fetchData, patchData, postData } from "@/lib/fetch-utils"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateStory = () => {
    return useMutation({
        mutationFn: async (data: StoryspaceForm) => postData("/storyspaces", data)
    })
}
export const useGetStoryspaceQuery = (status: string, page: number) => {
    return useQuery({
        queryKey: ["storyspaces", status, page],
        queryFn: async () => fetchData(`/storyspaces?status=${status}&page=${page}`, page)
    })
}
export const useGetStoryBySLug = (slug: string) => {
    return useQuery({
        enabled: !!slug,
        queryKey: ["post", "storyspaces", slug],
        queryFn: async () => fetchData(`/slug/${slug}`, slug)
    })
}

export const useDeletePostMutation = () => {
    return useMutation({
        mutationFn: async (postId: string) => {
            return await deleteData(`/storyspaces/${postId}`);
        },
    });
};
export const useRestorePostMutation = () => {
    return useMutation({
        mutationFn: async (postId: string) => {
            return await patchData(`/storyspaces/${postId}`);
        },
    });
};
