import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../auth/hooks/useAuth'

const Protected = ({ children }) => {

    const { user, loading } = useAuth()
    const { pathname } = useLocation()

    if (loading) {
        return (
            <main className='h-screen bg-gray-50 flex justify-center items-center'>
                <h1>Loading...</h1>
            </main>
        )
    }

    if (!user) {
        return <Navigate to={"/login"} />
    }

    const onboardingCompleted = user.onboardingCompleted
        ?? user.onboarding?.completed
        ?? false

    if (pathname === "/onboarding" && onboardingCompleted) {
        return <Navigate to="/" replace />
    }

    if (!onboardingCompleted && pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />
    }

    return children

}

export default Protected
