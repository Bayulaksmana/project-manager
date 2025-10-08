import { fetchData, updateData } from "@/lib/fetch-utils";
import type {
    ChangePasswordFormData,
    ProfileFormData,
} from "@/routes/user/profile";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUserProfileQuery = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => fetchData("/users"),
    });
};
export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordFormData) =>
            updateData("/users/change-password", data),
    });
};
export const useUpdateUserProfile = () => {
    return useMutation({
        mutationFn: (data: ProfileFormData) =>
            updateData("/users", data),
    });
};