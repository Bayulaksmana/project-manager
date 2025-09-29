import { NavigationHomepage } from "@/components/dashboard/navigation-component"
import { Outlet } from "react-router"
// import Navbar from "../components/Navbar"

const MainLayout = () => {

    return (
        <div className='px-6 flex flex-col md:space-y-2'>
            <NavigationHomepage />
            <Outlet />
        </div>
    )
}

export default MainLayout