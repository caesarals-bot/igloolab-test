import { lazy } from "react"
import { createBrowserRouter } from "react-router"
import { ProtectedRoute } from "@/components/common/ProtectedRoute"

// Layouts cargados síncronamente (necesarios para la estructura)
import LayoutPage from "../app/layout/LayoutPage"
import AdminLayout from "../admin/layout/AdminLayout"

// Páginas públicas - lazy loading
const HomePage = lazy(() => import("../app/home/HomePage"))
const ProductosPage = lazy(() => import("../app/products/ProductsPage"))

// Páginas de autenticación - lazy loading
const LoginPage = lazy(() => import("../auth/LoginPage"))
const RegisterPage = lazy(() => import("../auth/RegisterPage"))

// Páginas de administración - lazy loading (prioridad alta)
const DashboardPage = lazy(() => import("../admin/page/DashboardPage"))
const MedicationsPage = lazy(() => import("../admin/page/MedicationsPage"))
const SettingsPage = lazy(() => import("../admin/page/SettingsPage"))

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
        element: (
            <ProtectedRoute allowedRoles={['admin', 'user']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
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
