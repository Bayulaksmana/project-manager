import Loading from '@/components/utils/loader'
import { useAuth } from '@/providers/auth-context'
import { Navigate, Outlet } from 'react-router'

const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useAuth()
    if(isLoading){
        return <Loading/>
    }
    if(isAuthenticated){
        return <Navigate to="/dashboard" />
    }
    return <Outlet />
}

export default AuthLayout