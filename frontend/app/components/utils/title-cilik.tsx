import { Link } from "react-router"

interface NotedProps {
    link: string,
    title: string,
    page: string,
    className:string
}
const Noted = ({ link, title, page, className }: NotedProps) => {
    return (
        <div className="flex gap-2 font-cabella uppercase text-md">
            <Link to={link}>{title}</Link>
            <span>•</span>
            <span className={className}>{page}</span>
        </div>
    )
}

export default Noted