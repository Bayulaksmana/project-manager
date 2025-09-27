import { useNavigate } from "react-router"
import { Button } from "./ui/button"
import { CornerUpLeftIcon } from "lucide-react"

export const BackButton = () => {
    const navigate = useNavigate()
    return (
        <Button variant={"outline"} size={"sm"} onClick={() => navigate(-1)} className="hover:bg-emerald-200 w-fit text-xs items-center flex">
            <CornerUpLeftIcon className="size-4" />
            <span className="sm:block hidden">Back</span>
        </Button>
    )
}