import { Link } from "react-router"

interface NotedProps {
    link: string,
    title: string,
    page: string
}
const Noted = ({ link, title, page }: NotedProps) => {
    return (
        <div className="flex gap-4 font-cabella uppercase text-lg">
            <Link to={link}>{title}</Link>
            <span>•</span>
            <span className="text-blue-800">{page}</span>
        </div>
    )
}

export default Noted