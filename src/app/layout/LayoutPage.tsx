import { Suspense } from "react"
import { Outlet } from "react-router"
import { Navbar } from "../components/navbar/Navbar"
import Footer from "../components/footer/Footer"
import { PageLoader } from "@/components/common/PageLoader"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useAuthContext } from "@/context"

const LayoutPage = () => {
    // Obtener usuario autenticado del AuthContext
    const { user } = useAuthContext()

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />
            <main className="flex-1">
                <ErrorBoundary>
                    <Suspense fallback={<PageLoader message="Cargando página..." />}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </main>
            <Footer />
        </div>
    )
}

export default LayoutPage
