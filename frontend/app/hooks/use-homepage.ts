import { fetchData } from "@/lib/fetch-utils"
import { useQuery } from "@tanstack/react-query"

export const useGetCarousel = () => {
    return useQuery({
        queryKey: ["carousel"],
        queryFn: async () => fetchData("/homepage")
    })
}