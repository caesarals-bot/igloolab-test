import { createBrowserRouter } from "react-router"
import LayoutPage from "../app/layout/LayoutPage"
import HomePage from "../app/home/HomePage"
import ProductosPage from "../app/products/ProductsPage"
import AdminLayout from "../admin/layout/AdminLayout"
import DashboardPage from "../admin/page/DashboardPage"
import MedicationsPage from "../admin/page/MedicationsPage"
import SettingsPage from "../admin/page/SettingsPage"
import LoginPage from "../auth/LoginPage"
import RegisterPage from "../auth/RegisterPage"

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <LayoutPage />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/productos",
                element: <ProductosPage />
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "/admin/dashboard",
                element: <DashboardPage />
            },
            {
                path: "/admin/medications",
                element: <MedicationsPage />
            },
            {
                path: "/admin/settings",
                element: <SettingsPage />
            }
        ]
    }
])

export default AppRouter
