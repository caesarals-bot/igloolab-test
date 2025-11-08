import { Outlet } from "react-router"
import { Navbar } from "../components/navbar/Navbar"
import { mockUser } from "@/data/mockData"
import Footer from "../components/footer/Footer"

const LayoutPage = () => {
    // MODO DESARROLLO: Cambiar isAuthenticated para alternar entre estados
    // true = modo autenticado (muestra Dashboard y usuario)
    // false = modo público (muestra Home, Productos, Login)
    const isAuthenticated = false
    const user = isAuthenticated ? mockUser : null

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default LayoutPage
