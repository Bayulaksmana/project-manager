import { useNavigate } from "react-router"
import { CornerUpLeftIcon } from "lucide-react"
import { Button } from "../ui/button"

export const BackButton = () => {
    const navigate = useNavigate()
    return (
        <Button variant={"outline"} size={"sm"} onClick={() => navigate(-1)} className="hover:bg-emerald-200 w-fit text-xs items-center flex">
            <CornerUpLeftIcon className="size-4" />
            <span className="sm:block hidden">Back</span>
        </Button>
    )
}