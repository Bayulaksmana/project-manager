import { useAuth } from '@/providers/auth-context'
import { Navigate, Outlet } from 'react-router'

const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useAuth()
    if(isLoading){
        return <div>loading...</div>
    }
    if(isAuthenticated){
        return <Navigate to="/dashboard" />
    }
    return <Outlet />
}

export default AuthLayout