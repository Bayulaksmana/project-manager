import type { CreateProjectFormData } from "@/components/dashboard/project-component"
import { fetchData, postData } from "@/lib/fetch-utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const UseCreateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: { projectData: CreateProjectFormData, workspaceId: string }) =>
            postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["workspace", data.workspace]
            })
        }
    })
}
export const UseProjectQuery = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => fetchData(`/projects/${projectId}/tasks`)
    })
}


