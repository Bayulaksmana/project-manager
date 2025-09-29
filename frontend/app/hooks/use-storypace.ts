import type { StoryspaceForm } from "@/components/dashboard/storyspace-component"
import { fetchData, postData } from "@/lib/fetch-utils"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateStory = () => {
    return useMutation({
        mutationFn: async (data: StoryspaceForm) => postData("/writespaces", data)
    })
}
export const useGetStoryspaceQuery = () => {
    return useQuery({
        queryKey: ["storyspaces"],
        queryFn: async () => fetchData("/storyspaces")
    })
}
